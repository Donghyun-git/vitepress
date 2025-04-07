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


<br>

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

목차 페이지에 들어갈 페이지 Number 를 계산해보겠습니다.

현재 팀 매뉴얼의 목차 페이지 요소 선택자에 아래와 같은 스타일을 적용 중입니다.

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
스타일은 변경하셔도 됩니다!
:::




















