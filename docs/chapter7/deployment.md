# 배포 및 유지보수

VitePress 문서 사이트를 개발한 후에는 적절한 배포 방법을 선택하고 지속적인 유지보수 체계를 구축하는 것이 중요합니다. 이번 장에서는 VitePress 문서를 효과적으로 배포하고 관리하는 방법을 알아보겠습니다.

## 배포 옵션

### 1. GitHub Pages 배포

GitHub Pages는 무료로 정적 사이트를 호스팅할 수 있는 가장 인기 있는 옵션 중 하나입니다.

#### 수동 배포 방법

1. VitePress 문서 빌드:

```bash
npm run docs:build
```

2. GitHub Pages에 맞게 설정 조정:

`docs/.vitepress/config.js` 파일 수정:

```javascript
export default {
  // ... 기존 설정
  base: "/your-repo-name/", // GitHub 저장소 이름에 맞게 수정
};
```

3. 배포 스크립트 추가:

`package.json`에 배포 스크립트 추가:

```json
{
  "scripts": {
    "docs:deploy": "npm run docs:build && gh-pages -d docs/.vitepress/dist"
  }
}
```

4. gh-pages 설치:

```bash
npm install --save-dev gh-pages
```

5. 배포 실행:

```bash
npm run docs:deploy
```

#### GitHub Actions 자동 배포

`.github/workflows/deploy.yml` 파일 생성:

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run docs:build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/.vitepress/dist
```

### 2. Netlify 배포

Netlify는 무료 호스팅, CDN, 자동 HTTPS, 지속적 배포 등 다양한 기능을 제공합니다.

#### Netlify 수동 설정

1. Netlify 계정 생성 및 로그인
2. "New site from Git" 클릭
3. GitHub 저장소 선택
4. 빌드 설정 구성:
   - Build command: `npm run docs:build`
   - Publish directory: `docs/.vitepress/dist`
5. "Deploy site" 클릭

#### netlify.toml 설정

프로젝트 루트에 `netlify.toml` 파일 생성:

```toml
[build]
  command = "npm run docs:build"
  publish = "docs/.vitepress/dist"

[build.environment]
  NODE_VERSION = "16"

# 다시 작성 규칙 (SPA를 위한 설정)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Vercel 배포

Vercel은 프론트엔드 프로젝트를 위한 간단하고 빠른 배포 플랫폼입니다.

#### Vercel 설정

1. Vercel 계정 생성 및 로그인
2. 대시보드에서 "Import Project" 클릭
3. GitHub 저장소 URL 입력
4. 설정 구성:
   - Framework Preset: Other
   - Build Command: `npm run docs:build`
   - Output Directory: `docs/.vitepress/dist`
5. "Deploy" 클릭

#### vercel.json 설정

프로젝트 루트에 `vercel.json` 파일 생성:

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "buildCommand": "npm run docs:build",
        "outputDirectory": "docs/.vitepress/dist"
      }
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

## 사용자 정의 도메인 설정

### 1. GitHub Pages 사용자 정의 도메인

1. 저장소 설정 > Pages 섹션으로 이동
2. "Custom domain" 필드에 도메인 입력
3. DNS 설정:

   - A 레코드: GitHub Pages IP 주소 (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153)
   - CNAME 레코드: username.github.io

4. `docs/public` 디렉토리에 `CNAME` 파일 생성:

```
your-domain.com
```

### 2. Netlify 사용자 정의 도메인

1. Netlify 대시보드 > 사이트 > Domain settings 클릭
2. "Add custom domain" 클릭
3. 도메인 이름 입력 후 "Verify" 클릭
4. DNS 설정:
   - Netlify DNS 사용: "Add domain" 클릭 후 단계별 지침 따르기
   - 외부 DNS 사용: 제공된 Netlify DNS 값으로 CNAME 레코드 설정

## 지속적인 문서 관리

### 1. 변경 관리 방법론

#### 문서 버전 관리 체계

1. **의미론적 버전 관리 사용**:

   - 문서 버전을 소프트웨어처럼 관리 (예: v1.0.0, v1.1.0)
   - 변경 유형에 따라 버전 번호 증가 (주요/부/패치)

2. **변경 로그(Changelog) 유지**:
   - `docs/changelog.md` 파일 생성 및 관리
   - 버전, 날짜, 변경 내용 포함

```markdown
# 변경 내용

## v1.1.0 (2023-04-15)

### 추가

- 새로운 API 문서 섹션 추가
- 트러블슈팅 가이드 추가

### 변경

- 설치 가이드 업데이트
- 성능 최적화 팁 개선

### 수정

- 코드 예제의 오타 수정
- 링크 깨짐 수정
```

### 2. 문서 리뷰 프로세스

#### 정기적인 콘텐츠 리뷰 일정

- 분기별 전체 문서 리뷰
- 월별 핵심 섹션 리뷰
- 릴리스 전 관련 문서 리뷰

