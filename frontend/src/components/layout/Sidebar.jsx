import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  AlertTriangle,
  UtensilsCrossed,
  Wrench,
  Shield,
  Settings,
  LogOut,
  Building2,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['STUDENT', 'WARDEN', 'ADMIN'] },
  { to: '/grievances', icon: AlertTriangle, label: 'Grievances', roles: ['STUDENT', 'WARDEN', 'ADMIN'] },
  { to: '/mess', icon: UtensilsCrossed, label: 'Mess Plan', roles: ['STUDENT', 'WARDEN', 'ADMIN'] },
  { to: '/maintenance', icon: Wrench, label: 'Maintenance', roles: ['WARDEN', 'ADMIN'] },
  { to: '/warden', icon: Shield, label: 'Warden Panel', roles: ['WARDEN', 'ADMIN'] },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-[200px] glass-sidebar flex flex-col
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Branding */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 size={20} className="text-primary-400" />
                <h2 className="text-sm font-bold text-heading leading-tight">
                  Hostel<br />Management
                </h2>
              </div>
              <p className="text-[0.65rem] font-medium text-muted uppercase tracking-widest">
                Vellore Campus
              </p>
            </div>
            <button className="lg:hidden btn-ghost btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {filteredNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'text-surface-100 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon size={18} className="shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 pb-5 space-y-1 border-t divider pt-3 mt-2">
          <NavLink
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-surface-100 hover:bg-white/5 hover:text-white transition-all"
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all w-full text-left"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
