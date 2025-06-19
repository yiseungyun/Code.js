## 📝 문제 해결

### ☑️ 요구사항
- /api/users에서 유저 리스트를 가져온다.
- 검색창에 이름을 입력하면, 해당 이름이 포함된 유저만 리스트에 나타난다.
- 유저 리스트는 아래와 같은 정보로 구성된다.
  - 이름
  - 이메일
  - 등록일 (YYYY-MM-DD)
- 리스트는 이름 오름차순으로 정렬되어 있어야 한다.
- 검색 키워드와 일치하는 텍스트는 하이라이팅 처리되어야 한다.

### 🎈 추가 요구사항
- 검색어 디바운싱(300ms)을 추가한다.
- 에러 발생 시 사용자에게 메시지를 출력해준다.

### 1. /api/users에서 유저리스트 가져오기
- MSW 설치 및 사용 방법 학습하기
- MSW 사용으로 Mock API 사용하기

리스트는 이름 오름차순으로 정렬되어있어야 하는데, MSW는 쿼리 파라미터 요청도 쉽게 처리할 수 있고 fetch 요청도 가능하기 때문에 MSW를 선택했다.

### 2. 검색창 입력 시 유저 리스트 보여주기
리스트를 오름차순으로 가져오는 것은 구현할 수 있지만 검색어와 일치하는 유저를 보여주는 것을 어떻게 구현할지 고민되었다.

- 소규모 데이터라면 클라이언트가 모든 데이터를 받아온 후 필터링할 수 있다.
- 대규모 데이터라면 클라이언트가 모든 데이터를 받아와 필터링하는 것은 비효율적이고 느리다.

만든 데이터는 몇개 안되기 때문에 클라이언트 필터링이 더 적합하지만, 대규모라 가정하고 구현할 생각이기 때문에 검색창에 입력하는 검색어를 포함한 값만 API로 요청해서 구현하기로 했다.

- 검색창에 입력하는 중
  - 일치하는 유저를 최대 5개 보여준다.
  - 디바운싱을 통해 300ms마다 요청을 보낸다.
- 검색창에 입력을 완료하면
  - 일치하는 모든 유저 정보를 보여준다.

**1. 검색 중 데이터를 찾을 때 발생하는 문제**

영어를 검색할 때는 관계 없지만, 한글로 된 데이터는 ㅇ을 검색하게 되면 이름에 ㅇ이 들어가도 찾아주지 못하는 문제가 있다.

> Hangul-js를 사용해서 한글 검색어를 모두 분리했다. 예를 들어 검색어는 `안녀`이고 데이터가 `안녕하세요`가 있다면 해당 라이브러리는 `안녀`라는 검색어를 `ㅇㅏㄴㄴㅕ`로 분리한다. 그리고 `안녕하세요` 데이터도 `ㅇㅏㄴㄴㅕㅇㅎㅏㅅㅔㅇㅛ`로 분리되기 때문에 입력 중이던 글자로도 데이터를 찾을 수 있게 된다.

**2. 아무것도 입력하지 않았을 때**

아무것도 입력하지 않고 검색했을 때 모든 사용자를 보여주는 것이 맞다고 생각했다. 그러나 검색 중에 자동완성으로 보여주는 것은 모든 데이터를 보여주는(다는 아니라도 상위 몇개만 잘라서 보여주는) 것이 맞을지 고민되었다.

> 실제 서비스들을 살펴본 결과 인기 검색어를 보여주는 방식이지, 데이터를 일부 잘라서 보여주는 방식은 아니었다. 그런데 사용자를 검색하는 것이고 검색량을 저장하는 기능은 없기 때문에 아무것도 입력되지 않을 때 자동 완성 기능은 동작하지 않도록 결정했다.

