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
