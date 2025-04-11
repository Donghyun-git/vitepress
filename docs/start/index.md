# 기본 설정 및 시작하기

## 📌 기본 설정

`VitePress`를 시작하기 위해서는 먼저 필요한 환경을 설정해야 합니다.

### 필수 요구사항

```plaintext
Node.js: 18 버전 이상
npm 또는 yarn, pnpm 같은 패키지매니저
```

<br>

#### .nvmrc 생성 ( 선택사항 )

아래와 같이 프로젝트 최상위 경로에 `.nvmrc` 를 생성해주고 현재 사용하고 있는 `Node.js의 버전` 을 명시해주었습니다.

```text
v20.18.2
```

후에 프로젝트 최상위 경로에서

::: code-group

```cmd [Window]
$ nvm use $(cat .nvmrc)
```

```sh [Mac]
$ nvm use
```

:::

커맨드를 실행하면 다른 협업자와의 `Node.js의 버전`을 간편하게 설정할 수 있습니다.

<br>

#### package.json 생성

프로젝트 최상위 경로에서 아래의 커맨드를 입력하여 `VitePress` 패키지를 설치해줍니다.

::: code-group

```sh [npm]
$ npm add -D vitepress
```

```sh [yarn]
$ yarn add -D vitepress
```

```sh [pnpm]
$ pnpm add -D vitepress
```

:::

```json
{
  "devDependencies": {
    "vitepress": "^1.6.3"
  }
}
```

<br>

#### VitePress init 하기

아래의 커맨드를 입력하면 빠른 기본 세팅이 가능합니다.

::: code-group

```sh [npm]
$ npx vitepress init
```

```sh [pnpm]
$ pnpm vitepress init
```

```sh [yarn]
$ yarn vitepress init
```

:::

후에 질의 CLI 에 아래와 같이 모두 응답합니다.

```sh{1}
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./
│
◇  Site title:
│  Manual
│
◇  Site description:
│  A Manual Site
│
◇  Theme:
│   ○ Default Theme (Out of the box, good-looking docs)
│   ● Default Theme + Customization (Add custom Css and layout slots)
│   ○ Custom Theme (Build your own or use external)
│
◇  Use TypeScript for config and theme files?
│   ● Yes / ○ No
│
◇  Add VitePress npm scripts to package.json?
│  ● Yes / ○ No
│
└  Done! Now run pnpm run docs:dev and start writing.

Tips:
- Since you've chosen to customize the theme,
- you should also explicitly install vue as a dev dependency.
```

:::info
│ ● Default Theme + Customization (Add custom Css and layout slots)

커스터마이징 옵션을 선택했기 때문에

`Tips: Since you've chosen to customize the theme,  you should also explicitly install vue as a dev dependency.`

위와 같은 알림이 나타납니다.
:::

::: code-group

```sh [npm]
$ npm install -D vue
```

```sh [pnpm]
$ pnpm add -D vue
```

```sh [yarn]
$ yarn add -D vue yarn vitepress init
```

:::

혹시 모르니 `vue` 패키지도 설치해주겠습니다.

<br>

설치가 모두 완료되면, 프로젝트 구성은 아래와 같아집니다.

```
📦 manual  # 프로젝트 최상위 경로
 ┣ 📂 node_modules
 ┣ 📂 .vitepress
 ┃ ┣ 📂 theme
 ┃ ┃ ┣ 📄 index.ts
 ┃ ┃ ┗ 🎨 style.css
 ┃ ┗ 📄 config.mts
 ┣ 📝 api-examples.md
 ┣ 📝 index.md
 ┣ 📝 markdown-examples.md
 ┣ 🗃️ packgage-lock.json
 ┣ 🗃️ package.json
 ┗ ⚙ .nvmrc
```

### config.mts 설정하기

`/.vitepress/config.mts` 파일은 문서 레이아웃의 구성요소, html 템플릿의 `head`, `meta` 등 브라우저의 기본 필수 요소의 설정을 담당합니다.

초기 파일은 이전 `질의 CLI` 에서 입력했던 내용이 반영되어 아래와 같습니다.

```ts
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config

export default defineConfig({
  title: "My Awesome Project",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],
    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
```

