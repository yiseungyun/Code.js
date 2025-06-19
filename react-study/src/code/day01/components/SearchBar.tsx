export default function SearchBar({ value, onChange, onKeyDown }: {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}) {

  return (
    <input
      className="w-80 p-2 border border-gray-300 rounded"
      type="text"
      value={value}
      placeholder="검색어를 입력하세요."
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
}