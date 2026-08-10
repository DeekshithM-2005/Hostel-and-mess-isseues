import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../ui/Avatar';
import {
  Search, Moon, Sun, Bell, Menu, X,
} from 'lucide-react';
import api from '../../lib/api';

const TOP_TABS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/grievances', label: 'Grievances' },
  { to: '/mess', label: 'Mess' },
  { to: '/warden', label: 'Admin', roles: ['WARDEN', 'ADMIN'] },
];

export default function Topbar({ onMenuToggle }) {
  const { user, role } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/notifications/unread-count')
      .then(({ data }) => setUnreadCount(data.count))
      .catch(() => {});
  }, []);

  const filteredTabs = TOP_TABS.filter(
    (tab) => !tab.roles || tab.roles.includes(role)
  );

  return (
    <header className="glass-topbar sticky top-0 z-30 px-6 h-16 flex items-center justify-between">
      {/* Left: hamburger + nav tabs */}
      <div className="flex items-center gap-6">
        <button className="lg:hidden btn-ghost btn-icon" onClick={onMenuToggle}>
          <Menu size={20} />
        </button>

        {/* Brand (visible on small screens) */}
        <span className="lg:hidden text-lg font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          HostelHub
        </span>

        {/* Desktop brand */}
        <span className="hidden lg:block text-lg font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          HostelHub
        </span>

        {/* Nav Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {filteredTabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
                ${isActive
                  ? 'text-primary-400 bg-primary-500/10'
                  : 'text-surface-100 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Right: search, theme, notifications, profile */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className={`relative transition-all duration-300 ${searchOpen ? 'w-52' : 'w-0'}`}>
          {searchOpen && (
            <input
              autoFocus
              type="text"
              placeholder="Search records..."
              className="glass-input pl-3 pr-8 py-2 text-sm w-full"
              onBlur={() => setSearchOpen(false)}
            />
          )}
        </div>
        <button
          className="btn-ghost btn-icon p-2"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          {searchOpen ? <X size={18} /> : <Search size={18} />}
        </button>

        {/* Theme Toggle */}
        <button className="btn-ghost btn-icon p-2" onClick={toggleTheme}>
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <button
          className="btn-ghost btn-icon p-2 relative"
          onClick={() => navigate('/notifications')}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[0.6rem] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          className="ml-1"
          onClick={() => navigate('/settings')}
        >
          <Avatar name={user?.name || 'User'} size="sm" />
        </button>
      </div>
    </header>
  );
}
