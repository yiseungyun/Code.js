## ✅ 필터가 적용된 검색 결과 목록 만들기

- 검색 결과 리스트를 보여주는 페이지를 개발하고 있다.
- 검색 결과는 다음과 같은 구조로 제공된다.

```javascript
const items = [
  { id: 1, name: '맥북 에어 M2', category: '노트북', isSoldOut: false },
  { id: 2, name: '아이패드 프로', category: '태블릿', isSoldOut: true },
  { id: 3, name: '갤럭시 탭 S8', category: '태블릿', isSoldOut: false },
  { id: 4, name: 'LG그램 17', category: '노트북', isSoldOut: true },
  { id: 5, name: '서피스 랩탑', category: '노트북', isSoldOut: false },
];
```

- 화면 상단에는 필터 UI가 있다.
  - `카테고리 선택`: 전체/노트북/태블릿
  - `품절 상품 숨기기`: true/false

이 두 필터를 기반으로 최종 렌더링할 상품 목록을 만들어야 한다.

### 🎯 요구 사항
- 주어진 items 배열과 필터 조건을 바탕으로 최종 렌더링할 배열을 반환하는 함수를 작성한다.
- 필터 조건은 다음 형식의 객체로 주어진다.

```javascript
const filters = {
  category: '노트북', 
  hideSoldOut: true, // true면 품절 상품 숨김
};
```
- 반환값은 필터를 모두 반영한 items 배열이어야 한다.
- 정렬은 원래 순서를 그대로 유지한다.

### 예시

```javascript
getFilteredItems(items, {
  category: '노트북',
  hideSoldOut: true,
})
```
```
[
  { id: 1, name: '맥북 에어 M2', category: '노트북', isSoldOut: false },
  { id: 5, name: '서피스 랩탑', category: '노트북', isSoldOut: false },
]
```

---

## 📝 문제 풀이

```javascript
function getFilteredItems(items, filters) {
  return items.filter(
    (item) =>
      (filters.category === '전체' || item.category === filters.category) &&
      (!filters.hideSoldOut || !item.isSoldOut)
  );
};
```
- getFilteredItems 함수는 items 데이터와 사용자가 선택한 필터 옵션인 filters를 매개변수로 받는다.
- filter를 호출해서 조건에 맞는 item을 선택한다.
  - 사용자가 선택한 카테고리가 전체이거나 혹은 특정 카테고리라면, 전체라면 모든 아이템은 선택되어도 되고 아니라면 정해진 카테고리와 일치하는지 확인한다.
  - 필터에서 hideSoldOut이 true면 품절 상품을 숨기는 것이므로, hideSoldOut이 false라면 모든 아이템을 보여주고 만약 true라면 item이 품절된 것은 보여주지 않도록 한다.

위와 같이 filter 메서드를 통해 간단하게 사용자가 선택한 아이템을 보여줄 수 있다.

### 읽기 쉽고 수정하기 좋은가?

읽기 쉽고 수정하기 좋은지에 대해 생각해보면 애매하다.

- 위에 필터를 어떤 조건으로 하는지 정리해두지 않으면, 다시 읽을 때 하나씩 다시 해석해야한다.
- 필터 조건이 추가되게 되면 저기서 다시 또 한번 추가하면서 문제가 생기게 되면 어느 조건에서 문제가 생기는지 정확히 파악하기 어려운 패턴이다.

### 읽기 쉽고 수정하기 좋은 구조

읽기 쉽고 수정하기 좋은 구조는 무엇인지 고민했다.

1. 코드를 읽었을 때 어떤 역할인지 명확하게 작성한다.
2. 하나의 조건으로 처리하는게 아닌 각 조건마다 하나씩 검증한다.
  - 수정, 삭제할 때 해당하는 조건만 보면 된다.
  - 문제가 생길 때 명확하게 어떤 조건이 문제가 되는지 파악할 수 있다.

위 정리를 바탕으로 getFilteredItems 함수 내부에서 사용자가 설정한 필터가 여러 개일 때, 각 조건에 맞춰 하나씩 필터링하는 로직을 적용하기로 했다.

```javascript
function getFilteredItems(items, filters) {
  let result = [...items];

  // 카테고리 선택이 전체가 아니라면, 선택한 카테고리인 filters.category와 일치하는 아이템을 필터링한다.
  if (filters.category !== '전체') {
    result = result.filter((item) => item.category === filters.category);
  }

  // 품절된 상품을 보지 않도록 적용했다면, !item.isSoldOut를 통해 품절되지 않은 아이템만을 필터링한다.
  if (filters.hideSoldOut) {
    result = result.filter((item) => !item.isSoldOut);
  }

  // 필터링으로 남은 아이템만을 반환한다.
  return result;
}
```

- 위 구조는 아이템 카테고리, 품절 여부 조건을 각각 검사한다.
- 조건이 추가되면 새로운 조건문을 통해 검사한다.
- 이를 통해 특정 조건을 잘못 작성했을 때 문제를 더 빠르게 찾을 수 있으며, 조건마다 명확히 무엇을 하는지 파악하기 쉽다.