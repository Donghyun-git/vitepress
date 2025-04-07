# 컨텐츠 구성 및 작성 방법


## 📌 컨텐츠 구성하기


각 경로는 `디렉토리명` 으로 맵핑됩니다.  하위에 `index.md` 파일이 반드시 존재해야 합니다.

예를 들어 `/start/run/finish/` 라는 경로가 있다고 가정해보겠습니다.

그러면 디렉토리 구조는 같이 구성되어야 합니다.

```markdown
📂 docs  # srcDir
 ┣ 📂 start
 ┃ ┣ 📂 run 
 ┃ ┃ ┣ 📂 finish 
 ┃ ┃ ┃  ┗ 📄 index.md # 이 파일이 해당 경로의 문서로 보여집니다.  
```


:::warning
만약 해당 디렉토리 경로에 `index.md` 파일이 존재하지 않는다면 `not Found 404` 페이지가 노출됩니다.
:::
## 📌 마크다운 기본 문법

`VitePress`는 마크다운을 기반으로 컨텐츠를 작성합니다. 기본적인 마크다운 문법을 알아보겠습니다.

### 제목

```markdown
# h1 제목

## h2 제목

### h3 제목

#### h4 제목

##### h5 제목

###### h6 제목
```

### 텍스트 스타일링

```markdown
_이탤릭체_
**볼드체**
~~취소선~~
```

기본 글씨

_이탤릭체_ 

**볼드체**

~~취소선~~


### 목록 ( 리스트 )

```markdown
# 순서 없는 목록

- 항목 1
- 항목 2
  - 중첩 항목 2.1
  - 중첩 항목 2.2

# 순서 있는 목록

1. 첫 번째 항목
2. 두 번째 항목
   1. 중첩 항목 2.1
   2. 중첩 항목 2.2
```

### 링크 및 이미지

```markdown
[링크 텍스트](https://example.com)
![이미지 대체 텍스트](/images/example.png)
```

위는 `<a>` 와 `<img>` 태그로도 대체 가능합니다.

```html
<a href="/link">링크</a>

<img src="/images/example.png" />
```

### Table


```markdwon
| 헤더 | 헤더 | 헤더 | 헤더 |
| :--- | :---: | :--- | ---: |
| 좌측정렬 | 가운데정렬 | 좌측정렬 | 우측정렬 |
```

| 헤더 | 헤더 | 헤더 | 헤더 |
| :--- | :---: | :--- | ---: |
| 좌측정렬 | 가운데정렬 | 좌측정렬 | 우측정렬 |

`HTML`태그로도 사용 가능합니다.

```html
<div style="padding: 4px; border: 1px solid #dedede;">
<table>
  <thead>
    <tr>
      <th style="text-align: left">헤더</th>
      <th style="text-align: center">헤더</th>
      <th style="text-align: left">헤더</th>
      <th style="text-align: right">헤더</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: left">좌측정렬</td>
      <td style="text-align: center">가운데정렬</td>
      <td style="text-align: left">좌측정렬</td>
      <td style="text-align: right">우측정렬</td>
    </tr>
  </tbody>
</table>
</div>

```

<div style="padding: 4px; border: 1px solid #dedede;">
<table>
  <thead>
    <tr>
      <th style="text-align: left">헤더</th>
      <th style="text-align: center">헤더</th>
      <th style="text-align: left">헤더</th>
      <th style="text-align: right">헤더</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align: left">좌측정렬</td>
      <td style="text-align: center">가운데정렬</td>
      <td style="text-align: left">좌측정렬</td>
      <td style="text-align: right">우측정렬</td>
    </tr>
  </tbody>
</table>
</div>

:::tip
css를 인라인으로 삽입할 수 있어 개인적으로 태그를 선호합니다.
:::

### 코드 블록

````markdown
```javascript
function hello() {
  console.log("Hello VitePress");
}
```
````


## 📌 VitePress 확장 마크다운 기능

`VitePress`는 기본 마크다운에 여러 확장 기능을 제공합니다.

<br>

### 코드 블록 확장 기능


#### 하이라이팅
````markdown
```js{4}
export default {
  data() {
    return {
      msg: 'Highlighted!' // 이 줄이 강조됩니다.
    }
  }
}
```
````

