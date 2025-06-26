function getFilteredItems(items, filters) {
  let result = [...items];

  if (filters.category !== '전체') {
    result = result.filter((item) => item.category === filters.category);
  }

  if (filters.hideSoldOut) {
    result = result.filter((item) => !item.isSoldOut);
  }

  return result;
}