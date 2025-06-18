import { highlightMatch } from "../highlightMatch";
import type { User } from "../types";

export default function SearchList({ searchList, commitedSearchTerm }: {
  searchList: User[],
  commitedSearchTerm: string
}) {
  return (
    <div className="p-2 mt-2">
      <p className="text-lg">검색 결과</p>
      {searchList.map((user) => {
        const { start, end } = highlightMatch(commitedSearchTerm, user.name);
        return (
          <div key={user.id} className="p-1">
            <p>{user.name.slice(0, start)}<mark className="bg-red-100">{user.name.slice(start, end)}</mark>{user.name.slice(end)}</p>
            <p>{user.email}</p>
            <p>{user.registeredAt}</p>
          </div>
        )
      })}
    </div>
  )
}