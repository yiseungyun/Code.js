import type { User } from "../types";
import AutoCompleteList from "./AutoCompleteList";

export default function SearchBar({ onChange, onKeyDown, autoCompleteList }: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  autoCompleteList: User[];
}) {

  return (
    <>
      <input
        type="text"
        placeholder="검색어를 입력하세요."
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <AutoCompleteList autoCompleteList={autoCompleteList} />
    </>
  );
}