import type { User } from "../types";

export default function AutoCompleteList({ autoCompleteList, fetchSearchTerm }: {
  autoCompleteList: User[],
  fetchSearchTerm: (searchTerm: string) => void
}) {
  function handleClick(name: string) {
    fetchSearchTerm(name);
  }

  return (
    <div className="absolute z-50 bg-white w-80 p-2">
      {autoCompleteList.map((user) => {
        return (
          <button
            key={user.id}
            className="w-full text-left p-1 hover:bg-gray-100 block"
            onClick={() => handleClick(user.name)}
          >
            {user.name}
          </button>
        )
      })}
    </div>
  );
}