export default function GlassCard({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`glass-card p-5 ${hover ? '' : '!bg-[rgba(255,255,255,0.04)]'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