### 3. 컴포넌트 설계 수정하기
index.tsx에 다음과 같이 컴포넌트가 존재한다.
```
<검색 창/>
<검색 결과/>
```
- `검색 창` 컴포넌트는 사용자의 검색어를 확인하고 입력 중 자동 완성 기능을 제공한다.
  - 검색 창 컴포넌트 내부는 검색어를 입력 받는 input과 자동 완성 리스트를 보여주는 컴포넌트로 이루어져있다.
  - fetch를 통해 자동 완성을 제공하기 위해 입력 중 단어에 대해 get 요청을 보내 데이터를 가져온다.
- `검색 결과` 컴포넌트는 사용자가 검색어를 입력하고 엔터 키를 눌렸을 때 결과를 보여준다.
  - fetch를 통해 검색한 결과에 대한 데이터를 받아와 보여줘야한다.

**해당 설계에서 아쉬운 점**
- `검색 창`에서 엔터 키를 눌렀을 때 이벤트 처리를 하게 된다.
- 그렇다면 검색 결과를 보여주기 위해 검색 창에서 데이터를 받아와 저장한 것을 검색 결과가 사용할 수 있게 해야한다.

**개선할 수 있는 방법**

상태를 부모 컴포넌트에서 관리한다.
- 부모 컴포넌트가 검색하고 있는 검색어의 상태와 검색할 최종 검색어를 관리한다.
- 검색 창과 검색 결과 컴포넌트에 props로 전달한다.

### 4. 디바운싱 적용하기
> 디바운싱은 여러 이벤트가 발생할 때 마지막 이벤트만 처리하도록 하는 것이다.

디바운싱은 300ms로 설정하기 때문에 사용자가 마지막 행동을 하고 300ms가 지나는 동안 다른 행동이 없다면 검색어에 대한 요청을 보낸다.

**useDebounce 훅**
```ts
export default function useDebounce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

- 값과 디바운싱 적용할 시간을 delay로 전달한다.
- 컴포넌트에서 useDebounce 훅을 호출하고 value는 사용자가 입력하는 검색어, delay는 300으로 전달한다.
- 만약 사용자가 검색어를 입력하는 중이라면 검색어인 value 값은 계속 바뀌며 전달된다.
  - useDebounce 훅은 value 값이 변경되면 기존 타이머는 제거하고 타이머를 다시 설정하고 debouncedValue 값을 전달한 delay 시간 후 변경한다.
  - 특정 사용자가 처음 a를 입력하게 되면, 0.3초가 지나기 전까지는 debouncedValue 값을 수정하지 않는 것이다.

```tsx
const debouncedSearchTerm = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearchTerm === "") {
    setAutoCompleteList([]);
    return;
  }

  fetch(`/api/users?search=${encodeURIComponent(debouncedSearchTerm)}&sort=name&order=asc`)
    .then(res => res.json())
    .then(data => setAutoCompleteList(data));
}, [debouncedSearchTerm]);

