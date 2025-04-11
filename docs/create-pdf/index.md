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

## 📌 매뉴얼 크롤링 하기

### Puppeteer

크롤링 도구로는 Node.js 기반의 `Puppeteer`를 사용하였습니다.

또한 `Puppeteer` 는 크롤링한 페이지를 `PDF Binary` 로 변환해주는 기능도 가지고 있습니다.

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

폴더명은 `pdf` 입니다.

```sh
$ mkdir ./docs/pdf
```

<br>

#### 정적 html 생성

`./.vitepress/pdf/list.html` 파일을 하나 생성해주겠습니다.

이 `html` 문서는 추후에 `커버페이지`, `목차페이지`를 생성하는 정적인 파일입니다.

css는 기호에 맞게 해주시면 됩니다.

<br>

아래는 팀 내 매뉴얼 중 `Client Stub 매뉴얼` 커버 페이지의 `PDF`의 일부입니다.

<LightBoxImg src="/images/pdf_cover.png" />

<br>

#### PDF 생성 자바스크립트 작성

`./.vitepress/pdf/pdf-convert.js` 파일을 하나 생성해주겠습니다.

그 다음 위에서 설치했던 라이브러리들을 모두 CommonJs 형식으로 `import` 해줍니다.

```js
const puppeteer = require("puppeteer");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
```

그리고 `global` 컨텍스트에서 사용할 수 있는 `__dirname`을 사용하여 생성한 pdf를 저장할 폴더 절대 경로를 가져옵니다.

```js
const pdfDir = path.resolve(__dirname, "../../../docs/pdf");
```

<br>

##### 브라우저 인스턴스 실행

```js
const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
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

<br>

##### Vitepress 스타일 수집

다음으로 매뉴얼 페이지의 스타일을 수집해야합니다.

만약, 스타일을 수집하지 않고 크롤링 컨텐츠 그대로 `PDF`로 생성한다면 단순 논문형식의 `PDF` 가 생성될 것 입니다.

```js
const vitePressStyles = await page.evaluate(() => {
  const styleSheets = Array.from(document.styleSheets);
  let styles = "";

  styleSheets.forEach((sheet) => {
    Array.from(sheet.cssRules).forEach((rule) => {
      styles += rule.cssText;
    });
  });

  return styles;
});
```

추후 `<style>` 태그에 들어갈 style 을 미리 긁어놓겠습니다.

:::info
`styleSheets`과 이를 구성하고 있는 각 아이템의 `cssRules` 객체는 `iterable` 한 객체기 때문에 배열 변환이 가능합니다.
:::

<br>

##### 목차 페이지 생성하기

목차 페이지에 들어갈 페이지 Number를 계산해보겠습니다.

현재 팀 매뉴얼의 목차 페이지 요소 `class 선택자`에 아래와 같은 스타일을 적용 중입니다.

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

각 `level-{n}` 은 숫자가 커질 수록 목차 뎁스, 즉 하위 메뉴 제목의 스타일을 구성합니다.

:::tip
위는 예시이고 스타일은 마음대로 변경하셔도 됩니다.
:::

<br>

필요한 변수를 생성해주겠습니다.

```js
// 페이지 별 css 스타일과 제목 데이터를 담을 Map
const pageNumberMap = {};

// 각 세션이 시작될 페이지
// 목차와 표지페이지를 제외하면 1부터 스타트
let currentPage = 1;