<br>

#### 파일 정리

필요없는 옵션들을 제거하고, 필요한 옵션들을 추가 및 변경해주겠습니다.

```ts
import { defineConfig } from "vitepress";

export default defineConfig({
  head: [["link", { rel: "icon", href: "/images/vitepress-logo-mini.svg" }]],
  srcDir: "./docs",
  base: "/",
  vite: {
    publicDir: "./docs/images",
  },
  lang: "ko-KR",
  locales: {
    root: {
      label: "한국어",
      lang: "ko-KR",
    },
  },
  title: "Vitepress 매뉴얼 구축하기",
  description: "세미나",
  cleanUrls: true,
  markdown: {
    image: {
      lazyLoading: true,
    },
  },
  themeConfig: {
    search: {
      provider: "local",
    },
    logo: "/images/vitepress-logo-mini.svg",
    outline: {
      label: "목차",
      level: "deep",
    },

    sidebar: {
      "/": [
        {
          items: [
            {
              text: "1. 기존 매뉴얼 관리 방법",
              link: "/old/",
              collapsed: false,
              items: [
                {
                  text: "1. 1. 세팅하기",
                  link: "/old/setting/",
                  collapsed: true,
                }, //...
              ],
            },
            {
              text: "2. VitePress를 선택한 이유",
              link: "/why-vitepress/",
              collapsed: false,
            },
            {
              text: "3. 기본 설정 및 시작하기",
              link: "/start/",
              collapsed: false,
            },
            //..
          ],
        },
      ],
    },
  },
});
```

변경해준 `config.mts` 파일의 첫 번째 키 값부터 살펴보겠습니다.

<br>

`head` : HTML 문서의 head태그에 들어갈 컨텐츠를 정의합니다.

```ts
head: [["link", { rel: "icon", href: "/images/vitepress-logo-mini.svg" }] // ex) 브라우저 탭 파비콘 정의
```

`srcDir`: 문서 디렉토리의 루트 경로를 지정합니다.

```ts
srcDir: "./docs"; // docs 폴더 밑에 문서(index.md)를 위치 시켜야합니다.
```

`base`: baseUrl를 정의합니다.

```ts
base: '/',

// ex) /web 으로 설정하면 /start/ 페이지는 /web/start/ 로 접속해야한다.
```

`vite.publicDir`: 정적 컨텐츠의 폴더경로를 정의합니다.

```ts
vite: {
    publicDir: "./docs/images",
  },
```

`locales`: 기본 언어를 세팅합니다.

```ts
lang: "ko-KR",
  locales: {
    root: {
      label: "한국어",
      lang: "ko-KR",
    },
  },
```

`title`: 브라우저 탭 제목을 정의합니다. [ title 태그 ]

```ts
  title: "Vitepress 매뉴얼 구축하기",
```

`cleanUrls`: vitepress는 런타임에 `md` 파일을 `html` 파일로 변환하여 브라우저로 서빙합니다. `/xxx.html` => `/xxx/` 형식으로 url을 정리해줍니다.

```ts
cleanUrls: true,
```

`markdown.image.lazyLoading` : `lazyLoading` 여부 옵션입니다. 추후 `img` 태그에 `loading="lazy"` 옵션이 활성화됩니다.

```ts
markdown: {
    image: {
      lazyLoading: true,
    },
  },
```

##### themeConfig

`serach.provider` : `local` 고정값입니다. 검색 기능을 활성화 시켜줍니다.

```ts
search: {
      provider: "local",
    },
```

`logo`: 좌측 상단 title의 로고 경로입니다.

`subTitle`: 좌측 상단 title 명을 지정합니다.

`outline`: 우측 상단 목차 메뉴의 옵션입니다.

```ts
outline: {
      label: "목차", // 라벨명
      level: "deep", // 목차에 뎁스 적용 <default: h2 까지 뎁스>
    },
```

`sidebar`: side nav bar 를 세팅합니다. 제일 중요한 옵션입니다.

