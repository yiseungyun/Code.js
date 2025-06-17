import type { User } from "../types";

export default function SearchList({ searchList }: { searchList: User[] }) {
  return (
    <>
      <p>검색 결과</p>
      {searchList.map((user) => {
        return (
          <div key={user.id}>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>{user.registeredAt}</p>
          </div>
        )
      })}
    </>
  )
}