// 각 페이지 별 html string을 담을 변수
// [ 목차 계산과 최종 pdf 변환에 사용 ]
let contentString = "";
```

<br>

###### pageNumberMap에 데이터 넣기

반복문을 돌며 PDF 생성에 필요한 변수의 데이터를 채워주겠습니다.

```js
for (let i = 0; i < paths.length; i++) {
  const pageInfo = paths[i]; // 현재 섹션의 시작 페이지 번호 저장

  pageNumberMap[pageInfo.title.split(".")] = {
    title: pageInfo.title,
    tocLevelStyle: `level-${pageInfo.title.split(".").length - 1}`,
    pageNumberStyle: currentPage < 10 ? "page-number-one" : "",
    currentPage: pageInfo.path !== "" ? currentPage : "",
  };

  //다른 로직..
}
```

첫 번째 순환 때는 무조건 첫 페이지기 때문에 `currentPage` 가 `1` 입니다.

데이터 삽입 후처리로 `page` 계산을 미리 해주겠습니다.

`tocLevelStyle` 은 위에서 언급했던 `level-{n}`의 스타일을 적용하기 위해 만든 데이터 입니다.

현재 매뉴얼 페이지 별 제목, 즉 `<h1>` 태그는

> `1. 매뉴얼`, 그 하위 메뉴 페이지는 `1. 1. 매뉴얼 하위`

같이 구성되어 있습니다.

```js
pageInfo.title.split(".");
```

따라서 위와 같이 배열을 쪼개면

```sh
[ '9', ' 매뉴얼' ]

[ '9', '1', ' 설정' ]

[ '9', '2', ' API 명세' ]

[ '9', '3', ' API 사용법' ]
```

다음과 같이 나오게 됩니다.

```js
`level-${pageInfo.title.split(".").length - 1}`;
```

따라서 `배열의 길이 - 1`로 `level-{n}`을 정할 수 있습니다.

:::tip
반복문 인덱스로 접근하는 `paths` 배열은 사이드바를 구성하고 있는 `<a>` 태그의 `href` 속성을 순서대로 정렬한 배열입니다.

```js
[
  {
    path: "/developer-manual/client-stub/",
    title: "9. Client Stub 가이드",
  },
  //...
];
```

:::

다음에는 목차 페이지를 계산하기 위해 계산할 경로로 이동해주겠습니다.

```js
if (pageInfo.path !== "") {
  await page.goto(`${baseUrl}${pageInfo.path}`, {
    waitUntil: "networkidle0",
  });

  //다른 로직...
}
```

<br>

###### 이미지 속성 변경

페이지 이동 후, 이미지의 속성을 제거해주어야합니다.

현재 매뉴얼의 `<img>` 태그의 속성 중에는 `loading=lazy` 슥성이 있습니다.

왜냐하면 `config.mts`에서

```js
markdown: {
    image: {
      lazyLoading: true,
    },
  },
```

위와 같은 옵션을 설정했기 때문입니다.

`Puppeteer`에서 실행하는 `브라우저 인스턴스`의 메서드로 페이지에 접근하는 당시에는 이미지가 레이지로딩이 적용되어 이미지를 인식하지 못하게 되어 convert한 `PDF` 결과물에는 이미지가 보이지 않게 됩니다.

```js
const content = await page.evaluate(() => {
  const mainContent = document.querySelector(".vp-doc");

  if (!mainContent) return "";

  // loading="lazy" 속성 제거
  const images = mainContent.querySelectorAll("img");

  images.forEach((img) => {
    img.removeAttribute("loading");
    img.style.maxWidth = "100%";
    img.style.height = "auto";
  });

  return mainContent.outerHTML;
});

contentString += `
	<div class="page-content" style="page-break-after: always;">
	  ${content}
	</div>
`;
```

위와 같이 해당 경로 매뉴얼 페이지에 `<img>` 태그가 존재한다면, 모두 찾아 속성을 제거합니다. 그리고, `lazyloading`이 적용된 `<img>` 태그가 포함된 페이지 컨텐츠를 `content` 변수에 담아주겠습니다.

그리고 해당 컨텐츠를 `contentString` 변수에 담아주겠습니다.

:::tip
`page-break-after: always` 라는 style은 PDF 간의 페이지 단위를 구분할 수 있게 해줍니다.
:::

###### 임시 브라우저 생성

```js
const tempPage = await browser.newPage();

