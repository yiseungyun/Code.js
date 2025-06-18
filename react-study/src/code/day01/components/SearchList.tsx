import { highlightMatch } from "../highlightMatch";
import type { User } from "../types";

export default function SearchList({ searchList, commitedSearchTerm }: {
  searchList: User[],
  commitedSearchTerm: string
}) {
  return (
    <>
      <p>검색 결과</p>
      {searchList.map((user) => {
        const { start, end } = highlightMatch(commitedSearchTerm, user.name);

        return (
          <div key={user.id}>
            <p>{user.name.slice(0, start)}<mark>{user.name.slice(start, end)}</mark>{user.name.slice(end)}</p>
            <p>{user.email}</p>
            <p>{user.registeredAt}</p>
          </div>
        )
      })}
    </>
  )
}