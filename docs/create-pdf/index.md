# 문서 PDF 생성하기

`VitePress`로 작성한 매뉴얼을 `PDF` 로 변환해보겠습니다.

처음에 고려했던 방법들입니다.

## 📌 브라우저 내장 인쇄 기능 활용

가장 간단한 방법은 브라우저의 인쇄 기능을 사용하는 것입니다:

1. VitePress 사이트를 브라우저에서 열기
2. 인쇄하려는 페이지로 이동
3. `Ctrl + P` (Windows) 로 인쇄 대화상자 열기
4. 출력 대상을 `PDF로 저장`으로 설정
5. 필요한 인쇄 옵션 조정
6. PDF로 저장

그러나 치명적인 단점이 있습니다.


:::danger
- 페이지별로 개별 저장하고 후에 합쳐야하는 불필요한 리소스가 발생합니다.
- PDF 페이지 별 일관된 `Header`, `Footer`의 적용이 어렵습니다.
- 목차를 직접 생성해야하는 번거로움이 있습니다.
- 결론적으로 많은 시간이 소요됩니다.
:::

그래서 라이브러리를 찾게 되었고,


## 📌 vitepress-export-pdf

`vitepress-export-pdf` 라는 라이브러리를 찾게 되었습니다.

그러나 사용해보니 다음과 같은 문제점이 있었습니다.

:::danger
1. 표지나 목차페이지는 따로 제작해야합니다..
2. PDF 페이지의 순서를 맞추기 힘듭니다.
3. 불필요한 `Vitepress` 라는 워터마크가 생깁니다.
4. 페이징 넘버 계산이 이상하게 됩니다.
:::

<br>

그리고 요구사항을 다시 한 번 점검해보겠습니다.

#### PDF 변환에 필요한 요구사항

:::tip
`표지` 페이지가 있어야 합니다.

`목차` 페이지가 있어야 합니다.

추후에 페이지가 추가되어도 `자동으로 목차 계산` 이 이루어져야 합니다.

`표지`와 `목차` 페이지에는 페이지 워터마크가 없어야 합니다.
:::


그래서 매뉴얼을 로컬서버에 띄워놓고 직접 크롤링을 해보기로 했습니다.

## 📌매뉴얼 크롤링 하기


### Puppeteer

크롤링 도구로는 Node.js 기반의 `Puppeteer`를 사용하였습니다.

`Puppeteer`를 설치해주겠습니다.

```sh
$ npm install -D puppeteer
```

<br>

### pdf-lib

PDF 생성을 위한 필요한 라이브러리인 `pdf-lib` 를 설치해주겠습니다.

```sh
$ npm install -D pdf-lib
```

<br>

### fs 모듈과 jsdom 설치

파일 I/O 작업과, 읽은 정적 `HTML` 파일을 dom으로 파싱하기 위해 `fs`와 `jsdom` 라이브러리를 설치해주겠습니다.

```sh
$ npm install -D fs jsdom
```

그리고 생성한 PDF 파일이 저장될 폴더를 만들어주겠습니다.

폴더명은  `pdf`  입니다.


```sh
$ mkdir ./docs/pdf
```

<br>


#### PDF 생성 자바스크립트 작성

`./.vitepress/pdf/pdf-convert.js`  파일을 하나 생성해주겠습니다.

그 다음 위에서 설치했던 라이브러리들을 모두 CommonJs 형식으로 `import` 해줍니다.


```js
const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
```

그리고 `global`  컨텍스트에서 사용할 수 있는 `__dirname`을 사용하여 생성한 pdf를 저장할 폴더 절대 경로를 가져옵니다.

```js
const pdfDir = path.resolve(__dirname, '../../../docs/pdf');
```

<br>

##### 브라우저 인스턴스 실행

```js
const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
const page = await browser.newPage();
```

`puppeteer`의 메서드를 이용해 브라우저 인스턴스를 실행해 Browser Context 에 `page` 를 생성해주겠습니다.

