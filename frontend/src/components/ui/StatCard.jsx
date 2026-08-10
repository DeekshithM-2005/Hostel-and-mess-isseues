export default function StatCard({ icon: Icon, label, value, subtitle, trend, className = '' }) {
  return (
    <div className={`glass-card p-5 animate-slide-up ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-xl bg-primary-600/15">
          {Icon && <Icon size={22} className="text-primary-400" />}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            trend > 0 
              ? 'bg-green-500/15 text-green-400' 
              : 'bg-red-500/15 text-red-400'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-sub mb-1.5">
        {label}
      </p>
      <p className="text-3xl font-bold text-heading">
        {value}
      </p>
      {subtitle && (
        <p className="text-sm text-muted mt-1">{subtitle}</p>
      )}
    </div>
  );
}
