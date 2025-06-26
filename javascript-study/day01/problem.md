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

