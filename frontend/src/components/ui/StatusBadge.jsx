const STATUS_CONFIG = {
  PENDING: { label: 'Pending', class: 'badge-warning', dot: '●' },
  IN_REVIEW: { label: 'In Review', class: 'badge-info', dot: '●' },
  IN_PROGRESS: { label: 'In Progress', class: 'badge-info', dot: '●' },
  RESOLVED: { label: 'Resolved', class: 'badge-success', dot: '●' },
  ESCALATED: { label: 'Escalated', class: 'badge-purple', dot: '●' },
  CRITICAL: { label: 'Critical', class: 'badge-critical', dot: '●' },
  LOW: { label: 'Low', class: 'badge-slate', dot: '●' },
  MEDIUM: { label: 'Medium', class: 'badge-warning', dot: '●' },
  HIGH: { label: 'High', class: 'badge-critical', dot: '●' },
  URGENT: { label: 'Urgent', class: 'badge-critical', dot: '🔴' },
};

export default function StatusBadge({ status, className = '' }) {
  const config = STATUS_CONFIG[status] || { label: status, class: 'badge-slate', dot: '●' };

  return (
    <span className={`badge ${config.class} ${className}`}>
      <span className="text-[0.5rem]">{config.dot}</span>
      {config.label}
    </span>
  );
}
