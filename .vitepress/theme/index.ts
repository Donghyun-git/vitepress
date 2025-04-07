// https://vitepress.dev/guide/custom-theme
import DefaultTheme from "vitepress/theme";
import "./style.css";
import "./custom.css";

// DefaultTheme을 베이스로 하는 새로운 테마 객체 생성
const theme = {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx);

    // 클라이언트 사이드에서만 실행
    if (typeof window !== "undefined") {
      // 전역 상태 변수
      window.__lightboxOpen = false;

      // 페이지 로드 후 실행
      window.addEventListener("load", () => {
        console.log("Window loaded, initializing lightbox...");

        // Vue Easy Lightbox 스크립트 로드
        const script = document.createElement("script");
        script.src =
          "https://unpkg.com/vue-easy-lightbox@next/dist/vue-easy-lightbox.umd.min.js";
        script.async = true;

        script.onload = () => {
          // 라이트박스 컨테이너 생성
          const container = document.createElement("div");
          container.id = "lightbox-container";
          document.body.appendChild(container);

          // 라이트박스 앱 생성
          const { createApp, ref } = window.Vue;

          const app = createApp({
            template: `
              <vue-easy-lightbox
                :visible="visible"
                :imgs="imgs"
                :index="index"
                :moveDisabled="false"
                :zoomScale="0.5"
                :loop="true"
                :showArrows="true"
                :showCounter="true"
                @hide="onHide"
              ></vue-easy-lightbox>
            `,
            setup() {
              const visible = ref(false);
              const imgs = ref([]);
              const index = ref(0);

              // 단일 이미지 표시
              const showImage = (src) => {
                imgs.value = [src];
                index.value = 0;
                visible.value = true;
                window.__lightboxOpen = true;

                // 스크롤바 너비 계산
                const scrollbarWidth =
                  window.innerWidth - document.documentElement.clientWidth;
                document.body.style.paddingRight = `${scrollbarWidth}px`;
                document.body.style.overflow = "hidden";
              };

              // 갤러리 모드로 이미지 표시
              const showGallery = (images, startIndex = 0) => {
                imgs.value = images;
                index.value = startIndex;
                visible.value = true;
                window.__lightboxOpen = true;

                // 스크롤바 너비 계산
                const scrollbarWidth =
                  window.innerWidth - document.documentElement.clientWidth;
                document.body.style.paddingRight = `${scrollbarWidth}px`;
                document.body.style.overflow = "hidden";
              };

              // 닫기 이벤트 핸들러
              const onHide = () => {
                visible.value = false;
                window.__lightboxOpen = false;

                // setTimeout을 사용하여 Vue의 렌더링 사이클 이후에 실행
                setTimeout(() => {
                  // 명시적으로 스타일 제거
                  document.body.style.removeProperty("overflow");
                  document.body.style.removeProperty("paddingRight");
                }, 0);
              };

              // 전역 함수로 노출
              window.showLightbox = showImage;
              window.showLightboxGallery = showGallery;
              window.hideLightbox = onHide;

              return {
                visible,
                imgs,
                index,
                onHide,
              };
            },
          });

          // Vue Easy Lightbox 컴포넌트 등록
          app.component("VueEasyLightbox", window.VueEasyLightbox);

          // 앱 마운트
          app.mount("#lightbox-container");

          // 이미지 초기화
          initializeImages();

          // 페이지 변경 감지
          setupObserver();

          // ESC 키 이벤트 리스너
          document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && window.__lightboxOpen) {
              // 강제로 body 스타일 초기화
              document.body.style.removeProperty("overflow");
              document.body.style.removeProperty("paddingRight");
              window.__lightboxOpen = false;
            }
          });

          // 클릭 이벤트 리스너 (모달 외부 클릭 시 닫기)
          document.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            if (
              window.__lightboxOpen &&
              target.classList.contains("vel-modal__mask")
            ) {
              setTimeout(() => {
                document.body.style.removeProperty("overflow");
                document.body.style.removeProperty("paddingRight");
              }, 100);
            }
          });
        };

        script.onerror = (error) => {
          console.error("Failed to load Vue Easy Lightbox script:", error);
        };

        // Vue 스크립트 로드
        const vueScript = document.createElement("script");
        vueScript.src = "https://unpkg.com/vue@3/dist/vue.global.prod.js";
        vueScript.async = true;

        vueScript.onload = () => {
          console.log("Vue script loaded");
          document.head.appendChild(script);
        };

        vueScript.onerror = (error) => {
          console.error("Failed to load Vue script:", error);
        };

        document.head.appendChild(vueScript);
      });

      // 이미지 초기화 함수
      const initializeImages = () => {
        // vel-img 클래스를 가진 이미지는 제외
        const images = document.querySelectorAll(
          '.content img:not([class*="icon"]):not([class*="vel-img"]):not([style*="display: inline"]), img[style]:not([class*="vel-img"])'
        );

        // 이미지들을 gallery div로 래핑
        const imageGroups = {};

        images.forEach((element, index) => {
          const img = element as HTMLImageElement;
          // 이미 처리된 이미지는 건너뛰기
          if (img.dataset.lightboxInit === "true") {
            return;
          }

          // 이미지의 부모 요소 확인
          const parent = img.parentElement;

          // 이미 gallery div로 래핑된 경우 건너뛰기
          if (parent && parent.classList.contains("gallery")) {
            img.dataset.lightboxInit = "true";
            return;
          }

          // 라이트박스 관련 요소 내부의 이미지는 건너뛰기
          if (img.closest(".vel-modal") || img.closest("#lightbox-container")) {
            return;
          }

          // 이미지가 속한 문서 섹션 찾기 (예: 가장 가까운 heading 요소)
          const section =
            img.closest("section") || img.closest(".content") || document.body;

          // 섹션별로 이미지 그룹화
          if (!imageGroups[section.id || index]) {
            imageGroups[section.id || index] = [];
          }

          imageGroups[section.id || index].push(img);
          img.dataset.lightboxInit = "true";
        });

        // 각 그룹별로 gallery div 생성 및 이미지 래핑
        Object.values(imageGroups).forEach((elements) => {
          const groupImages = elements as HTMLImageElement[];

          if (groupImages.length === 0) return;

          // 첫 번째 이미지의 위치에 gallery div 생성
          const firstImg = groupImages[0];
          const parent = firstImg.parentElement;

          // gallery div 생성
          const galleryDiv = document.createElement("div");
          galleryDiv.className = "gallery";
          galleryDiv.style.width = "fit-content";
          galleryDiv.style.marginTop = "6px";

          // 첫 번째 이미지 앞에 gallery div 삽입
          parent?.insertBefore(galleryDiv, firstImg);

          // 모든 이미지를 gallery div로 이동
          groupImages.forEach((img) => {
            // 이미지 스타일 설정
            img.style.cursor = "pointer";

            // 클릭 이벤트 리스너 추가
            img.onclick = function (e) {
              e.preventDefault();
              e.stopPropagation();

              // 갤러리의 모든 이미지 수집
              const galleryImages = Array.from(
                galleryDiv.querySelectorAll("img")
              ).map((galleryImg: HTMLImageElement) => galleryImg.src);

              // 클릭한 이미지의 인덱스 찾기
              const clickedIndex = galleryImages.indexOf(
                (this as HTMLImageElement).src
              );

              // 전역 함수 호출 - 갤러리 모드로 열기
              if (typeof window.showLightboxGallery === "function") {
                window.showLightboxGallery(galleryImages, clickedIndex);
              } else {
                console.error("showLightboxGallery function not found");
              }

              return false;
            };

            galleryDiv.appendChild(img);
          });
        });
      };

      // 페이지 변경 감지를 위한 옵저버 설정
      const setupObserver = () => {
        const observer = new MutationObserver((mutations) => {
          let shouldReinitialize = false;

          for (const mutation of mutations) {
            if (
              mutation.type === "childList" &&
              mutation.addedNodes.length > 0
            ) {
              // 라이트박스 관련 요소가 추가된 경우는 무시
              const isLightboxRelated = Array.from(mutation.addedNodes).some(
                (node) => {
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;
                    return (
                      element.classList?.contains("vel-modal") ||
                      element.id === "lightbox-container" ||
                      element.querySelector(".vel-img")
                    );
                  }
                  return false;
                }
              );

              if (!isLightboxRelated) {
                shouldReinitialize = true;
                break;
              }
            }
          }

          if (shouldReinitialize) {
            setTimeout(initializeImages, 500);
          }
        });

        // 콘텐츠 영역 관찰
        const contentElement =
          document.querySelector(".VPContent") || document.body;
        if (contentElement) {
          observer.observe(contentElement, { childList: true, subtree: true });
        }
      };

      // 페이지 언로드 시 body 스타일 초기화
      window.addEventListener("beforeunload", () => {
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("paddingRight");
      });

      // 추가: 주기적으로 라이트박스 상태 확인 및 스타일 초기화
      setInterval(() => {
        const lightboxElement = document.querySelector(".vel-modal");
        if (!lightboxElement && window.__lightboxOpen) {
          document.body.style.removeProperty("overflow");
          document.body.style.removeProperty("paddingRight");
          window.__lightboxOpen = false;
        }
      }, 1000);
    }
  },
};