function handleAutoComplete(event: React.ChangeEvent<HTMLInputElement>) {
  setSearchTerm(event.target.value);
}
```

- `debouncedSearchTerm`은 useDebounce 훅에서 반환하는 값이다.
  - 해당 값은 사용자가 처음 입력한 후 0.3초 간 변경되지 않지만, 새로운 값을 입력하면 0.3초 뒤 그 값으로 변경된다.
- `useEffect`에서 `debouncedSearchTerm`가 변경되면 fetch 문을 실행한다. 
  - 0.3초 뒤 새로운 값으로 변경되면 그 값에 대해 다시 검색을 하게 된다.

### 5. 검색어와 일치하는 문자 하이라이팅 
- 사용자가 입력한 검색어와 일치하는 데이터를 찾아 자동완성으로 보여주거나 결과로 보여주게 된다.
- 해당 결과 목록을 순회하며 사용자의 검색어와 일치하는 부분을 찾아 하이라이팅 처리를 한다.

영어라면 일치하는 위치를 정확히 찾을 수 있는데, 한글의 경우 어떻게 처리해야할지 고민이 있었다.
- 현재 한글의 초성, 중성이 동일한 부분이 있다면 해당 데이터도 보여줄 수 있게 했다.
- 하이라이팅 처리는 초성, 중성이 동일한 부분이라도 초성, 중성, 종성이 모두 일치하는 부분에만 처리해준다.

만약 `안녀`라고 검색하고 있고 자동완성으로 보여지는 데이터가 `안녕하세요`라면 `안`만 완전히 일치하기 때문에 `안`에만 하이라이팅 처리를 해준다.

매칭되는 함수를 구현해야했기 때문에 함수 처리를 어떻게 할지 정리했다.

- 사용자가 입력한 검색어와 검색 결과 데이터를 비교해야한다.
- 이때 indexOf를 통해 데이터에서 사용자의 검색어가 어디에 위치하는지 찾는다.
- 만약 -1이라면 안녕하세요 데이터에서 안녀와 같이 검색 중 단어를 입력했기 때문이다.
- 그렇다면 -1이 나올 때는 뒤 글자를 하나 삭제해서 indexOf를 적용한다.
- 이와 같은 방식으로 시작 인덱스와 끝 인덱스를 리턴한다.

> 검색 결과는 엔터 키를 누르면 나타난다. 이때 하이라이팅은 사용자가 입력한 검색어와 일치하는 부분에 표시된다. 그러나 사용자가 검색창에 다시 입력하게 되면 검색어는 변경된다. 이에 따라 검색 결과에 나타난 하이라이팅 처리도 다시 검색한 것이 아닌데 실시간으로 변경되는 문제가 있었다.

- 해당 문제를 해결하기 위해 commitedSearchTerm 변수를 관리해서, 최종적으로 엔터를 눌렸을 때 최종 검색어와 검색 결과만을 비교하여 하이라이팅 처리를 하도록 했다.
- 검색 결과와 엔터를 눌렀을 때의 검색창의 최종 검색어를 비교해 하이라이팅 처리를 한다.

### 6. 검색어 자동완성 컴포넌트는 검색 결과 위에 표시하기
```
<검색창/>
<검색어를 입력하면 보여지는 자동완성/>
<검색 결과/>
```

위와 같이 구성되어있다.
- 자동완성 컴포넌트는 검색어를 입력하는 도중 변경되기 때문에 해당 컴포넌트 크기는 계속 변경된다.
- 검색 결과 컴포넌트도 이에 따라 위로 갔다 아래로 이동하게 된다.

> 검색어 자동완성 컴포넌트는 검색 도중에 검색 창 아래 보이게 하되, 검색 결과 위에 보이게 한다.

- 자동완성 컴포넌트는 다른 컴포넌트보다 항상 위에 보이게 한다.
- 검색창 바로 아래 위치하게 한다.

부모 컴포넌트에 relative로 설정하고, 자동완성 컴포넌트에는 absolute 설정을 한 뒤 z-index 값을 크게 줘서 z축 상에서 상위에 위치하게 했다.

**자동완성에서 하나를 클릭할 때**
> 자동완성 리스트를 보여줄 때 하나를 클릭하면 해당 검색어로 검색되게 구현한다.

- 리스트를 버튼으로 구현하고, 클릭 이벤트 함수는 fetch를 보내도록 구현했다.
- 검색창은 검색 중이던 검색어가 입력되어있지만, 자동완성 리스트 중 하나를 누르면 해당 값으로 검색창이 채워지도록 했다.

### 7. 에러 메시지 표시하기

---

## 🛜 MSW
> `MSW(Mock Service Worker)`는 가짜 API를 만들어 fetch 요청을 가로채서 응답을 반환해주는 라이브러리다.

**설치**

``` bash
npm install msw@1
```
최신 버전은 CommonJS 형식으로 작성해줘야하기 때문에 이전 버전으로 설치했다.

### 왜 필요할까?
- 백엔드가 없을 때도 개발을 가능하게 한다.
- 테스트 시 서버 없이도 시나리오 재현이 가능하다.
- fetch, axios 등 실제 네트워크 요청을 쓰듯이 코드 작성이 가능하다.

### handler와 browser

**handler**: 어떤 요청을 가로챌지 정의
```ts
rest.get("/api/users", (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json([
      반환할 데이터
    ])
  )
})
```

**browser**: 요청을 가로채는 가짜 서버 실행 설정
```ts
export const worker = setupWorker(...handlers);
```

- setupWorker: 브라우저에서 동작하는 가짜 서비스 워커를 설정한다.
- 내부적으로 Service Worker API를 이용해 브라우저 레벨에서 fetch 요청을 가로챈다.

```tsx
if (import.meta.env.DEV) {
  const { worker } = await import('./browser.ts');
  await worker.start();
}
```

- 앱의 진입 점에 해당 코드를 작성해준다.
- 개발 모드에서 서비스 워커를 실행하는 코드이다.

### MSW에서 다양한 쿼리 파라미터에 대한 응답 처리
> 요청에서 쿼리 파라미터를 읽어 정렬해줄 수 있다.

클라이언트가 다음과 같이 요청을 보낸다.

```bash
GET /api/users?sort=name&order=asc
```

유저 정보를 이름 순으로 오름차순 정렬로 가져온다.

```ts
rest.get("/api/users", (req, res, ctx) => {
  const sort = req.url.searchParams.get("sort");
  const order = req.url.searchParams.get("order");

  const sortedUsers = [...mockUsers].sort((a, b) => {
    if (sort === "name") {
      return order === "desc"
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    }
    return 0;
  });

  return res(ctx.status(200), ctx.json(sortedUsers));
});
```

### 다른 도구와의 차이

1. fetch 없이 직접 mock 데이터를 사용하는 경우
- fetch를 사용하지 않기 때문에 이후 API 서버가 개발되고 나면 코드 수정을 해야한다.
- 빠르게 화면을 그릴 수 있다는 장점이 있지지만, 로딩/에러 처리 등 비동기 흐름을 테스트하기 어렵다.

2. lowdb
- 네트워크 레벨에서 요청을 가로채는 것이 불가능하다.
- API 서버가 아니기 때문에 fetch 요청은 직접 서버 코드를 작성해야 사용 가능하다.
- 클라이언트와 바로 연결은 어렵고 Express 등과 함께 사용해야 유용하다.

3. json-server
- fetch 요청을 통해 실제 API 요청과 같이 작성할 수 있다.
- 복잡한 조건 로직 구현이 어려워, 조건부 필터와 같은 요청은 할 수 없다.
- 테스트할 때마다 서버를 띄워야한다.

**MSW**
- fetch, axios 그대로 사용 가능하기 때문에, API 교체 시 코드 수정이 없다.
- 조건부 응답 로직을 사용할 수 있다.
- 로딩, 에러, 타임아웃 등 다양한 상황을 시뮬레이션 가능하다.
- 클라이언트 코드에 가짜 서버를 붙이는 것처럼 작동한다.

## ⏰ 디바운싱(Debouncing)
> 짧은 시간 내에 연속적으로 발생하는 이벤트가 있을 때, 마지막 이벤트만 처리하도록 지연시키는 방식으로 불필요한 요청을 줄이는데 사용한다.

**코드 예시**

```tsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebouced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

```tsx
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  if (!debouncedSearch) return;
  fetch(`/api/users?search=${debouncedSearch}`)
    .then(res => res.json())
    .then(setUsers);
}, [debouncedSearch]);
```

- useDebounce 훅은 search 값이 바뀔 때마다 300ms동안 아무 입력이 없을 때만 debouncedSearch 값을 갱신한다.
- 사용자가 타이핑을 멈춘 후 300ms가 지나야 실제 API 요청을 위한 값이 변경된다.

> 디바운싱과 달리 스로틀링은 일정 주기마다 실행하는 것으로, 스크롤이나 리사이즈 이벤트가 발생할 때 사용한다.
