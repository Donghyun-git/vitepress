# VitePress 관련 자주 묻는 질문

## 일반적인 질문

### Q: VitePress와 VuePress의 차이점은 무엇인가요?

A: VitePress는 VuePress의 경량화 버전으로, Vite 빌드 도구를 기반으로 합니다. 주요 차이점은 다음과 같습니다:

- **성능**: VitePress는 Vite 기반으로 더 빠른 개발 서버와 빌드 시간을 제공
- **단순성**: VitePress는 더 심플한 설계와 적은 기본 기능 제공
- **번들 크기**: VitePress는 더 작은 클라이언트 측 번들 크기 제공
- **Vue 버전**: VitePress는 Vue 3만 지원, VuePress는 Vue 2/3 지원
- **플러그인**: VitePress는 제한된 플러그인 시스템, VuePress는 강력한 플러그인 시스템 제공

### Q: VitePress를 사용하기 위한 최소 시스템 요구 사항은 무엇인가요?

A: VitePress 사용을 위한 최소 요구 사항:

- Node.js 16 이상
- npm, yarn 또는 pnpm과 같은 패키지 관리자
- Git (선택사항이지만 권장)

### Q: VitePress는 어떤 유형의 프로젝트에 가장 적합한가요?

A: VitePress는 다음과 같은 프로젝트에 이상적입니다:

- 기술 문서
- 제품 매뉴얼
- API 문서
- 지식 베이스
- 블로그 (블로그 기능이 확장됨)
- 오픈 소스 프로젝트 문서

복잡한 동적 기능이 많거나 대규모 e-커머스와 같은 어플리케이션에는 적합하지 않습니다.

## 설정 및 사용자 정의

### Q: VitePress 사이트에 검색 기능을 추가하는 방법은?

A: VitePress는 기본적으로 로컬 검색 기능을 제공합니다. `docs/.vitepress/config.js` 파일에서 다음과 같이 설정할 수 있습니다:

```javascript
export default {
  themeConfig: {
    search: {
      provider: "local",
    },
  },
};
```

Algolia DocSearch를 사용하려면:

```javascript
export default {
  themeConfig: {
    search: {
      provider: "algolia",
      options: {
        appId: "귀하의_앱_ID",
        apiKey: "귀하의_API_키",
        indexName: "귀하의_인덱스_이름",
      },
    },
  },
};
```

### Q: VitePress에서 마크다운 파일을 정렬하는 방법은?

A: VitePress는 기본적으로 파일 이름의 알파벳 순서로 정렬합니다. 사이드바에서 특정 순서를 지정하려면 config.js 파일에서 사이드바 구성을 수동으로 설정해야 합니다:

```javascript
export default {
  themeConfig: {
    sidebar: [
      {
        text: "시작하기",
        items: [
          { text: "소개", link: "/introduction" },
          { text: "설치", link: "/installation" },
          { text: "구성", link: "/configuration" },
        ],
      },
    ],
  },
};
```

### Q: VitePress 사이트에 Google Analytics를 추가하는 방법은?

A: 구글 애널리틱스는 `docs/.vitepress/config.js` 파일의 head 옵션을 통해 추가할 수 있습니다:

```javascript
export default {
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

## 고급 기능

### Q: VitePress에서 사용자 정의 Vue 컴포넌트를 사용하는 방법은?

A: 사용자 정의 Vue 컴포넌트는 다음 단계로 추가할 수 있습니다:

1. `.vitepress/theme/components/` 디렉토리에 Vue 컴포넌트 생성
2. `.vitepress/theme/index.js` 파일에서 컴포넌트 등록:

```javascript
import DefaultTheme from "vitepress/theme";
import MyComponent from "./components/MyComponent.vue";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("MyComponent", MyComponent);
  },
};
```

3. 마크다운 파일에서 컴포넌트 사용:

```markdown
# 내 페이지

<MyComponent />
```

### Q: 마크다운 파일에서 데이터를 동적으로 로드하는 방법은?

A: Vue의 `<script setup>` 블록을 사용하여 마크다운 파일에서 데이터를 가져올 수 있습니다:

```markdown
# 동적 데이터 예제

