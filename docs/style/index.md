# 문서에 스타일 적용하기

`VitePress`에서는 기본 테마를 커스터마이징하거나 완전히 새로운 테마를 만들어 문서에 스타일을 적용할 수 있습니다.

## 📌기본 테마 커스터마이징

### CSS 변수 추가

VitePress의 기본 테마는 CSS 변수를 사용하여 쉽게 커스터마이징할 수 있습니다.

`.vitepress/theme/style.css` 파일은 기본적으로 아래와 같습니다.

```css
:root {
  --vp-c-default-1: var(--vp-c-gray-1);
  --vp-c-default-2: var(--vp-c-gray-2);
  --vp-c-default-3: var(--vp-c-gray-3);
  --vp-c-default-soft: var(--vp-c-gray-soft);

  --vp-c-brand-1: var(--vp-c-indigo-1);
  --vp-c-brand-2: var(--vp-c-indigo-2);
  --vp-c-brand-3: var(--vp-c-indigo-3);
  --vp-c-brand-soft: var(--vp-c-indigo-soft);

  --vp-c-tip-1: var(--vp-c-brand-1);
  --vp-c-tip-2: var(--vp-c-brand-2);
  --vp-c-tip-3: var(--vp-c-brand-3);
  --vp-c-tip-soft: var(--vp-c-brand-soft);

  --vp-c-warning-1: var(--vp-c-yellow-1);
  --vp-c-warning-2: var(--vp-c-yellow-2);
  --vp-c-warning-3: var(--vp-c-yellow-3);
  --vp-c-warning-soft: var(--vp-c-yellow-soft);

  --vp-c-danger-1: var(--vp-c-red-1);
  --vp-c-danger-2: var(--vp-c-red-2);
  --vp-c-danger-3: var(--vp-c-red-3);
  --vp-c-danger-soft: var(--vp-c-red-soft);
}

/**
 * Component: Button
 * -------------------------------------------------------------------------- */
:root {
  --vp-button-brand-border: transparent;
  --vp-button-brand-text: var(--vp-c-white);
  --vp-button-brand-bg: var(--vp-c-brand-3);
  --vp-button-brand-hover-border: transparent;
  --vp-button-brand-hover-text: var(--vp-c-white);
  --vp-button-brand-hover-bg: var(--vp-c-brand-2);
  --vp-button-brand-active-border: transparent;
  --vp-button-brand-active-text: var(--vp-c-white);
  --vp-button-brand-active-bg: var(--vp-c-brand-1);
}

/**
 * Component: Home
 * -------------------------------------------------------------------------- */

:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(
    120deg,
    #bd34fe 30%,
    #41d1ff
  );
 
  --vp-home-hero-image-background-image: linear-gradient(
    -45deg,
    #bd34fe 50%,
    #47caff 50%
  );

  --vp-home-hero-image-filter: blur(44px);
}


@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}


@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}

/**
 * Component: Custom Block
 * -------------------------------------------------------------------------- */

:root {
  --vp-custom-block-tip-border: transparent;
  --vp-custom-block-tip-text: var(--vp-c-text-1);
  --vp-custom-block-tip-bg: var(--vp-c-brand-soft);
  --vp-custom-block-tip-code-bg: var(--vp-c-brand-soft);
}

/**
 * Component: Algolia
 * -------------------------------------------------------------------------- */

.DocSearch {
  --docsearch-primary-color: var(--vp-c-brand-1) !important;
}
```

<br>

매뉴얼 제작 당시 사용했던 CSS 변수를 정의하여 최상위에 있는 `root` 블록에 따로 추가해주겠습니다.

```css[style.css]
:root {
 /* ... */

/* 설치 매뉴얼 색상 */
--manual-install-1: rgba(244, 63, 94, 0.08);
--manual-install-2: rgba(244, 63, 94, 0.02);
--manual-install-gradient: linear-gradient(to bottom, var(--manual-install-1), var(--manual-install-2));
--manual-install-border: rgba(244, 63, 94, 0.8);

/* 운영자 매뉴얼 색상 */
--manual-admin-1: rgba(59, 130, 246, 0.08);
--manual-admin-2: rgba(59, 130, 246, 0.02);
--manual-admin-gradient: linear-gradient(to bottom, var(--manual-admin-1), var(--manual-admin-2));
--manual-admin-border: rgba(59, 130, 246, 0.8);

/* 개발자 매뉴얼 색상 */
--manual-dev-1: rgba(16, 185, 129, 0.08);
--manual-dev-2: rgba(16, 185, 129, 0.02);
--manual-dev-gradient: linear-gradient(to bottom, var(--manual-dev-1), var(--manual-dev-2));
--manual-dev-border: rgba(16, 185, 129, 0.8);

/* 텍스트 색상 */
--vp-c-text-1: #213547;
--vp-c-text-2: #4b5563;
}
```

