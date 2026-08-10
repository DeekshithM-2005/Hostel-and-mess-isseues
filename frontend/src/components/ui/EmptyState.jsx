import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'No data found', message, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
      <div className="p-4 rounded-2xl bg-surface-500/20 mb-4">
        <Icon size={40} className="text-surface-300" />
      </div>
      <h3 className="text-lg font-semibold text-heading mb-1">{title}</h3>
      {message && (
        <p className="text-sm text-muted max-w-sm text-center">{message}</p>
      )}
      {action && (
        <div className="mt-4">{action}</div>
      )}
    </div>
  );
}
