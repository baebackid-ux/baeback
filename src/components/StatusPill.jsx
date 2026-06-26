export default function StatusPill({ children, status = 'neutral' }) {
  return <span className={`status-pill status-${status}`}>{children}</span>;
}
