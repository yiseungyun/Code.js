export function highlightMatch(searchTerm: string, result: string) {
  let startIndex = result.indexOf(searchTerm);
  let length = searchTerm.length;
  if (startIndex === -1) {
    startIndex = result.indexOf(searchTerm.slice(0, -1));
    length = searchTerm.length - 1;
  }

  return { start: startIndex, end: startIndex + length };
}