<script setup>
import { ref, onMounted } from 'vue'

const data = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch('https://api.example.com/data')
    data.value = await response.json()
  } catch (error) {
    console.error('데이터 로드 오류:', error)
  } finally {
    loading.value = false
  }
})
</script>

<div v-if="loading">데이터 로딩 중...</div>
<div v-else>
  <div v-for="item in data" :key="item.id">
    {{ item.name }}
  </div>
</div>
```

### Q: VitePress에서 다국어 지원을 구현하는 방법은?

A: VitePress에서 다국어 지원은 `docs/.vitepress/config.js` 파일에서 `locales` 옵션을 통해 구성할 수 있습니다:

```javascript
export default {
  locales: {
    root: {
      label: "한국어",
      lang: "ko",
    },
    en: {
      label: "English",
      lang: "en",
      link: "/en/",
    },
    ja: {
      label: "日本語",
      lang: "ja",
      link: "/ja/",
    },
  },
  themeConfig: {
    localeLinks: {
      text: "언어",
      items: [
        { text: "한국어", link: "/" },
        { text: "English", link: "/en/" },
        { text: "日本語", link: "/ja/" },
      ],
    },
  },
};
```

디렉토리 구조:

```
docs/
├── index.md       # 한국어 홈페이지
├── guide/         # 한국어 가이드
├── en/
│   ├── index.md   # 영어 홈페이지
│   └── guide/     # 영어 가이드
└── ja/
    ├── index.md   # 일본어 홈페이지
    └── guide/     # 일본어 가이드
```

## 문제 해결

### Q: VitePress 개발 서버가 갑자기 멈추었습니다. 어떻게 해결하나요?

A: 다음 단계를 시도해 보세요:

1. 터미널에서 Ctrl+C로 서버 중지 후 다시 시작
2. node_modules/.vitepress 디렉토리 삭제 후 재시작
3. 패키지 캐시 정리: `npm cache clean --force`
4. 의존성 재설치: `rm -rf node_modules && npm install`
5. Node.js 버전이 요구 사항을 충족하는지 확인 (v16+)

### Q: 배포 후 스타일이 깨지거나 페이지가 빈 화면으로 나옵니다. 무엇이 문제인가요?

A: 이 문제는 주로 기본 URL 설정 문제로 발생합니다:

1. `docs/.vitepress/config.js`에서 `base` 옵션 확인:

   ```javascript
   export default {
     base: "/your-repo-name/", // GitHub Pages 사용 시
   };
   ```

2. 빌드된 파일의 경로가 올바른지 확인
3. 콘솔 오류를 확인하여 더 구체적인 문제 진단
4. `.nojekyll` 파일이 `docs/.vitepress/dist` 디렉토리에 있는지 확인 (GitHub Pages)

### Q: 마크다운 파일의 프론트매터가 제대로 작동하지 않습니다. 이유가 무엇인가요?

A: 프론트매터 문제는 주로 구문 오류 때문입니다:

1. 프론트매터가 파일 맨 앞에 있는지 확인
2. 프론트매터는 정확히 세 개의 대시(`---`)로 시작하고 끝나야 함
3. YAML 구문 오류 확인 (들여쓰기, 콜론 뒤 공백 등)
4. 프론트매터 내 특수 문자가 있다면 따옴표로 묶기

예시:

```markdown
---
title: "My: Page Title"
description: 'This is a "quoted" description'
---
```

## 성능 및 최적화

### Q: VitePress 사이트 빌드 시간을 최적화하는 방법은?

A: VitePress 빌드 성능 향상 팁:

1. 대용량 이미지 최적화:

   - 웹 최적화 포맷(WebP) 사용
   - 적절한 이미지 크기 조정

2. 불필요한 의존성 제거:

   - 사용하지 않는 플러그인이나 컴포넌트 제거
   - 번들 분석을 위해 `npx vite-bundle-visualizer`

3. 캐싱 활용:

   - CI/CD 파이프라인에서 캐싱 설정
   - Vite의 빌드 캐시 활용

4. JavaScript 최소화:
   - 무거운 외부 라이브러리 최소화
   - 필요한 경우에만 동적 가져오기 사용

### Q: VitePress 사이트의 SEO를 개선하는 방법은?

A: SEO 최적화를 위한 권장 사항:

1. 메타 데이터 설정:

   ```markdown
   ---
   title: 페이지 제목
   description: 페이지에 대한 명확한 설명
   head:
     - - meta
       - name: keywords
       - content: keyword1, keyword2
   ---
   ```

2. sitemap.xml 생성:

   - `vitepress-plugin-sitemap` 사용

3. 의미 있는 URL 구조:

   - 키워드가 포함된 URL 사용
   - 간결하고 읽기 쉬운 경로 설계

4. 이미지 최적화:

   - alt 텍스트 추가
   - 적절한 크기 및 압축

5. 내부 링크 최적화:
   - 관련 콘텐츠 간의 자연스러운 링크
   - 명확한 앵커 텍스트 사용

## 기타 질문

### Q: VitePress 대신 다른 정적 사이트 생성기를 사용해야 하는 경우는 언제인가요?

A: 다른 정적 사이트 생성기를 고려해야 할 상황:

- Vue.js 생태계에 익숙하지 않고 React를 선호하는 경우 → Docusaurus, Nextra
- 더 많은 플러그인이 필요한 경우 → VuePress, Hugo
- 복잡한 데이터 처리가 필요한 경우 → Next.js, Nuxt.js
- 매우 단순한 문서가 필요한 경우 → MkDocs
- 학술 또는 기술 출판물 → Sphinx, AsciiDoc
- WordPress와 유사한 CMS 경험이 필요한 경우 → Ghost, Strapi + Gatsby

### Q: VitePress로 블로그를 만들 수 있나요?

A: 네, VitePress 2.0부터 블로그 기능이 공식적으로 지원됩니다. 설정 방법:

```javascript
// docs/.vitepress/config.js
export default {
  themeConfig: {
    blog: {
      title: "내 블로그",
      description: "기술적인 생각과 튜토리얼",
      defaultAuthor: "홍길동",
      categoryIcons: {
        article: "i-[icon]",
        tutorial: "i-[icon]",
      },
    },
  },
};
```

블로그 포스트 작성:

```markdown
---
title: 내 첫 번째 블로그 포스트
date: 2023-04-15
author: 홍길동
categories:
  - tutorial
