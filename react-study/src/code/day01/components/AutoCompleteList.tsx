import type { User } from "../types";

export default function AutoCompleteList({ autoCompleteList }: { autoCompleteList: User[] }) {
  return (
    <ul>
      {autoCompleteList.map((user) => {
        return (
          <li key={user.id}>{user.name}</li>)
      })}
    </ul>
  );
}