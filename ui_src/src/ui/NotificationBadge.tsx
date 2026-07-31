export function NotificationBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return <div className="notification-badge">{count}</div>;
}