<br>


##### 크롤링 할 경로로 이동

`Page`의 `goto` 메서드를 사용해 크롤링을 원하는 경로로 이동해주겠습니다. 


```js
 await page.goto(`${baseUrl}/${원하는 경로}/`, {
    waitUntil: 'networkidle0',
  });
```

그 다음, 차례대로 크롤러를 돌리기 위해 이동할 경로를 모두 알아야합니다.


<br>

##### 이동할 경로 생성

먼저 `vitepress` 의 sidebar를 구성하고 있는 `<a>` 태그 내부의 `href` 속성을 모두 가져와 path list를 만들어주겠습니다.

`Page` 의 `evaluate` 메서드를 사용합니다.

이 메서드는 브라우저 DOM 에 직접 접근하여 데이터를 조작하고 추출할 수 있게 해주는 메서드입니다. `Promise`를 반환합니다.

```ts
const paths = await extractManualPaths(page);

const extractManualPaths = asnyc (page: Puppeteer.Page) => {
	return await page.evaluate(() => {


	/**
	 * 사이드바의 모든 항목을 찾습니다.
	 * - 사이드바의 항복의 기본 구성 선택자는 '.item' 입니다.
	 */
    const allItems = document.querySelectorAll('.item');


    // 최종적으로 return 될 아이템 배열
    const paths = [];
    const seenPaths = new Set();
  
    allItems.forEach((item) => {
      // href 속성을 가진 a 태그 찾기
      const linkElement = item.querySelector('a[href]');

      // href 속성을 가진 a 태그일 경우
      if (linkElement) {
        const href = linkElement.getAttribute('href');
        const title = linkElement.textContent.trim();

        // ${원하는 경로} 로 시작하는 내부 링크만 추가
        if (href && href.startsWith("${원하는 경로}")) {
        
          // 중복된 경로가 아닐 시에만 paths에 아이템 추가
          if (!seenPaths.has(href) && !seenPaths.has(title)) {
            seenPaths.add(href);
            seenPaths.add(title);

            // 결과 배열에 객체 추가
            paths.push({
              path: href,
              title,
            });
          }
        }
      }
    });

    return paths;
  });	 
}
```

`paths` 배열의 데이터 구조는 아래와 같습니다.

```sh
[
  {
    path: '/developer-manual/client-stub/',
    title: '9. Client Stub 가이드'
  },
  { 
	path: '/developer-manual/client-stub/setup/',
	title: '9.1. 설정'
  },
  {
    path: '/developer-manual/client-stub/specification/',
    title: '9.2. API 명세'
  },
  {
    path: '/developer-manual/client-stub/usage/',
    title: '9.3. API 사용법'
  }
]
```

##### Vitepress 스타일 수집

다음으로 스타일을 수집해야합니다.

만약, 스타일을 수집하지 않고 크롤링 컨텐츠 그대로 `PDF`로 생성한다면 단순 논문형식의 `PDF` 가 생성될 것 입니다.

```js
  const vitePressStyles = await page.evaluate(() => {
    const styleSheets = Array.from(document.styleSheets);
    
    let styles = '';

    styleSheets.forEach((sheet) => {
        Array.from(sheet.cssRules).forEach((rule) => {
          styles += rule.cssText;
        });
    });

    return styles;
  });
```

추후 `<style>` 태그에 들어갈 style 을 미리 긁어놓겠습니다.


<br>

##### 페이지 계산

목차페이지에 들어갈 페이지를 계산해보겠습니다.

현재 목차페이지에서 선택자에 아래와 같은 스타일을 적용 중입니다.

```css
.level-1 {
	font-weight: 600;
	margin-top: 12px;
	font-size: 14px;
}
 
.level-2 {
	padding-left: 20px;
}

.level-2 .text {
	font-size: 14px;
	margin-right: -30px;
}

.level-3 {
	padding-left: 40px;
}

.level-3 .text {
	font-size: 14px;
	margin-right: -60px;
}

.level-4 {
	padding-left: 60px;
}

.level-4 .text {
	font-size: 12px;
	margin-right: -90px;
}
```

