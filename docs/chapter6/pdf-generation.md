# 문서 PDF 생성하기

VitePress로 작성한 문서를 PDF로 변환하여 오프라인 사용이나 인쇄용으로 제공할 수 있습니다. 이번 장에서는 VitePress 문서를 PDF로 변환하는 다양한 방법과 팁을 알아보겠습니다.

## PDF 변환의 필요성

### 왜 PDF 변환이 필요한가?

- **오프라인 접근성**: 인터넷 연결 없이도 문서 접근 가능
- **영구 보존**: 웹사이트 변경이나 서비스 중단에 영향 받지 않음
- **인쇄 친화적**: 표준화된 형식으로 일관된 인쇄 결과 제공
- **공식 배포**: 특정 버전의 문서를 공식 릴리스로 배포
- **규제 준수**: 일부 산업에서는 문서의 PDF 버전 보관이 필수

## PDF 변환 방법

### 1. 브라우저 내장 인쇄 기능 활용

가장 간단한 방법은 브라우저의 인쇄 기능을 사용하는 것입니다:

1. VitePress 사이트를 브라우저에서 열기
2. 인쇄하려는 페이지로 이동
3. `Ctrl+P` (Windows) 또는 `Cmd+P` (Mac)로 인쇄 대화상자 열기
4. 출력 대상을 "PDF로 저장"으로 설정
5. 필요한 인쇄 옵션 조정 (여백, 배경 그래픽 등)
6. PDF로 저장

**장점:**

- 추가 도구 불필요
- 빠르고 간편한 방법

**단점:**

- 페이지별로 개별 저장 필요
- 일관된 헤더/푸터 적용 어려움
- 목차나 하이퍼링크 제한적 지원

### 2. 전용 도구 사용: Puppeteer

Node.js 기반의 Puppeteer를 사용하여 PDF 생성을 자동화할 수 있습니다:

#### 설치하기

```bash
npm install --save-dev puppeteer
```

#### PDF 생성 스크립트 작성

`scripts/generate-pdf.js` 파일 생성:

```javascript
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// PDF 생성할 페이지 목록
const pages = [
  { url: "http://localhost:3000/", filename: "home.pdf" },
  { url: "http://localhost:3000/guide/", filename: "guide.pdf" },
  { url: "http://localhost:3000/reference/", filename: "reference.pdf" },
];

// PDF 옵션
const pdfOptions = {
  format: "A4",
  printBackground: true,
  margin: {
    top: "1cm",
    right: "1cm",
    bottom: "1cm",
    left: "1cm",
  },
  displayHeaderFooter: true,
  headerTemplate:
    '<div style="font-size:10px; text-align:center; width:100%; color:#888;">내 문서</div>',
  footerTemplate:
    '<div style="font-size:10px; text-align:center; width:100%; color:#888;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
};

// PDF 출력 디렉토리
const outputDir = path.join(__dirname, "../pdf");

// 디렉토리가 없으면 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// PDF 생성 함수
async function generatePDF() {
  const browser = await puppeteer.launch({ headless: true });

  for (const page of pages) {
    console.log(`Generating PDF for: ${page.url}`);

    const tab = await browser.newPage();
    await tab.goto(page.url, { waitUntil: "networkidle2" });

    // 필요시 페이지 조정 (예: 스타일 주입, 요소 숨기기 등)
    await tab.addStyleTag({
      content: `
        @media print {
          .vp-navbar, .VPSidebar, .VPDocFooter { display: none !important; }
          .VPContent { max-width: 100% !important; }
        }
      `,
    });

    // PDF 생성
    await tab.pdf({
      ...pdfOptions,
      path: path.join(outputDir, page.filename),
    });

    await tab.close();
    console.log(`PDF saved: ${page.filename}`);
  }

  await browser.close();
  console.log("All PDFs generated successfully!");
}

// 실행
generatePDF().catch((err) => {
  console.error("PDF generation failed:", err);
  process.exit(1);
});
```

#### package.json에 스크립트 추가

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

#### 실행하기

1. 개발 서버 실행: `npm run docs:dev`
2. 새 터미널에서 PDF 생성: `npm run docs:pdf`

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
