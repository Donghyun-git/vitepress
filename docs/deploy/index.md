# 배포 및 유지보수

## 📌 매뉴얼 배포

### 프로젝트 빌드

이제 만든 매뉴얼을 다른 사람들이 볼 수 있도록 사내 서버와 외부 서버로 배포 해야합니다.

프로젝트를 먼저 빌드해주겠습니다.

```sh
$ npm run docs:build
```

빌드가 완료되면 `/.vitepress` 경로에 `dist` 빌드 폴더가 생깁니다.

`preview` 로 빌드가 제대로 진행되었는지 확인해주겠습니다.

```sh
$ npm run docs:preview
```

브라우저 탭의 `favicon` 과 좌측 사이드바 위의 `title` 부분에 로고를 넣었다면 보이지 않습니다.

`vitepress` 는 빌드 시, 각 페이지에 연관되어 있는 정적 파일만 `assets` 폴더에 포함시킵니다.

따라서 따로 빌드되지 않는 정적 파일도 `dist` 폴더에 포함시키기 위해 빌드용 쉘스크립트를 하나 만들겠습니다.

```sh
# build.sh

cd ./.vitepress

rm -rf ./dist

cd ..

npm run docs:build

# 예시
mkdir -p ./.vitepress/dist/images

cp -r ./docs/images/vitepress-logo-mini.svg ./.vitepress/dist/images/vitepress-logo-mini.svg

cp -r ./docs/pdf_file ./.vitepress/dist/pdf_file
```

다시 `preview` 커맨드를 실행하고 로컬에 띄워보면, 잘 보이는 것을 확인하실 수 있습니다 :smile:

<br>
이제 빌드한 매뉴얼 프로젝트를 서버에 띄우는 것만 남았습니다.

총 두 개의 서버가 있습니다.

    1. 사내 개발 서버
    2. 외부망 서버

먼저 팀 내부에서 사용하고 있는 개발 서버 IP로 배포해보겠습니다.

### 개발 서버로 빌드 파일 전송하기

먼저, 빌드파일을 서버로 전송해야합니다.

앞서 작성했던 `build.sh`에 이어서 압축 후 ssh 서버로 전송하는 스크립트를 추가해주겠습니다.

```sh
# deploy.sh

cd ./.vitepress

rm -rf ./dist

cd ..

npm run docs:build

# 예시
mkdir -p ./.vitepress/dist/images

cp -r ./docs/images/vitepress-logo-mini.svg ./.vitepress/dist/images/vitepress-logo-mini.svg

cp -r ./docs/pdf_file ./.vitepress/dist/pdf_file


# 이어서..

cd ./.vitepress/dist

echo -e "\033[1;36m[-] TAR DIST FOLDER ... \033[0m"

tar -czf ../../manual-build.tgz ./*

cd ../../


echo -e "\033[1;36m[-] SUCCESS TAR AND CONNECT TO 192.168.0.81:/home/user\033[0m"


"/c/Program Files/PUTTY/pscp.exe" -pw "password" ./manual-build.tgz user@183.111.104.98:/home/user/Manual/content/
```

<br>

<LightBoxImg src="/images/scp_result.png" />

성공적으로 압축파일을 전송한 모습입니다.

<br>

```sh
$ tar -xvf ./manual-build.tgz
```

위 커맨드를 실행하여 압축을 풀면 배포하기 위한 준비는 모두 끝납니다.

<br>

### 사내 개발 서버 배포

`docker` 와 `docker-compose`를 사용하고 있기 때문에 `nginx` 이미지를 이용해 컨테이너로 띄워보겠습니다.

먼저 매뉴얼 디렉토리 최상위에 `docker-compose.yaml` 파일을 작성해주겠습니다.

```yaml
version: "2"

services:
  eCrossv5-Manual:
    image: nginx:latest
    container_name: "eCrossv5-Manual"
    restart: always
    ports:
      - "4001:80"
    volumes:
      - "/home/inzent/ec5manual/content:/usr/share/nginx/html"

networks:
  default:
    external:
      name: devops
```

`4001` 포트로 배포해주겠습니다.

<br>

그리고 컨테이너를 구동해주겠습니다.

```sh
$ docker-compose up -d
```

<br>

구동된 docker 컨테이너 현황을 확인해보겠습니다.

```sh
$ docker ps
```

<LightBoxImg src="/images/manual_docker_ps.png" />

