import { useState } from "react";
import SearchBar from "./components/SearchBar";
import SearchList from "./components/SearchList";
import type { User } from "./types";

export default function Day01() {
  const [autoCompleteList, setAutoCompleteList] = useState<User[]>([]);
  const [searchList, setSearchList] = useState<User[]>([]);

  function handleAutoComplete(event: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = event.target.value;

    if (searchTerm === "") {
      setAutoCompleteList([]);
      return;
    }

    fetch(`/api/users?search=${encodeURIComponent(searchTerm)}&sort=name&order=asc`)
      .then(res => res.json())
      .then(data => setAutoCompleteList(data));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      const searchTerm = event.currentTarget.value;
      if (searchTerm) {
        fetch(`/api/users?search=${encodeURIComponent(searchTerm)}&sort=name&order=asc`)
          .then(res => res.json())
          .then(data => setSearchList(data));
      }
    }
  };

  return (
    <>
      <SearchBar
        autoCompleteList={autoCompleteList}
        onChange={handleAutoComplete}
        onKeyDown={handleKeyDown}
      />
      <SearchList
        searchList={searchList}
      />
    </>
  )
}