export function SearchWithFilters({ searchValue, onSearchChange, placeholder }: any) {
  return (
    <input
      type="text"
      value={searchValue}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder={placeholder}
      className="search-input"
    />
  );
}