```ts
sidebar: {
      "/": [
        {
          items: [
            {
              text: "1. 기존 매뉴얼 관리 방법",
              link: "/old/",
              collapsed: false,
              items: [
	            {
		          text: "1. 1. 세팅하기",
		          link: "/old/setting/",
		          collapsed: true,
	            },
	            //...
              ]
            },
            {
              text: "2. VitePress를 선택한 이유",
              link: "/why-vitepress/",
              collapsed: false,
            },
            {
              text: "3. 기본 설정 및 시작하기",
              link: "/start/",
              collapsed: false,
            },
			//..
          ],
        },
       
        "/second-manual": [
        {
          items: [
            {
              text: "1. 두번째 매뉴얼 관리 방법",
              link: "/second/",
              collapsed: false,
              items: [
	            {
		          text: "1. 1. 세팅하기",
		          link: "/second/setting/",
		          collapsed: true,
	            },
	            //...
              ]
            },
			//..
          ],
      ],
    },
```

키 값으로 `[path: string]` 을 줍니다.

위의 예제는 2가지지만, 저희 팀의 경우 매뉴얼이 3가지 이기 때문에 3개로 나누었습니다.

각 배열 아이템 객체에는

```ts
{
  text: "2. VitePress를 선택한 이유",
  link: "/why-vitepress/",
  collapsed: false,
  items: [],
},
```

위와 같은 데이터 구조로 구성됩니다. `items` 배열에는 동일한 데이터 구조의 객체 아이템들로 하위링크를 구성할 수 있습니다.

`text` 에는 사이드바 링크의 라벨,

`link` 에는 클릭이벤트가 발생했을 때 실제로 이동되는 경로,

`collapsed`는 하위 링크가 존재할 때, 페이지 초기 로드 시 `default spread` 여부를 나타냅니다.

## 📌 디렉토리 구조 잡기

`config` 세팅에 맞게 폴더구조를 변경해보겠습니다.

```md
📦 manual # 프로젝트 최상위 경로
┣ 📂 node_modules
┣ 📂 .vitepress
┃ ┣ 📂 theme
┃ ┃ ┣ 📄 index.ts
┃ ┃ ┗ 🎨 style.css
┃ ┗ 📄 config.mts
┣ 📂 docs # srcDir
┃ ┣ 📂 images # publicDir
┃ ┃ ┣ 🎨 vitepress-logo-mini.svg
┃ ┃ ┗ 🎨 favicon.ico
┃ ┃ ┗ 📄 index.md # / 경로 접근 시
┃ ┗ 📄 config.mts
┣ 📝 README.md
┣ 🗃️ packgage-lock.json
┣ 🗃️ package.json
┗ ⚙ .nvmrc
```

`docs` 폴더를 만들어 `/` 경로로 접근했을 때 보여줄 마크다운 파일과, 브라우저에서 이미지 파일들이 로드 될 경로에 `publicDir` 인 `/docs/images` 폴더를 생성하고 `favicon`과 `logo`를 넣어주었습니다.

## 📌 홈페이지 레이아웃 잡기

### index.md

```markdown
---

# https://vitepress.dev/reference/default-theme-home-page

layout: home

hero:
  name: "My Awesome Project"
  text: "A VitePress Site"
  tagline: My great project tagline
  actions:
    - theme: brand
      text: Markdown Examples
      link: /markdown-examples
    
    - theme: alt
      text: API Examples
      link: /api-examples

features:
  - title: Feature A
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit

  - title: Feature B
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit

  - title: Feature C
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit

---
```

초기 메인페이지의 구조는 `yaml 프론트매터` 로 작성되어 있고, 해당 경로로 접속하면 다음과 같은 페이지가 나오게 됩니다.

<LightBoxImg src="/images/default_layout.png"/>

`layout` 은 `home` | `docs` 둘 중 하나를 받습니다. 위의 설정에서는 `home` 으로 설정되어있었기 때문에 홈페이지가 나오게 됩니다.

:::tip
`hero` 섹션과 `features` 섹션은 `layout` 섹션이 `home` 일 때만 사용 가능합니다.
:::

<br>

밑에 이어서 마크 업이나, 마크다운을 작성할 수 있습니다.

---

<br>
<br>

기본적인 설정이 모두 끝났습니다.

이제 `컨텐츠 구성` 과 `작성 방법` 에 대해 알아보겠습니다.
