import { useState } from "react";
import AutoCompleteList from "./AutoCompleteList";
import type { User } from "../types";

export default function SearchBar() {
  const [autoList, setAutoList] = useState<string[]>([]);

  function handleAutoComplete(event: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = event.target.value;

    if (searchTerm === "") {
      setAutoList([]);
      return;
    }

    fetch(`/api/users?search=${encodeURIComponent(searchTerm)}&sort=name&order=asc`)
      .then(res => res.json())
      .then(data => {
        setAutoList(data.map((user: User) => user.name));
      });
  }

  return (
    <>
      <input
        type="text"
        placeholder="검색어를 입력하세요."
        onChange={handleAutoComplete}
      />
      <AutoCompleteList autoList={autoList} />
    </>
  );
}