#### Pull Request 리뷰 체크리스트

```markdown
## 문서 PR 체크리스트

### 일반

- [ ] 맞춤법 및 문법 검사
- [ ] 일관된 용어 사용
- [ ] 기술적 정확성 확인

### 포맷팅

- [ ] 마크다운 문법 정확성
- [ ] 헤딩 구조 적절성
- [ ] 코드 예제 포맷팅

### 내용

- [ ] 명확하고 간결한 설명
- [ ] 필요한 예제 포함
- [ ] 관련 문서 연결
```

### 3. 사용자 피드백 수집 및 적용

#### 피드백 수집 방법

1. **VitePress 문서에 피드백 컴포넌트 추가**:

```vue
<!-- .vitepress/theme/components/Feedback.vue -->
<template>
  <div class="feedback-container">
    <h3>이 페이지가 도움이 되었나요?</h3>
    <div class="feedback-buttons">
      <button @click="sendFeedback(true)">👍 예</button>
      <button @click="sendFeedback(false)">👎 아니오</button>
    </div>
    <div v-if="showForm" class="feedback-form">
      <textarea
        v-model="feedbackText"
        placeholder="어떻게 개선할 수 있을까요?"
      ></textarea>
      <button @click="submitFeedback">제출</button>
    </div>
    <div v-if="submitted" class="feedback-thanks">피드백 감사합니다!</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showForm: false,
      feedbackText: "",
      submitted: false,
    };
  },
  methods: {
    sendFeedback(isPositive) {
      // 분석 시스템으로 기본 피드백 전송
      console.log(`페이지 피드백: ${isPositive ? "긍정적" : "부정적"}`);

      if (!isPositive) {
        this.showForm = true;
      } else {
        this.submitted = true;
      }
    },
    submitFeedback() {
      // 상세 피드백 전송
      console.log(`피드백 내용: ${this.feedbackText}`);
      this.showForm = false;
      this.submitted = true;

      // 실제 구현에서는 API 호출이나 이슈 생성
    },
  },
};
</script>
```

2. **GitHub Issues 활용**:
   - 문서 각 페이지에 "이슈 보고" 링크 추가
   - 문서 관련 이슈 템플릿 제공

### 4. 자동화된 품질 관리

#### 문서 린팅 설정

마크다운 린터 설치:

```bash
npm install --save-dev markdownlint-cli
```

`.markdownlint.json` 설정:

```json
{
  "default": true,
  "MD013": false,
  "MD033": false,
  "MD041": false
}
```

package.json에 스크립트 추가:

```json
{
  "scripts": {
    "docs:lint": "markdownlint 'docs/**/*.md' --ignore 'docs/.vitepress'"
  }
}
```

#### 링크 검사기 설정

```bash
npm install --save-dev @lychee/lychee
```

package.json에 스크립트 추가:

```json
{
  "scripts": {
    "docs:check-links": "lychee docs/**/*.md --exclude-path .lycheeignore"
  }
}
```

## 배포 후 모니터링 및 분석

### 1. Google Analytics 설정

`docs/.vitepress/config.js` 파일에 추가:

```javascript
export default {
  // ... 기존 설정
  head: [
    [
      "script",
      {
        async: true,
        src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX",
      },
    ],
    [
      "script",
      {},
      `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    `,
    ],
  ],
};
```

### 2. Hotjar 또는 Clarity 설정

사용자 행동 분석을 위한 Hotjar 추가:

```javascript
export default {
  // ... 기존 설정
  head: [
    // ... 기존 head 태그
    [
      "script",
      {},
      `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:XXXXXXX,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `,
    ],
  ],
};
```

## 팀 협업을 위한 문서 워크플로우

### 1. 문서화 역할 정의

- **문서 관리자**: 전체 문서화 전략 및 일정 관리
- **기술 작성자**: 주요 콘텐츠 작성 및 편집
- **주제 전문가**: 기술적 정확성 검토
- **편집자**: 일관성, 가독성, 문법 검토

### 2. 브랜치 전략

- `main`: 공개된 최신 문서 버전
- `develop`: 작업 중인 다음 버전
- `feature/topic-name`: 특정 주제에 대한 문서 작업
- `fix/issue-number`: 문서 오류 수정

### 3. 문서 빌드 자동화

CI/CD 파이프라인 구성:

1. 문서 린팅 및 링크 검사
2. 미리보기 환경 배포
3. 리뷰 후 승인시 프로덕션 배포

### 4. 정기적인 문서 관리 일정

- 주간: 새로운 PR 리뷰 및 병합
- 월간: 콘텐츠 업데이트 계획 및 할당
- 분기별: 전체 문서 건강 검사 및 개선 계획

이러한 방법을 통해 VitePress 문서를 효과적으로 배포하고 지속적으로 관리하여 항상 최신 상태와 높은 품질을 유지할 수 있습니다.
