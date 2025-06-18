import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import SearchList from "./components/SearchList";
import type { User } from "./types";
import useDebounce from "./useDebounce";

export default function Day01() {
  const [searchTerm, setSearchTerm] = useState("");
  const [commitedSearchTerm, setCommittedSearchTerm] = useState("");
  const [autoCompleteList, setAutoCompleteList] = useState<User[]>([]);
  const [searchList, setSearchList] = useState<User[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm === "") {
      setAutoCompleteList([]);
      return;
    }

    fetch(`/api/users?search=${encodeURIComponent(debouncedSearchTerm)}&sort=name&order=asc`)
      .then(res => res.json())
      .then(data => setAutoCompleteList(data));
  }, [debouncedSearchTerm]);

  function handleAutoComplete(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      const finalSearchTerm = event.currentTarget.value;
      if (finalSearchTerm) {
        fetch(`/api/users?search=${encodeURIComponent(finalSearchTerm)}&sort=name&order=asc`)
          .then(res => res.json())
          .then(data => setSearchList(data));
      }

      setCommittedSearchTerm(finalSearchTerm);
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
        commitedSearchTerm={commitedSearchTerm}
        searchList={searchList}
      />
    </>
  )
}