// 스타일 추가
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    /* 갤러리 스타일 */

    /* Vue Easy Lightbox 커스텀 스타일 */
    .vel-modal {
      z-index: 9999 !important;
    }
    
    .vel-modal .vel-img {
      max-width: 90vw;
      max-height: 90vh;
      object-fit: contain;
    }
    
    /* 확대/축소 커서 스타일 */
    .vel-img.vel-img--scalable {
      cursor: zoom-in;
    }
    
    .vel-img.vel-img--scalable.vel-img--scaled {
      cursor: zoom-out;
    }
    
    /* 배경 스타일 */
    .vel-modal .vel-modal__mask {
      background-color: rgba(0, 0, 0, 0.9);
    }
    
    /* 닫기 버튼 스타일 */
    .vel-modal .vel-btns__close {
      opacity: 0.8;
      transition: opacity 0.3s ease;
    }
    
    .vel-modal .vel-btns__close:hover {
      opacity: 1;
    }
    
    /* 화살표 버튼 스타일 */
    .vel-modal .vel-btns__arrow {
      opacity: 0.7;
      transition: opacity 0.3s ease;
    }
    
    .vel-modal .vel-btns__arrow:hover {
      opacity: 1;
    }
    
    /* 카운터 스타일 */
    .vel-modal .vel-counter {
      font-size: 14px;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 5px 10px;
      border-radius: 15px;
    }
    
    /* 모바일 최적화 */
    @media (max-width: 768px) {
   
      
      .vel-modal .vel-img {
        max-width: 95vw;
        max-height: 95vh;
      }
      
      .vel-modal .vel-btns__arrow {
        transform: scale(0.8);
      }
    }
  `;
  document.head.appendChild(style);
}

// 전역 타입 선언
declare global {
  interface Window {
    Vue: any;
    VueEasyLightbox: any;
    showLightbox: (src: string) => void;
    showLightboxGallery: (images: string[], startIndex?: number) => void;
    hideLightbox: () => void;
    __lightboxOpen: boolean;
  }
}

export default theme;