성공적으로 컨테이너가 구동된 모습입니다. :smile:

<br>

#### 매뉴얼 페이지 배포 확인

`http://{ip}:{port}` 에 접속하여 배포된 매뉴얼을 확인해봅니다.

정상적으로 페이지가 나오는 것을 확인하실 수 있습니다! :smile:

<LightBoxImg src="/images/deploy_manual_result.png" />

<br>

##### 404 페이지

배포된 매뉴얼을 보고 뿌듯해 하던 와중 이상한 화면을 발견합니다.

<LightBoxImg src="/images/404.png" />

url 입력창에 주소를 잘못 쳤는데, `vitepress`의 404 페이지가 아닌 `nginx 404` 페이지가 렌더링 되었습니다.

빌드 파일을 다시 한 번 확인해보겠습니다.

<LightBoxImg src="/images/404_shooting.png" />

`404.html`과 `index.html`이 따로 있는 것을 볼 수 있습니다.

`vitepress`는 빌드 시, 404 페이지는 따로 번들링 되는 것 같습니다.

<br>

`nginx` 세팅을 변경해주겠습니다. 먼저 `index.html`과 `404.html`을 서빙하기 위해 각각의 경로에 맞는 location 블록을 만들어주겠습니다.

`docker-compose.yaml` 파일과 같은 디렉토리 경로에서,

```sh
$ mkdir ./nginx-conf

$ cd ./nginx-conf

$ vi default.conf
```

`vim` 에디터 환경으로 들어와주겠습니다.

```nginx
server {
    listen       80;
    server_name  localhost;
    root   /usr/share/nginx/html;
    index  index.html index.htm;

    # VitePress SPA 라우팅을 위한 설정
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 404 에러 페이지 설정 - 절대 경로 사용
    error_page  404  /404.html;
    location = /404.html {
        root /usr/share/nginx/html;
        internal;
    }
}

```

모든 경로에 대해 실제 파일이나 디렉토리가 없으면 `index.html` 을 서빙합니다.

그리고 nginx 404 에러가 나타난다면 `404.html`을 서빙하도록 설정해줍니다.

그리고 `docker-compose.yaml` 을 다시 `vim`에디터로 열고, 해당 설정 파일을 볼륨에 마운트 시켜주겠습니다.

```yaml
version: "2"

services:
  eCrossv5-Manual:
    image: nginx:latest
    container_name: "eCrossv5-Manual"
    restart: always
    ports:
      - "4001:80"
    volumes:
      - "/home/inzent/ec5manual/content:/usr/share/nginx/html"
      - "/home/inzent/ec5manual/nginx-conf/default.conf:/etc/nginx/conf.d/default.conf" #[!code ++]

networks:
  default:
    external:
      name: devops
```

그리고 컨테이너를 내렸다가 다시 구동시켜주겠습니다.

```sh
$ docker-compose stop

$ docker-compose up -d
```

다시 한 번 배포된 URL 로 접속해보겠습니다.

<LightBoxImg src="/images/vitepress_404.png" />

성공적으로 `vitepress` 의 404 페이지를 노출시켰습니다.

마지막으로 `docker` 커맨드를 쉘스크립트로 빼놓겠습니다.

`start.sh`

```sh
docker-compose up -d
```

`stop.sh`

```sh
docker-compose down
```

## 📌젠킨스 스크립트 만들기

모든 과정이 끝났습니다. 배포 순서를 한 번 짚어보겠습니다.

현재까지 매뉴얼 배포를 위해서는

:::info

1. `deploy.sh`를 실행하여 배포 서버로 압축파일 전송
2. 서버 `ssh` 접속 후, 압축파일 경로로 이동
3. 압축 해제
4. 컨테이너 `stop`후 다시 기동
   :::

어떻게 보면 이 것도 귀찮습니다.

이 과정을 모두 젠킨스 스크립트로 자동화 해보겠습니다.