tags:
  - vitepress
  - vue
---

# 내 첫 번째 블로그 포스트

여기에 포스트 내용을 작성하세요...
```

### Q: VitePress 사이트를 PWA(Progressive Web App)로 변환할 수 있나요?

A: 네, PWA 기능을 추가하려면 Vite PWA 플러그인을 사용할 수 있습니다:

1. 플러그인 설치:

```bash
npm install -D vite-plugin-pwa
```

2. `docs/.vitepress/config.js`에 PWA 설정 추가:

```javascript
import { defineConfig } from "vitepress";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // ... 기존 설정
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "robots.txt", "img/**"],
        manifest: {
          name: "내 VitePress 사이트",
          short_name: "내 문서",
          description: "내 VitePress 문서 사이트",
          theme_color: "#3eaf7c",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
    ],
  },
});
```

3. 필요한 아이콘 생성 및 `public` 디렉토리에 배치

### Q: VitePress 사이트에 댓글 시스템을 추가할 수 있나요?

A: 네, 여러 댓글 시스템을 통합할 수 있습니다:

1. Giscus (GitHub Discussions 기반):

```vue
<!-- .vitepress/theme/components/Comments.vue -->
<template>
  <div class="comments">
    <giscus-widget
      repo="username/repo"
      repo-id="R_xxx"
      category="Comments"
      category-id="DIC_xxx"
      mapping="pathname"
      reactions-enabled="1"
      emit-metadata="0"
      theme="light"
    />
  </div>
</template>

<script setup>
import "giscus";
</script>
```

2. 테마 확장 및 적용:

```javascript
// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
import Comments from "./components/Comments.vue";
import { h } from "vue";

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "doc-after": () => h(Comments),
    });
  },
};
```

이러한 방식으로 Disqus, Utterances 등 다른 댓글 시스템도 통합할 수 있습니다.
