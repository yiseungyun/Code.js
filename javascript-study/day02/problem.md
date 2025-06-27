## ✅ 최근 접속자 표시 줄 만들기
- 서비스에 로그인한 사용자 중, 홈 화면 상단에 "최근 접속한 친구 목록"을 간단히 보여주는 UI를 만들어야 한다.
- 백엔드에서 제공하는 데이터는 다음과 같다.

```javascript
const users = [
  { name: 'Alice', lastLogin: '2024-12-01T10:00:00Z' },
  { name: 'Bob', lastLogin: '2025-06-25T08:00:00Z' },
  { name: 'Charlie', lastLogin: '2025-06-24T23:59:00Z' },
  { name: 'Daisy', lastLogin: '2025-06-26T00:01:00Z' },
  { name: 'Eve', lastLogin: '2025-06-20T18:00:00Z' },
];
```

### 🎯 요구 사항
- 현재 시각을 기준으로 최근 24시간 이내에 접속한 사용자만 추려야 한다.
  - new Date() 기준으로 lastLogin이 24시간 이내인 유저만 추려야 한다.
- 필터링된 사용자 목록을, 접속 시각이 최신 순(내림차순)으로 정렬해 출력해야 한다.
- 최종 출력 형식은 다음과 같다.

```javascript
[
  'Daisy (2025-06-26 00:01)',
  'Bob (2025-06-25 08:00)',
  'Charlie (2025-06-24 23:59)'
]
```
- 출력 시각은 "YYYY-MM-DD HH:mm" 형식으로 가공해서 보여줘야 한다.

### 구현해야하는 함수

```javascript
function getRecentUsers(users) { 

}
```

---

## 📝 문제 풀이