<br>

### 홈 페이지 스타일링

현재 저희 팀 매뉴얼은 기본 레이아웃 `home` 을 사용하고 `features` 부분을 커스텀한 상태입니다.

먼저 `default` 기본 레이아웃을 다시 보겠습니다.

<LightBoxImg src="/images/default_manual.png"/>

:::info
위 홈페이지로 봤을 때, 바꿔야하는 것은 총 3가지 입니다.

1. 홈페이지 title 명
2. 기업 로고 출력
3. 카드 디자인 및 매뉴얼로의 링크
   :::

<br>

#### title 변경

```yaml
hero:
  name: 'My Awesome Project' //[!code --]
  text: 'A VitePress Site' //[!code --]
  tagline: 'My great project tagline' //[!code --]
  actions: // [!code --]
    - theme: 'brand' //[!code --]
      text: 'Markdown Examples' //[!code --]
      link: '/markdown-examples' //[!code --]
    - theme: 'alt' //[!code --]
      text: 'API Examples' //[!code --]
      link: '/api-examples' //[!code --]
  name: 'eCrossV5 Manual' //[!code ++]
  text: 'eCrossV5 공식 매뉴얼' //[!code ++]
```

위와 같이 프론트매터의 `hero` 섹션을 변경해주겠습니다. `tagline` 과 `actions` 는 사용하지 않기 때문에 지워주겠습니다.

필요하다면 별도로 사용하셔도 무방합니다 :smile:

<br>

#### 기업 로고 넣기

```yaml
hero:
  name: 'eCrossV5 Manual'
  text: 'eCrossV5 공식 매뉴얼'
  image: //[!code ++]
	src: '/images/logo.png' //[!code ++]
	alt: 'manual_logo' //[!code ++]
```

<br>

#### 카드 디자인 및 매뉴얼로의 링크

```yaml
hero:
  name: 'eCrossV5 Manual'
  text: 'eCrossV5 공식 매뉴얼'
  image:
	src: '/images/logo.png'
	alt: 'manual_logo'
features: # [!code ++]
  - title: 설치 매뉴얼 # [!code ++]
    details: 설치 매뉴얼입니다. # [!code ++]
    link: /install-manual/system-requirements/ # [!code ++]
  - title: 운영자 매뉴얼 # [!code ++]
    details: 운영자 매뉴얼입니다. # [!code ++]
    link: /admin-manual/introduce/ecross/ # [!code ++]
  - title: 개발자 매뉴얼 # [!code ++]
    details: 개발자 매뉴얼입니다. # [!code ++]
    link: /developer-manual/developer/overview/ # [!code ++]
```

팀 내에서는 3개의 매뉴얼을 운영하고 있기 때문에

위와 같이 `features` 섹션의 구성요소를 `hero` 섹션 밑에 3가지 추가해주겠습니다.

<br>

##### 요소 디자인하기

먼저 `title`과 `로고` 백그라운드 그라데이션을 기업 브랜딩 색상으로 바꿔주겠습니다.

기본 title 의 CSS 변수는 `--vp-home-hero-name-background` 이고 로고 백그라운드의 CSS 변수는 `--vp-home-hero-image-background-image` 입니다.

`Comonent:Home` 주석쪽에 있는 `:root` 섹션의 변수 값을 변경해주겠습니다.

```css
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(
    120deg,
    #bd34fe 30%, /* [!code --] */
    #41d1ff /* [!code --] */
    #e31e26 30%, /* [!code ++] */
    #d9d9d9 70%  /* [!code ++] */
  );
  --vp-home-hero-image-background-image: linear-gradient(
    -45deg, /* [!code --] */
    #bd34fe 50%, /* [!code --] */
    #47caff 50% /* [!code --] */
    #e31e26 50%, /* [!code ++] */
    #d9d9d9 50% /* [!code ++] */
  );
  --vp-home-hero-image-filter: blur(44px);
}
```

카드 디자인도 커스텀 해보겠습니다.

처음에 세팅했던 `사용자 정의 CSS 변수`를 이용하겠습니다.

파일을 `/.vitepress/theme/custom.css` 하나 만들어주고, css를 작성해주겠습니다.

<br>

###### 카드 기본스타일

```css
/* 카드 기본 스타일 */
.item.grid-3 .VPLink.link.no-icon.VPFeature {
  display: block;
  overflow: hidden;
  border-radius: 0.75rem;
  background-color: var(--vp-c-bg);
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.dark .item.grid-3 .VPLink.link.no-icon.VPFeature {
  border-color: rgba(255, 255, 255, 0.1);
  background-color: rgba(30, 30, 32, 0.7);
}
```

<br>

###### 카드 테두리

