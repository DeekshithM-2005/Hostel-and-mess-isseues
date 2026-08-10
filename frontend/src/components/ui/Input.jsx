export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-sub">{label}</label>
      )}
      <input
        className={`glass-input px-4 py-3 text-sm ${error ? '!border-red-500' : ''}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}

export function TextArea({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-sub">{label}</label>
      )}
      <textarea
        className={`glass-input px-4 py-3 text-sm resize-none min-h-[120px] ${error ? '!border-red-500' : ''}`}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