```js{4}
export default {
  data() {
    return {
      msg: 'Highlighted!' // 이 줄이 강조됩니다.
    }
  }
}
```

#### 포커스

````markdown
```js{4}
export default {
  data() {
    return {
      msg: 'focused!' // [!code focus]
    }
  }
}
```
````

```js{4}
export default {
  data() {
    return {
      msg: 'focused!' // [!code focus]
    }
  }
}
```

#### 코드 라인과 함께 출력

````markdown
```js:line-numbers {1}{4}
export default {
  data() {
    return {
      msg: 'code line'
    }
  }
}
```
````

```js:line-numbers {1}{4}
export default {
  data() {
    return {
      msg: 'code line'
    }
  }
}
```

#### 라인 효과

````markdown
```js:line-numbers {1}{4}
export default {
  data() {
    return {
      msg: '삭제됨' # [!code --] 
      msg: '추가됨' # [!code ++]
    }
  }
}
```
````

```js:line-numbers {1}{4}
export default {
  data() {
    return {
      msg: '삭제됨' // [!code --] 
      msg: '추가됨' // [!code ++]
    }
  }
}
```

````markdown
```js
export default {
  data() {
    return {
      msg: '경고', # [!code warning] 
      msg: '에러' # [!code error]
    }
  }
}
```
````

```js
export default {
  data() {
    return {
      msg: '경고', // [!code warning] 
      msg: '에러' // [!code error]
    }
  }
}
```


<br>

### Badge 컴포넌트

```markdown
<Badge type="info"text="정보" />
<Badge type="tip"text="팁" />
<Badge type="warning"text="경고" />
<Badge type="danger"text="위험" />
```

<Badge type="info"text="정보" />
<Badge type="tip"text="팁" />
<Badge type="warning"text="경고" />
<Badge type="danger"text="위험" />

<br>

<br>

### 사용자 정의 컨테이너

```markdown
::: info
정보 메시지를 표시합니다.
:::

::: tip
팁 메시지를 표시합니다.
:::

::: warning
경고 메시지를 표시합니다.
:::

::: danger
위험 메시지를 표시합니다.
:::

::: details
세부 정보(클릭하여 펼치기/접기)
:::
```

::: info
정보 메시지를 표시합니다.
:::

::: tip
팁 메시지를 표시합니다.
:::

::: warning
경고 메시지를 표시합니다.
:::

::: danger
위험 메시지를 표시합니다.
:::

::: details
세부 정보(클릭하여 펼치기/접기)
:::

<br>

### 이모지 지원

```markdown
:smile: :heart: :thumbsup:
```

:smile: :heart: :thumbsup: :dog: :cat: :dolphin:


---

<br>


기본적인 문법은 모두 알아보았습니다.

위에서 언급한 문법을 사용하여 문서를 작성하면 이런 구조가 나오게 됩니다.

```markdown
# 기존 매뉴얼 관리 방법

  

<br>

  

`Vitepress` 를 도입하기 이전에는 아래와 같은 방식으로 매뉴얼을 관리해왔습니다.

  

---

  

###  📌 워드 문서와 PDF 기반 매뉴얼

  

:::info

- **Microsoft Word나 한글 등으로 작성된 문서**

- **매뉴얼 관련 PDF 생성**

- **이메일이나 메신저로 생성한 `PDF` 공유**  

:::

%%....%%
```


## 📌 번외 ) Obsidian 활용하기

> [Obsidian](https://obsidian.md/)

`Notion` 과 같이 `markdown` 파일을 편하게 작성할 수 있게 하는 문서 작성 툴입니다.

`vitepress` 프로젝트는 소스코드 변경사항 저장 시, 변경사항이 바로 적용되는 `핫 리로딩`이 적용되고, `Obsidan`은 문서 작성 도중, 타이핑이 멈추면 자동저장 기능을 제공합니다.

<p>
<img src="/images/obsidian.png"/>
</p>

:::tip
매뉴얼의 docs 폴더를 보관함으로 설정하고 위와 같이 작업하면 편합니다. :smile:
:::



<br>

---


기본 작성에 필요한 기능 및 문법에 대해 설명드렸습니다.

다음으로 스타일 적용에 대해 알아보겠습니다.