```css
/* 카드 테두리 */
.item.grid-3:nth-child(1) .VPLink.link.no-icon.VPFeature {
  border-top: 4px solid var(--manual-install-border);
}

.item.grid-3:nth-child(2) .VPLink.link.no-icon.VPFeature {
  border-top: 4px solid var(--manual-admin-border);
}

.item.grid-3:nth-child(3) .VPLink.link.no-icon.VPFeature {
  border-top: 4px solid var(--manual-dev-border);
}

.item.grid-3:nth-child(1) .VPLink.link.no-icon.VPFeature:hover {
  border-left: 1px solid var(--manual-install-border);
  border-right: 1px solid var(--manual-install-border);
  border-bottom: 1px solid var(--manual-install-border);
}

.item.grid-3:nth-child(2) .VPLink.link.no-icon.VPFeature:hover {
  border-left: 1px solid var(--manual-admin-border);
  border-right: 1px solid var(--manual-admin-border);
  border-bottom: 1px solid var(--manual-admin-border);
}

.item.grid-3:nth-child(3) .VPLink.link.no-icon.VPFeature:hover {
  border-left: 1px solid var(--manual-dev-border);
  border-right: 1px solid var(--manual-dev-border);
  border-bottom: 1px solid var(--manual-dev-border);
}
```

<br>

###### 배경 그라데이션

```css
/* 각 카드별 배경 그라데이션 */
.item.grid-3:nth-child(1) article.box {
  background: var(--manual-install-gradient) !important;
}

.item.grid-3:nth-child(2) article.box {
  background: var(--manual-admin-gradient) !important;
}

.item.grid-3:nth-child(3) article.box {
  background: var(--manual-dev-gradient) !important;
}
```

<br>

###### 카드 설명 영역

```css
/* 설명 텍스트 스타일링 */
.item.grid-3 .details {
  color: var(--vp-c-text-2) !important;
  background-color: transparent !important;
  border-radius: 0 !important;
  margin-top: 0.5rem !important;
  padding: 0 !important;
  font-size: 1.1rem !important;
  line-height: 1.6 !important;
  flex-grow: 1 !important;
}
```

<br>

완성된 매뉴얼 홈페이지를 보겠습니다.

<LightBoxImg src="/images/manual.png"/>

## 📌 Vue 컴포넌트 생성하기

매뉴얼에는 `PDF 다운로드` 기능이 필요했고, 그 다운로드를 위한 버튼이 존재해야 했습니다.

`/.vitepress/components/Button` 경로에

`DownloadButotn.vue` 컴포넌트 파일을 하나 생성해주겠습니다.

```ts:line-numbers
<template>
  <button class="download-button" :class="[`manual-${type}-button`]" @click="handleDownload" :disabled="isLoading">
    <div v-if="isLoading" class="loading-spinner"></div>
    <slot v-else></slot>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useData } from 'vitepress';

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'dev',
    validator: (value) => ['install', 'admin', 'dev'].includes(value),
  },
});


const { isDark, site } = useData();
const isLoading = ref(false);

const baseUrl = computed(() => {

  return location.origin;
});


const downloadUrl = computed(() => {

  const url = new URL('/pdf_file/' + props.path.replace(/^\/+/, ''), baseUrl.value);

  return url.href;
});



const handleDownload = async () => {
  isLoading.value = true;

  try {
    if (props.filename) {
      const response = await fetch(downloadUrl.value);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
     
      a.style.display = 'none';
      a.href = url;
      a.download = props.filename;
      document.body.appendChild(a);

      a.click();
     
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      if (props.openInNewTab) {
        window.open(downloadUrl.value, '_blank');
      } else {
        window.location.href = downloadUrl.value;
      }
    }
  } catch (error) {
    console.error('다운로드 중 오류 발생:', error);
  } finally {
    isLoading.value = false;
  }
};

</script>



<style scoped>

.download-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.3s ease;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  height: 48px;
  cursor: pointer;
  color: white;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: none;
}


.download-button:hover {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.download-button:active {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* 설치 매뉴얼 버튼 스타일 */
.manual-install-button {
  background: linear-gradient(to right, #f43f5e, #fb7185);
}

/* 운영자 매뉴얼 버튼 스타일 */
.manual-admin-button {
  background: linear-gradient(to right, #3b82f6, #60a5fa);
}

/* 개발자 매뉴얼 버튼 스타일 */
.manual-dev-button {
  background: linear-gradient(to right, #10b981, #34d399);
}

.download-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid white;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.dark .download-button {
  color: white;
}

.dark .loading-spinner {
  border-color: white;
  border-top-color: transparent;
}

</style>
```

그리고 해당 컴포넌트를 홈페이지가 바라보고 있는 `index.md`에 추가해주겠습니다.

