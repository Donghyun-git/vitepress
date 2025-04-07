import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: [
    ["link", { rel: "icon", href: "/images/vitepress-logo-mini.svg" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com" }],
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap",
      },
    ],
  ],
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
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: "local",
    },

    logo: "/images/vitepress-logo-mini.svg",
    siteTitle: "Vitepress 매뉴얼 구축",
    outline: {
      label: "목차",
      level: "deep",
    },

    sidebar: {
      "/": [
        {
          /**
           * 토글 여부
           * - true: 페이지 초기 로드 시 토글이 닫혀있음
           * - false: 페이지 초기 로드 시 토글이 열려있음
           */
          items: [
            {
              text: "1. 기존 매뉴얼 관리 방법",
              link: "/old/",
              collapsed: false,
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

            {
              text: "4. 컨텐츠 구성 및 작성 방법",
              link: "/write/",
              collapsed: false,
            },

            {
              text: "5. 문서에 스타일 적용하기",
              link: "/style/",
              collapsed: false,
            },

            {
              text: "6. 문서 PDF 생성하기",
              link: "/create-pdf/",
              collapsed: false,
            },

            {
              text: "7. 배포 및 유지보수",
              collapsed: false,
            },

            {
              text: "8. QnA",
              collapsed: false,
            },
          ],
        },
      ],
    },
  },
});
