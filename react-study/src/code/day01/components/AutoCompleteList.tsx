import type { User } from "../types";

export default function AutoCompleteList({ autoCompleteList }: { autoCompleteList: User[] }) {
  return (
    <>
      {
        autoCompleteList.length === 0 ?
          null :
          <div className="absolute z-50 bg-white w-80 p-2">
            {autoCompleteList.map((user) => {
              return (
                <p key={user.id} className="p-1 hover:bg-gray-100">{user.name}</p>)
            })}
          </div>
      }
    </>
  );
}