await tempPage.setContent(`
<!DOCTYPE html>
<html>
  <head>
	<style>
	  ${vitePressStyles}

	   .title-container {
			text-align: right;
			margin-top: 60px;
			width: 100%;
		}

		.main-title {
			font-size: 60px;
			font-weight: 500;
			margin-bottom: 4px;
			color: #000;
		}

		.title-line {
			height: 3px;
			background-color: #000;
			margin: 4px 0;
			width: 100%;
		}

		.sub-title {
			font-size: 32px;
			font-weight: 500;
			margin-top: 4px;
			color: #000;
			text-align: right;
			border-bottom: 3px solid #000;
		}

		.company-info {
			text-align: right;
			margin-top: 20px;
			width: 100%;
		}

		.company-name {
			font-size: 22px;
			font-weight: 600;
			color: #1a1a1a;
		}

		.logo-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			flex: 1;
		}

		.logo {
			width: 240px;
			margin-bottom: 10px;
		}

		.copyright {
			font-size: 12px;
			color: #666;
			margin-top: 5px;
		}

		.page-content {
			padding-bottom: 30px;
			min-height: 100px;
		}

	  /* 마지막 페이지는 page-break 제거 */
	  .page-content:last-child {
		page-break-after: auto;
	  }

	  /* 페이지 나누기 최적화 */
	  h1 {
		page-break-after: avoid;
		page-break-inside: avoid;
		margin-top: 1em;
	  }

	  p {
		orphans: 3;
		widows: 3;
	  }

	  /* 콘텐츠 압축을 위한 추가 스타일 */
	  body {
		margin: 0;
		padding: 0;
	  }

	  .vp-doc {
		margin: 0;
		padding: 0;
	  }
	</style>
  </head>

  <body>
   <div class="page-content" style="page-break-after: always">
	<div class="cover-page">
		<div class="title-container">
		  <h1 class="main-title">eCross V5</h1>
		  <div class="title-line"></div>
		  <h2 class="sub-title">Client Stub 매뉴얼</h2>
		</div>
		
		<div class="company-info">
		  <h3 class="company-name">(주)인젠트</h3>
		</div>

		<div class="logo-container">
		  <img class="logo" src="${baseUrl}/images/text-logo.png" alt="INZENT" />
		  <p class="copyright">Copyright © 2024 (주)인젠트</p>
		</div>
	</div>
	</div>

	<div class="page-content">
	  ${content}
	</div>
  </body>
</html>
`);
```

임시 페이지 생성을 위해 새로운 페이지를 열고 `HTML string` 을 `setContent` 메서드로 새로운 페이지에 세팅해주겠습니다.

그리고 컨텐츠가 들어갈 곳에 이미지 레이지로딩을 제거한 매뉴얼 페이지의 `content` 변수를 템플릿 리터럴로 넣어주겠습니다.

<br>

###### 임시 페이지 PDF 로드

```js
// PDF 바이너리 생성
const pdfBuffer = await tempPage.pdf({
  format: 'A4',
  printBackground: true,
  margin: {
	top: '40px',
	bottom: '70px',
	left: '50px',
	right: '50px',
  },
});

// PDF 파일을 로드하여 페이지 수 확인
const tempPdfDoc = await PDFDocument.load(pdfBuffer);
const pageCount = tempPdfDoc.getPageCount();

currentPage += pageCount - 1;

// 임시 페이지 닫기
await tempPage.close();

