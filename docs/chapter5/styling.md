# 문서에 스타일 적용하기

VitePress에서는 기본 테마를 커스터마이징하거나 완전히 새로운 테마를 만들어 문서에 스타일을 적용할 수 있습니다. 이번 장에서는 문서를 더 매력적이고 브랜드에 맞게 스타일링하는 방법을 알아보겠습니다.

## 기본 테마 커스터마이징

### 1. CSS 변수 재정의

VitePress의 기본 테마는 CSS 변수를 사용하여 쉽게 커스터마이징할 수 있습니다. `.vitepress/theme/custom.css` 파일을 생성하고 CSS 변수를 재정의하세요:

```css
:root {
  /* 브랜드 색상 */
  --vp-c-brand: #646cff;
  --vp-c-brand-light: #747bff;
  --vp-c-brand-lighter: #9499ff;
  --vp-c-brand-dark: #535bf2;
  --vp-c-brand-darker: #454ce1;

  /* 배경색 */
  --vp-c-bg: #ffffff;
  --vp-c-bg-soft: #f9f9f9;

  /* 텍스트 색상 */
  --vp-c-text-1: #213547;
  --vp-c-text-2: #3a506b;

  /* 링크 색상 */
  --vp-c-link: #42b883;
  --vp-c-link-hover: #32a873;

  /* 버튼 스타일 */
  --vp-button-brand-border: transparent;
  --vp-button-brand-text: white;
  --vp-button-brand-bg: var(--vp-c-brand);
  --vp-button-brand-hover-border: transparent;
  --vp-button-brand-hover-text: white;
  --vp-button-brand-hover-bg: var(--vp-c-brand-light);

  /* 기타 변수들... */
}

/* 다크 모드 변수 */
.dark {
  --vp-c-bg: #1e1e20;
  --vp-c-bg-soft: #2c2c30;
  --vp-c-text-1: rgba(255, 255, 255, 0.87);
  --vp-c-text-2: rgba(235, 235, 235, 0.6);
}
```

### 2. 테마 설정 파일 생성

`.vitepress/theme/index.js` 파일을 생성하여 기본 테마를 확장합니다:

```javascript
import DefaultTheme from "vitepress/theme";
import "./custom.css";

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    // 앱 확장 로직 (필요시)
  },
};
```

## 고급 스타일링 기법

### 1. 커스텀 레이아웃 컴포넌트

특별한 페이지를 위한 커스텀 레이아웃을 만들 수 있습니다:

```vue
<!-- .vitepress/theme/MyLayout.vue -->
<template>
  <div class="my-layout">
    <header>
      <h1>{{ $frontmatter.title }}</h1>
    </header>
    <main>
      <Content />
    </main>
    <footer>© {{ new Date().getFullYear() }} 내 프로젝트</footer>
  </div>
</template>

<style scoped>
.my-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

footer {
  margin-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
</style>
```

그리고 테마 파일에서 레이아웃을 등록합니다:

```javascript
// .vitepress/theme/index.js
import DefaultTheme from "vitepress/theme";
import MyLayout from "./MyLayout.vue";
import "./custom.css";

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  // 또는 조건부 레이아웃
  // Layout: () => {
  //   return h(DefaultTheme.Layout, null, {
  //     // 슬롯 오버라이드
  //   })
  // }
};
```

### 2. 글로벌 스타일 추가

`.vitepress/theme/custom.css`에 글로벌 스타일을 추가할 수 있습니다:

```css
/* 사용자 정의 클래스 */
.custom-block {
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.info-box {
  background-color: #f0f7ff;
  border-left: 4px solid #0066cc;
  padding: 0.8em 1em;
}

/* 표 스타일링 */
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background-color: #f5f5f5;
  font-weight: 600;
}

tr:hover {
  background-color: #f9f9f9;
}
```

### 3. 반응형 디자인 구현

모바일 및 다양한 화면 크기를 지원하는 반응형 디자인을 구현합니다:

