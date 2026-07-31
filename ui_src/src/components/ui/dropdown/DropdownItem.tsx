export function DropdownItem({ children, onClick }: any) {
  return <div className="dropdown-item" onClick={onClick}>{children}</div>;
}