//for문 n회 종료
}
```

최종적으로 생성한 임시페이지를 pdf 바이너리 데이터로 변환해주겠습니다.

그리고 `pdf-lib` 라이브러리에서 제공하는 `PDFDcoument` class의 `load` 메서드를 사용하여 `PDF`를 로드합니다.

그리고 로드된 PDF의 페이지를 카운트하기위해 `getPageCount` 메서드로 카운팅 후, `pageCount` 변수에 넣어주겠습니다.

그리고 상위 스코프에서 선언했던 `currentPage` 의 수를 업데이트 합니다.

마지막으로 `close` 메서드를 호출하여 임시페이지를 닫아줍니다.

:::info
임시페이지 생성에 표지페이지가 포함되어 있어서 `-1` 을 해주었습니다. 표지페이지를 제외하면

```js
currengPage += pageCount;
```

만 하면 됩니다.
:::

<br>

모든 반복문 순회가 끝나면 `pageNumberMap` 변수는 아래와 같은 데이터 구조로 생성됩니다.

```js
{
  '9, Client Stub 가이드': {
    title: '9. Client Stub 가이드',
    tocLevelStyle: 'level-1',
    pageNumberStyle: 'page-number-one',
    currentPage: 1
  },
  '9,1, 설정': {
    title: '9.1. 설정',
    tocLevelStyle: 'level-2',
    pageNumberStyle: 'page-number-one',
    currentPage: 2
  },
  '9,2, API 명세': {
    title: '9.2. API 명세',
    tocLevelStyle: 'level-2',
    pageNumberStyle: 'page-number-one',
    currentPage: 5
  },
  '9,3, API 사용법': {
    title: '9.3. API 사용법',
    tocLevelStyle: 'level-2',
    pageNumberStyle: 'page-number-one',
    currentPage: 8
  }
}
```

<br>

###### 정적 HTML에 목차 페이지 삽입하기

```js
// 정적 html 읽어오기
const listHtmlPath = path.resolve(__dirname, "./list.html"); // 바뀐 html로 재할당 예정
let listHtmlContent = fs.readFileSync(listHtmlPath, "utf8"); // DOM 파싱

const dom = new JSDOM(listHtmlContent);
const document = dom.window.document;
```

커버 페이지와 목차 렌더링을 위해 생성해놨던 정적 파일 `list.html` 을 가져와 dom을 파싱한 후, 제어해주겠습니다.

`node` 커맨드로 자바스크립트 파일을 구동할 때는, 브라우저 환경이 아닌 `global` 컨텍스트에서 실행되기 때문에 `web api` 에 접근하기 위해서는 `dom`을 먼저 파싱해줘야합니다.

```js
// list.html의 목차 부모 태그 찾기
const listElements = document.querySelector(".toc-page .toc-content .toc-list");

const tocList = Object.values(pageNumberMap); // 각 .page-number 요소에 순서대로 페이지 번호 삽입

tocList.forEach((list, index) => {
  listElements.innerHTML += `
      <li class="toc-item ${list.tocLevelStyle}">
		  <span class="number">${list.title.split(" ")[0]}</span>
		  <span class="text">${list.title.split(" ").splice(1).join(" ")}</span>
		  ${
        list.currentPage !== ""
          ? `  <span class="dots"></span>
		  <span class="page-number  ${list.pageNumberStyle}">${list.currentPage}</span>`
          : ""
      }
	  </li>
    `;
});
```

목차의 부모태그를 찾아주고, 사이드바의 링크 개수 만큼 순회를 해주며 목차 컨텐츠를 추가해주겠습니다.

```js
// 수정된 HTML 가져오기
listHtmlContent = dom.serialize();
```

그 다음으로, 정적 html 파일을 읽었던 변수 `listHtmlContent` 를 바뀐 컨텐츠로 오버라이드 해주겠습니다.

```js
// 수정된 목차 HTML 저장
const modifiedListHtmlPath = path.join(__dirname, "modified-list.html");

fs.writeFileSync(modifiedListHtmlPath, listHtmlContent);
```

저장될 파일의 경로와 파일명을 세팅해주고 임시 파일을 생성합니다.

```js
// 수정된 목차 HTML을 PDF로 변환
const listPage = await browser.newPage();
const listFileUrl = `file://${modifiedListHtmlPath}`;
await listPage.goto(listFileUrl, {
  waitUntil: "networkidle0",
  timeout: 30000,
});

const frontPdfPath = path.join(pdfDir, "front.pdf"); // 목차 PDF 생성 (표지 포함)

await listPage.pdf({
  path: frontPdfPath,
  format: "A4",
  printBackground: true,
  margin: {
    left: "40px",
    right: "40px",
    top: "20px",
    bottom: "20px",
  },
});
```

마지막으로 수정된 임시 html 파일 `modified-list.html` 에 접근하여 `커버 + 목차` 인 `front.pdf` 를 생성합니다.

<br>

##### 메인 컨텐츠 `PDF` 변환하기

커버와 목차 페이지 변환은 끝났습니다.

이제 메인 컨텐츠의 `PDF` 변환이 남았습니다.

```js
const mainPdfPath = path.join(pdfDir, "main.pdf");