```groovy
pipeline{
    agent any

    tools {
        nodejs 'NodeJs18.12.1'
    }

    stages{
        stage('git Clone'){
            steps {
                echo '======= Clonning Git Repository ======='
                git url: 'https://gitlab-ecross.inzent.com/ecrossrd/ecrossv5_manual', branch :"${params.branch}", credentialsId: 'gitlab Access Token'
            }
        }

        stage('npm install'){
            steps{
                echo '====== npm install ======='
                sh 'node --version'
                sh 'npm install'
            }
        }

        stage('npm run build'){
            steps{
                echo '====== npm run build ======='
                sh 'npm run docs:build'
                sh 'pwd'
                sh 'ls -al'
            }
        }


        stage('move pdf file'){
            steps {
                echo '====== move pdf file ======='

                sh "mv ./docs/pdf_file ./.vitepress/dist/pdf_file"
           }
        }


        stage('stop manual'){
            steps{
                script{
                    echo '======= Stop Manual Module ======='
                   
                    String stopCommand =  "cd $deploymentDir && ./stop.sh"
                    String sshTargetName = 'ssh-dev-98-eCrossV5'

                    sshPublisher(
                        continueOnError: true,
                        failOnError: false,
                        publishers: [
                            sshPublisherDesc(
                                configName: sshTargetName,
                                verbose: true,
                                transfers: [
                                    sshTransfer(execCommand: stopCommand),
                                ],
                            ),
                        ],
                    )
                }
            }
        }

        stage('zip and deploy'){

            steps{
                echo 'ZIP AND DEPLOY'

                sh 'rm -rf ./dist'
                sh 'mv /var/jenkins_home/workspace/eCrossv5_manual/.vitepress/dist ./dist'
                sh 'tar -czf manual-build.tgz -C dist .'
                sh 'ls -al'

                script{

                    String sshTargetName = 'ssh-dev-98-eCrossV5'
                    String sourceFiles  = "manual-build.tgz"
                    String remoteDirectory = "$deploymentDir/content"

                    sshPublisher(
                        continueOnError: true,
                        failOnError: false,
                        publishers: [
                            sshPublisherDesc(
                                configName: sshTargetName,
                                verbose: true,
                                transfers: [
                                    sshTransfer(
                                        sourceFiles: sourceFiles,
                                        remoteDirectory: remoteDirectory,
                                        cleanRemote: false,
                                    ),
                                ],
                            ),
                        ],
                    )
                }
            }
        }

        stage('unzip file'){
            steps{
                script{
                    echo '======= Unzip ======='
                    String unzipCommand =  "cd $deploymentDir/content && tar -xvf manual-build.tgz"
                    String sshTargetName = 'ssh-dev-98-eCrossV5'

                    sshPublisher(
                        continueOnError: true,
                        failOnError: false,
                        publishers: [
                            sshPublisherDesc(
                                configName: sshTargetName,
                                verbose: true,
                                transfers: [
                                    sshTransfer(execCommand: unzipCommand),
                                ],
                            ),
                        ],
                    )
                }
            }
        }

        stage('start manual'){
            steps{
                script{
                    echo '======= START ======='
                   
                    String startCommand =  "cd $deploymentDir && ./start.sh"
                    String sshTargetName = 'ssh-dev-98-eCrossV5'

                    sshPublisher(
                        continueOnError: true,
                        failOnError: false,
                        publishers: [
                            sshPublisherDesc(
                                configName: sshTargetName,
                                verbose: true,
                                transfers: [
                                    sshTransfer(execCommand: startCommand),
                                ],
                            ),
                        ],
                    )
                }
            }
        }
    }
}
```

순서는 다음과 같습니다.

1.  `git Clone` 단계

- GitLab 저장소에서 매뉴얼 브랜치의 최신 소스 코드를 가져옵니다.

2. `npm install` 단계

- 프로젝트 빌드 및 실행에 필요한 Node.js 라이브러리를 설치합니다.

3.  `npm run build` 단계

- VitePress 프로젝트를 정적 웹사이트 파일(HTML, CSS, JS)로 빌드합니다.

4.  `move pdf file` 단계

- 빌드된 결과물 폴더에 PDF 파일을 포함시킵니다.

5. `stop manual` 단계

- `stop.sh` 파일을 실행하여 배포 대상 서버에서 현재 실행 중인 애플리케이션(Docker 컨테이너 등)을 중지시킵니다.

6.  `zip and deploy` 단계

- 빌드된 정적 파일들을 압축하여 배포 대상 서버로 전송합니다.

7. `unzip file` 단계

- 배포 대상 서버에 전송된 압축 파일을 압축 해제합니다.

8.  `start manual` 단계

- `start.sh` 파일을 실행하여 컨테이너를 구동합니다.

<LightBoxImg src="/images/pipeline.png" />

성공적으로 배포 프로세스가 진행되고 있는 모습입니다. :smile:
