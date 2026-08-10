import { ChevronDown } from 'lucide-react';

export default function Select({ label, error, options = [], placeholder = 'Select...', className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-sub">{label}</label>
      )}
      <div className="relative">
        <select
          className={`glass-input px-4 py-3 pr-10 text-sm appearance-none cursor-pointer w-full ${error ? '!border-red-500' : ''}`}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-surface-800 text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      </div>
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
