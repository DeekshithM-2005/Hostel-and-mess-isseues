import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import GlassCard from '../../components/ui/GlassCard';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import {
  AlertTriangle, UtensilsCrossed, FileText, Calendar,
  ArrowRight, Clock, Sun, Sunset, Moon as MoonIcon,
  DoorOpen, CreditCard, Ticket, CalendarDays,
} from 'lucide-react';

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MEAL_ICONS = { BREAKFAST: Sun, LUNCH: Sunset, DINNER: MoonIcon };

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users/me'),
      api.get('/complaints'),
      api.get('/mess/menu'),
    ])
      .then(([profileRes, complaintsRes, menuRes]) => {
        setProfile(profileRes.data);
        setComplaints(complaintsRes.data);
        setMenu(menuRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const today = DAYS[new Date().getDay()];
  const todayMenu = menu.filter((m) => m.dayOfWeek === today);
  const recentComplaints = complaints.slice(0, 3);
  const activeComplaints = complaints.filter((c) => c.status !== 'RESOLVED').length;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <GlassCard className="lg:col-span-2 animate-slide-up !p-7">
          <h1 className="text-3xl font-bold text-heading mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-sub mb-6 max-w-xl">
            Your hostel journey is managed and monitored here. Stay updated
            with mess schedules and track your requests in real-time.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button icon={AlertTriangle} onClick={() => navigate('/grievances')}>
              Raise Grievance
            </Button>
            <Button variant="secondary" icon={Clock} onClick={() => navigate('/grievances/my')}>
              View Timeline
            </Button>
          </div>
        </GlassCard>

        <GlassCard className="animate-slide-up stagger-1 !p-6">
          <div className="flex items-start justify-between mb-3">
            <span className="badge badge-info text-[0.65rem]">Primary Residence</span>
            <DoorOpen size={20} className="text-surface-300" />
          </div>
          <h2 className="text-4xl font-bold text-heading mb-1">
            {profile?.roomNumber || 'N/A'}
          </h2>
          <p className="text-sm text-sub mb-4">
            {profile?.hostelBlockName || 'Block'} Wing
          </p>
          <div className="w-full bg-surface-600/30 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full" style={{ width: '88%' }} />
          </div>
          <p className="text-xs text-muted mt-1.5">Occupancy</p>
        </GlassCard>
      </div>

      {/* Today's Menu & Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Menu Card */}
        <GlassCard className="lg:col-span-2 animate-slide-up stagger-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-heading">Today's Mess Menu</h3>
              <p className="text-xs text-muted mt-0.5">
                <Calendar size={12} className="inline mr-1" />
                {today.charAt(0) + today.slice(1).toLowerCase()}, {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate('/mess')}>
              View All <ArrowRight size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['BREAKFAST', 'LUNCH', 'DINNER'].map((mealType) => {
              const item = todayMenu.find((m) => m.mealType === mealType);
              const Icon = MEAL_ICONS[mealType];
              const isOngoing = (mealType === 'BREAKFAST' && new Date().getHours() < 10) ||
                               (mealType === 'LUNCH' && new Date().getHours() >= 12 && new Date().getHours() < 15) ||
                               (mealType === 'DINNER' && new Date().getHours() >= 19);
              return (
                <div
                  key={mealType}
                  className={`glass-card !p-4 ${isOngoing ? '!border-primary-500/30 animate-pulse-glow' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={16} className={isOngoing ? 'text-primary-400' : 'text-surface-300'} />
                    <span className="text-sm font-semibold text-heading">
                      {mealType.charAt(0) + mealType.slice(1).toLowerCase()}
                    </span>
                    {isOngoing && (
                      <span className="text-[0.6rem] font-bold text-primary-400">(Ongoing)</span>
                    )}
                  </div>
                  <p className="text-xs text-sub leading-relaxed">
                    {item?.items || 'Menu not available'}
                  </p>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Recent Requests */}
        <GlassCard className="animate-slide-up stagger-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-heading">Recent Requests</h3>
            <button
              className="text-xs text-primary-400 hover:text-primary-300 font-medium"
              onClick={() => navigate('/grievances/my')}
            >
              View All
            </button>
          </div>

          {recentComplaints.length > 0 ? (
            <div className="space-y-3">
              {recentComplaints.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 cursor-pointer transition-all"
                  onClick={() => navigate(`/grievances/${c.id}`)}
                >
                  <div className={`p-2 rounded-lg ${
                    c.category === 'ELECTRICAL' ? 'bg-amber-500/15' :
                    c.category === 'PLUMBING' ? 'bg-blue-500/15' :
                    c.category === 'WIFI' ? 'bg-cyan-500/15' :
                    c.category === 'FURNITURE' ? 'bg-orange-500/15' :
                    'bg-surface-500/15'
                  }`}>
                    <FileText size={16} className="text-surface-100" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-heading truncate">{c.title}</p>
                    <p className="text-[0.65rem] text-muted">
                      {new Date(c.createdAt).toLocaleDateString('en-IN')} • Ticket #{c.id}
                    </p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted text-center py-6">No complaints yet</p>
          )}
        </GlassCard>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-slide-up stagger-4">
        <StatCard icon={Calendar} label="Attendance" value="94%" />
        <StatCard icon={CreditCard} label="Mess Credits" value="1,240" />
        <StatCard icon={Ticket} label="Gate Passes" value={`${Math.min(activeComplaints, 4)} / 04`} />
        <StatCard icon={CalendarDays} label="Next Leave" value="Nov 01" />
      </div>
    </div>
  );
}
