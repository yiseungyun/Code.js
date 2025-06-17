export default function AutoCompleteList({ autoList }: { autoList: string[] }) {
  return (
    <ul>
      {autoList.map((autoTerm) => <li>{autoTerm}</li>)}
    </ul>
  );
}