각 `level`






















```json
{
  "scripts": {
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs",
    "docs:pdf": "node scripts/generate-pdf.js"
  }
}
```

# PDF 생성 프로세스 흐름 설명

## 1. 초기화 및 설정
- puppeteer를 사용하여 헤드리스 브라우저 실행
- PDF 저장 디렉토리 설정 및 확인
- 기본 URL 설정 (로컬호스트 또는 환경변수에서 가져옴)

## 2. 콘텐츠 수집 단계
- 브라우저로 클라이언트 스텁 매뉴얼 첫 페이지 접속
- 사이드바에서 `/developer-manual/client-stub/` 경로로 시작하는 모든 링크 추출
- 각 페이지의 제목과 경로 정보 수집 및 중복 제거

## 3. 페이지 번호 매핑 구성
- 각 섹션의 시작 페이지 번호 계산
- 표지와 목차 페이지 고려하여 오프셋 적용
- 각 페이지 콘텐츠 수집 및 페이지 수 계산

## 4. 본문 생성 프로세스
- 각 페이지 순차적 방문하여 콘텐츠 추출
- 이미지 최적화 및 스타일 조정
- 빈 섹션 제거 및 페이지 나누기 설정
- 임시 PDF 생성으로 각 섹션의 페이지 수 계산

## 5. 목차 생성 과정
- 기본 목차 템플릿(list.html) 로드
- JSDOM으로 목차 HTML 구조 조작
- 각 섹션의 제목과 계산된 페이지 번호 삽입
- 수정된 목차 HTML 저장 및 PDF로 변환(표지 포함)

## 6. PDF 조합 및 마무리
- 본문 콘텐츠를 HTML로 조합하여 메인 PDF 생성
- 목차 PDF와 본문 PDF 병합
- 임시 파일 삭제 및 최종 PDF 저장
- 완료 메시지 출력

## 주요 기술 포인트
- puppeteer로 웹페이지 렌더링 및 PDF 변환
- pdf-lib로 PDF 파일 병합 및 조작
- JSDOM으로 HTML 구조 조작
- 웹사이트의 CSS 스타일 유지하며 PDF 최적화

### 3. 전체 문서를 하나의 PDF로 통합

여러 페이지를 하나의 PDF로 합치기 위한 `merge-pdfs.js` 스크립트:

```javascript
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

// PDF 통합 함수
async function mergePDFs(inputFiles, outputFile) {
  // 새 PDF 문서 생성
  const mergedPdf = await PDFDocument.create();

  // 각 PDF 파일 처리
  for (const inputFile of inputFiles) {
    const pdfBytes = fs.readFileSync(inputFile);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  // 통합된 PDF 저장
  const mergedPdfFile = await mergedPdf.save();
  fs.writeFileSync(outputFile, mergedPdfFile);
  console.log(`Merged PDF saved to: ${outputFile}`);
}

// 입력 파일 경로
const pdfDir = path.join(__dirname, "../pdf");
const inputFiles = [
  path.join(pdfDir, "home.pdf"),
  path.join(pdfDir, "guide.pdf"),
  path.join(pdfDir, "reference.pdf"),
];

// 출력 파일 경로
const outputFile = path.join(pdfDir, "complete-documentation.pdf");

// 실행
mergePDFs(inputFiles, outputFile).catch((err) => {
  console.error("PDF merging failed:", err);
  process.exit(1);
});
```

필요한 라이브러리 설치:

```bash
npm install --save-dev pdf-lib
```

## PDF 품질 최적화 팁

### 1. 인쇄용 스타일 시트 적용

`docs/.vitepress/theme/custom.css`에 인쇄용 스타일 추가:

```css
/* 인쇄용 스타일 */
@media print {
  /* 탐색 요소 숨기기 */
  .vp-navbar,
  .VPSidebar,
  .VPDocFooter,
  .VPDocAside {
    display: none !important;
  }

  /* 컨텐츠 영역 최대화 */
  .VPContent,
  .VPDoc {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* 페이지 나누기 조정 */
  h1,
  h2 {
    page-break-before: always;
  }

  h1:first-of-type,
  h2:first-of-type {
    page-break-before: avoid;
  }

  /* 페이지 내 요소 유지 */
  pre,
  blockquote,
  table {
    page-break-inside: avoid;
  }

  /* 링크 주소 표시 */
  a[href]:after {
    content: " (" attr(href) ")";
    font-size: 90%;
    color: #555;
  }

  /* 내부 링크는 주소 표시 안 함 */
  a[href^="#"]:after,
  a[href^="/"]:after {
    content: "";
  }

  /* 인쇄시 배경색 및 이미지 표시 */
  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
```

### 2. 목차 및 북마크 생성

Puppeteer 스크립트를 확장하여 목차 생성:

```javascript
// PDF 생성 전 헤딩 정보 추출
const headings = await tab.evaluate(() => {
  const headingElements = Array.from(document.querySelectorAll("h1, h2, h3"));
  return headingElements.map((heading) => ({
    text: heading.textContent,
    level: parseInt(heading.tagName.substring(1)),
    id: heading.id,
  }));
});

// 목차 페이지 생성 및 추가
const tocHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 2cm; }
    h1 { text-align: center; margin-bottom: 2cm; }
    .toc-item { margin-bottom: 8px; }
    .toc-level-1 { margin-left: 0; font-weight: bold; }
    .toc-level-2 { margin-left: 1cm; }
    .toc-level-3 { margin-left: 2cm; }
  </style>
</head>
<body>
  <h1>목차</h1>
  ${headings
    .map(
      (h) => `
    <div class="toc-item toc-level-${h.level}">
      ${h.text} ........................ ${h.pageNumber || ""}
    </div>
  `
    )
    .join("")}
</body>
</html>
`;
```

## PDF 변환 자동화

### CI/CD 파이프라인에 통합

GitHub Actions workflow 예시 (`pdf-generation.yml`):

```yaml
name: Generate Documentation PDFs

on:
  push:
    branches: [main]
    paths:
      - "docs/**"

jobs:
  build-and-generate-pdf:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "16"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build documentation
        run: npm run docs:build

      - name: Start preview server
        run: npm run docs:preview &

      - name: Wait for server
        run: sleep 10

      - name: Generate PDFs
        run: npm run docs:pdf

      - name: Upload PDFs as artifacts
        uses: actions/upload-artifact@v3
        with:
          name: documentation-pdfs
          path: pdf/

      # 선택적: 릴리스에 PDF 첨부
      - name: Create Release
        if: startsWith(github.ref, 'refs/tags/')
        uses: softprops/action-gh-release@v1
        with:
          files: pdf/complete-documentation.pdf
```

## 다국어 문서 PDF 생성

다국어 문서를 위한 PDF 생성 확장 스크립트:

```javascript
// 언어별 URL 구성
const languages = ["ko", "en", "ja"];
const pages = [
  { path: "/", name: "home" },
  { path: "/guide/", name: "guide" },
  { path: "/reference/", name: "reference" },
];

// 언어별 페이지 URL 생성
const allPages = [];
for (const lang of languages) {
  const langPrefix = lang === "ko" ? "" : `/${lang}`;
  for (const page of pages) {
    allPages.push({
      url: `http://localhost:3000${langPrefix}${page.path}`,
      filename: `${lang}-${page.name}.pdf`,
      language: lang,
    });
  }
}
```

이러한 방법을 활용하면 VitePress 문서를 고품질 PDF로 변환하여 다양한 용도로 활용할 수 있습니다.
