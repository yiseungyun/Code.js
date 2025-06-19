import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import SearchList from "./components/SearchList";
import type { User } from "./types";
import useDebounce from "./useDebounce";
import AutoCompleteList from "./components/AutoCompleteList";

export default function Day01() {
  const [searchTerm, setSearchTerm] = useState("");
  const [commitedSearchTerm, setCommittedSearchTerm] = useState("");
  const [autoCompleteList, setAutoCompleteList] = useState<User[]>([]);
  const [searchList, setSearchList] = useState<User[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm === "" || debouncedSearchTerm === commitedSearchTerm) {
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
      if (finalSearchTerm !== "") {
        fetchSearchTerm(finalSearchTerm);
      }
    }
  };

  function fetchSearchTerm(searchTerm: string) {
    setSearchTerm(searchTerm);
    setAutoCompleteList([]);
    setCommittedSearchTerm(searchTerm);
    fetch(`/api/users?search=${encodeURIComponent(searchTerm)}&sort=name&order=asc`)
      .then(res => res.json())
      .then(data => setSearchList(data));
  }

  return (
    <div className="relative m-4">
      <SearchBar
        value={searchTerm}
        onChange={handleAutoComplete}
        onKeyDown={handleKeyDown}
      />
      {
        autoCompleteList.length > 0 ?
          <AutoCompleteList
            autoCompleteList={autoCompleteList}
            fetchSearchTerm={fetchSearchTerm}
          /> :
          null
      }
      <SearchList
        commitedSearchTerm={commitedSearchTerm}
        searchList={searchList}
      />
    </div>
  )
}