const mainPage = await browser.newPage();

await mainPage.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>

          ${vitePressStyles}

          .page-content {
            page-break-after: always;
            padding-bottom: 30px;
            min-height: 100px;
          }

          /* 마지막 페이지는 page-break 제거 */
          .page-content:last-child {
            page-break-after: auto;
          }

          h1 {
            page-break-after: avoid;
            page-break-inside: avoid;
            margin-top: 1em;
          }

          p {
            orphans: 3;
            widows: 3;
          }
        </style>
      </head>
      <body>${contentString}</body>
    </html>
  `);

await mainPage.pdf({
  path: mainPdfPath,
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: `<div></div>`,
  footerTemplate: `
      <div style="width: 100%; font-size: 11px; text-align: center; padding: 10px 0;">
        <span class="pageNumber"></span>
      </div>
    `,
  margin: {
    top: "40px",
    bottom: "70px",
    left: "50px",
    right: "50px",
  },
  preferCSSPageSize: true,
});

await browser.close();
```

이전에 각 페이지를 순회하며 목차를 정리하는 동시에 `contentString` 변수에 컨텐츠들도 쌓아놓은 상태입니다.

`PDF` 바이너리를 생성하는 방식은 커버 + 목차페이지인 `front.pdf` 생성 방법과 동일합니다. `main.pdf` 라는 파일로 생성해주겠습니다.

<br>

##### `front.pdf` + `main.pdf` 병합하기

매뉴얼을 목차와 메인 컨텐츠 `PDF` 를 따로 전달할 순 없으니,

이제 두 개의 `PDF`를 합치는 일만 남았습니다.

```js
const outputPdfPath = path.join(pdfDir, "eCrossV5_ClientStub매뉴얼.pdf");

await mergePDFs(frontPdfPath, mainPdfPath, outputPdfPath);
```

최종 `PDF`가 저장될 경로 `pdfDir` 과 파일명을 생성합니다.

그리고` mergePDFs` 라는 함수에, 변환 중 생성한 임시 PDF 경로도 포함하여 최종적으로 병합한 PDF 파일이 저장될 경로, 총 3개의 인자를 넘겨주겠습니다.

<br>

###### mergePDFS

`pdf-lib` 에서 제공하는 `PDFDocument` class의 메서드를 활용합니다.

`create` 메서드로 `PDF` 페이지를 하나 생성하여 `mergePdf` 변수에 할당해주겠습니다.

```js
const mergePDFs = async (frontPath, mainPath, outputPath) => {
  const mergedPdf = await PDFDocument.create();

 //...
```

전달받은 파일 경로 인자로 `front.pdf`와 `main.pdf` 파일을 불러와 `PDF` 페이지로 로드합니다.

```js
//...
const frontPdfBytes = fs.readFileSync(frontPath);
const mainPdfBytes = fs.readFileSync(mainPath);

const frontPdf = await PDFDocument.load(frontPdfBytes);
const mainPdf = await PDFDocument.load(mainPdfBytes); //...
```

로드한 두 개의 `PDF` 파일을 순회하여 `mergePdf` 에 모두 `copy`해주고 저장 후, `fs` 모듈을 이용해 파일을 만들어주겠습니다.

```js
//...
	const frontPages = await mergedPdf.copyPages(frontPdf, frontPdf.getPageIndices());
	const mainPages = await mergedPdf.copyPages(mainPdf, mainPdf.getPageIndices());

	frontPages.forEach((page) => mergedPdf.addPage(page));
	mainPages.forEach((page) => mergedPdf.addPage(page));

	const mergedPdfBytes = await mergedPdf.save();

	fs.writeFileSync(outputPath, mergedPdfBytes);
}
```

## 📌 완성

<LightBoxImg src="/images/export_pdf_result.png" />

<br>

`PDF` 파일이 정상적으로 생성된 모습입니다 :smile:

<br>

아래는 생성된 `PDF` 파일입니다

<iframe src="../pdf_file/eCrossV5_ClientStub매뉴얼.pdf" width="100%" height="800px"></iframe>