```css
/* 기본적으로 반응형이지만, 추가 커스터마이징 가능 */
@media (max-width: 768px) {
  .custom-block {
    padding: 0.8rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  .hide-on-mobile {
    display: none;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}
```

## 사용자 정의 컴포넌트 만들기

### 1. Vue 컴포넌트 생성

`.vitepress/theme/components/` 디렉토리에 컴포넌트를 만들 수 있습니다:

```vue
<!-- .vitepress/theme/components/Alert.vue -->
<template>
  <div class="alert" :class="type">
    <div class="alert-icon" v-if="type">
      <span v-if="type === 'info'">ℹ️</span>
      <span v-else-if="type === 'warning'">⚠️</span>
      <span v-else-if="type === 'success'">✅</span>
      <span v-else-if="type === 'danger'">🛑</span>
    </div>
    <div class="alert-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "info",
      validator: (value) =>
        ["info", "warning", "success", "danger"].includes(value),
    },
  },
};
</script>

<style scoped>
.alert {
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
}

.alert-icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
}

.info {
  background-color: #e6f7ff;
  border-left: 4px solid #1890ff;
}

.warning {
  background-color: #fffbe6;
  border-left: 4px solid #faad14;
}

.success {
  background-color: #f6ffed;
  border-left: 4px solid #52c41a;
}

.danger {
  background-color: #fff2f0;
  border-left: 4px solid #ff4d4f;
}
</style>
```

### 2. 컴포넌트 등록

`.vitepress/theme/index.js`에서 컴포넌트를 등록합니다:

```javascript
import DefaultTheme from "vitepress/theme";
import Alert from "./components/Alert.vue";
import "./custom.css";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("Alert", Alert);
    // 다른 컴포넌트 등록...
  },
};
```

### 3. 마크다운에서 컴포넌트 사용

이제 마크다운 파일에서 Vue 컴포넌트를 직접 사용할 수 있습니다:

```markdown
# 컴포넌트 사용 예시

<Alert type="info">
  이것은 정보 알림입니다.
</Alert>

<Alert type="warning">
  주의하세요! 이것은 경고 메시지입니다.
</Alert>

<Alert type="danger">
  위험! 심각한 문제가 발생했습니다.
</Alert>
```

## 테마 확장하기

### 1. 기본 테마의 슬롯 활용

VitePress 기본 테마는 여러 슬롯을 제공하여 특정 부분만 변경할 수 있습니다:

```javascript
import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import "./custom.css";

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 로고 슬롯 오버라이드
      "nav-bar-title": () =>
        h("div", { class: "custom-logo" }, [
          h("img", { src: "/logo.svg", alt: "Logo" }),
          h("span", "My Docs"),
        ]),

      // 사이드바 상단 슬롯
      "sidebar-top": () =>
        h("div", { class: "sidebar-banner" }, "✨ 신기능 출시!"),

      // 푸터 슬롯
      "doc-footer-before": () =>
        h("div", { class: "custom-footer" }, "내 프로젝트 문서 © 2023"),
    });
  },
};
```

### 2. 다크 모드 커스터마이징

다크 모드를 위한 추가 설정과 토글 버튼 커스터마이징:

```css
/* custom.css */
/* 다크 모드 전환 애니메이션 */
html {
  transition: background-color 0.3s ease;
}

/* 다크 모드 변수 재정의 */
html.dark {
  --vp-c-bg: #121212;
  --vp-c-bg-soft: #242424;
  --vp-sidebar-bg-color: #1a1a1a;
  --vp-c-text-1: rgba(255, 255, 255, 0.87);
  --vp-c-text-2: rgba(235, 235, 235, 0.6);
}

/* 다크 모드에서 이미지 반전 방지 */
html.dark img:not([class*="no-invert"]) {
  filter: brightness(0.9);
}
```

이러한 스타일링 방법을 통해 문서를 시각적으로 더 매력적으로 만들고, 사용자 경험을 향상시킬 수 있습니다.