```vue
<script setup>

import DownloadButton from '../.vitepress/components/Button/DownloadButton.vue';

</script>

<div class="container">
<h3 class="text" style="margin-top: 3rem;margin-bottom: 2rem;">
📙 매뉴얼 다운로드
</h3>

<div class="items">
  <div class="item grid-3">
    <DownloadButton type="install" path="/eCrossV5_설치매뉴얼.pdf" filename="설치매뉴얼.pdf">
 설치 매뉴얼 다운로드
    </DownloadButton>
  </div>
  //...
</div>
```

위와 같이 사용하여도 되고,

`index.ts` 에서 로드시켜도 됩니다.

```ts
import DefaultTheme from "vitepress/theme";
import { DownloadButton } from "../components/Button";
import "./custom.css";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("DownloadButton", DownloadButton);
    // 다른 컴포넌트 등록...
  },
};
```

```vue
<div class="container">
<h3 class="text" style="margin-top: 3rem;margin-bottom: 2rem;">
📙 매뉴얼 다운로드
</h3>

<div class="items">
  <div class="item grid-3">
    <DownloadButton type="install" path="/eCrossV5_설치매뉴얼.pdf" filename="설치매뉴얼.pdf">
 설치 매뉴얼 다운로드
    </DownloadButton>
  </div>
  //...
</div>
```

`index.ts`에 로드 시켰다면 다른 `markdown` 파일에서 동일하게 사용 가능합니다.

<br>

<LightBoxImg src="/images/button_area.png" />

생성한 컴포넌트가 잘 렌더링 되어 나타나는 모습입니다.

## 📌 이미지 확대 기능

<LightBoxImg src="/images/image_scale_up.png" />

`이미지 확대` 기능은 `vue-easy-lightbox` 라는 라이브러리를 사용하였습니다.

`./.vitepress/components` 폴더를 하나 생성하고 `LightboxImg` 라는 커스텀 컴포넌트를 만들어주겠습니다.

```vue
<template>
  <div class="gallery">    
    <p>
      <img
        :src="src"
        :alt="alt"
        :title="title"
        :width="width"
        :height="height"
        @click="showImage"
      />               
      <vue-easy-lightbox
        :visible="visible"
        :imgs="[src]"
        :index="0"
        :moveDisabled="false"
        :zoomScale="0"
        :loop="false"
        @hide="onHide"
      />     
    </p>  
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import VueEasyLightbox from "vue-easy-lightbox";

interface Props {
  src: string;
  alt?: string;
  title?: string;
  width?: string | number;
  height?: string | number;
  zoomScale?: number;
  cursor?: string;
  objectFit?: string;
  style?: string;
}

const props = withDefaults(defineProps<Props>(), {
  alt: "",
  title: "",
  zoomScale: 0,
  cursor: "pointer",
  objectFit: "contain",
});

const visible = ref(false);

const showImage = () => {
  visible.value = true;
};

const onHide = () => {
  visible.value = false;
};
</script>

<style scoped>
.gallery {
  cursor: pointer;
  position: relative;
  margin: 0;
  padding: 0;
}

.gallery::before {
  content: "+ 확대";
  position: absolute;
  z-index: 1000;
  bottom: 0;
  right: 0;
  transform: translate(-50%, -50%);
  background-color: #4e4e4ec9;
  color: #fff;
  padding: 6px 14px;
  border-radius: 18px;
  font-size: 13px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  white-space: nowrap;
  font-weight: 500;
  letter-spacing: 0.3px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  pointer-events: none;
}

.gallery:hover::before {
  opacity: 1;
  visibility: visible;
}

.gallery::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(50, 50, 55, 0.25);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 16px;
  pointer-events: none;
}

.gallery:hover::after {
  opacity: 1;
}

.gallery img {
  transition: transform 0.3s ease;
  border: 1px solid #ddd;
  border-radius: 16px;
  background-color: #f9f9f9;
  padding: 12px;
}
</style>
```

이미지 뷰잉을 결정하는 `ref` 변수를 하나 설정하고 해당 `ref` 값을 제어하는 핸들러 `showImage`와 `onHide`를 등록해주겠습니다.

:::tip
css는 편하게 커스텀 하시면 됩니다 :smile:
:::

<br>

마지막으로 `/.vitepress/theme/index.ts` 에 컴포넌트를 등록해주겠습니다.

```ts
// https://vitepress.dev/guide/custom-theme
import DefaultTheme from "vitepress/theme";
import LightBoxImg from "../components/LightBoxImg.vue"; //[!code ++]

import "./custom.css";
import "./style.css";

const theme = {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx);
    ctx.app.component("LightBoxImg", LightBoxImg); //[!code ++]
  },
};

export default theme;
```

<br>

그리고 `markdown` 파일에서 다음과 같이 사용하시면 됩니다. :smile:

```markdown
### 📌 이미지 확대 기능을 만들어보자

<LightBoxImg src="/images/writerside.png" />
```
