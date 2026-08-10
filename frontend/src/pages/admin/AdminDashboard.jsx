import { useState, useEffect } from 'react';
import api from '../../lib/api';
import GlassCard from '../../components/ui/GlassCard';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import {
  BarChart3, Users, AlertTriangle, Star, TrendingUp,
  Shield, Building2, PlusCircle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';

const PIE_COLORS = ['#f59e0b', '#3b82f6', '#2563eb', '#10b981', '#8b5cf6'];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [byStatus, setByStatus] = useState({});
  const [byCategory, setByCategory] = useState({});
  const [messTrend, setMessTrend] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/analytics/summary'),
      api.get('/analytics/complaints/by-status'),
      api.get('/analytics/complaints/by-category'),
      api.get('/analytics/mess/trend'),
      api.get('/admin/wardens'),
      api.get('/admin/hostel-blocks'),
    ])
      .then(([summaryRes, statusRes, catRes, trendRes, wardenRes, blockRes]) => {
        setAnalytics(summaryRes.data);
        setByStatus(statusRes.data);
        setByCategory(catRes.data);
        setMessTrend(trendRes.data);
        setWardens(wardenRes.data);
        setBlocks(blockRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const statusData = Object.entries(byStatus).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
  const categoryData = Object.entries(byCategory).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-heading">Admin Analytics</h1>
        <p className="text-sub mt-1">
          System-wide metrics, complaint analytics, and warden management.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up stagger-1">
        <StatCard icon={AlertTriangle} label="Total Complaints" value={analytics?.totalComplaints || 0} trend={8} />
        <StatCard icon={Users} label="Total Students" value={analytics?.totalStudents || 0} />
        <StatCard icon={Shield} label="Active Wardens" value={wardens.length} />
        <StatCard icon={Star} label="Avg. Mess Rating" value={analytics?.averageRating?.toFixed(1) || '0.0'} subtitle="/5.0" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Complaints by Status (Pie) */}
        <GlassCard className="animate-slide-up stagger-2">
          <h3 className="text-lg font-bold text-heading mb-4">Complaints by Status</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 22, 41, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                    fontSize: '0.8rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted text-center py-12">No data available</p>
          )}
          <div className="flex flex-wrap gap-3 mt-2">
            {statusData.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-sub">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Complaints by Category (Bar) */}
        <GlassCard className="animate-slide-up stagger-3">
          <h3 className="text-lg font-bold text-heading mb-4">Complaints by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 22, 41, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                    fontSize: '0.8rem',
                  }}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted text-center py-12">No data available</p>
          )}
        </GlassCard>
      </div>

      {/* Mess Rating Trend */}
      {messTrend.length > 0 && (
        <GlassCard className="animate-slide-up stagger-4">
          <h3 className="text-lg font-bold text-heading mb-4">Mess Rating Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={messTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 22, 41, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontSize: '0.8rem',
                }}
              />
              <Line
                type="monotone"
                dataKey="averageRating"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#2563eb' }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Warden Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GlassCard className="animate-slide-up stagger-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-heading">Warden Directory</h3>
            <Button size="sm" variant="secondary" icon={PlusCircle}>Add</Button>
          </div>
          <div className="space-y-3">
            {wardens.map((w) => (
              <div key={w.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3">
                <Avatar name={w.name} size="md" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-heading">{w.name}</p>
                  <p className="text-xs text-muted">{w.email}</p>
                </div>
                <span className="text-xs text-sub">
                  {w.hostelBlockName || 'Unassigned'}
                </span>
              </div>
            ))}
            {wardens.length === 0 && (
              <p className="text-sm text-muted text-center py-4">No wardens registered</p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="animate-slide-up stagger-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-heading">Hostel Blocks</h3>
          </div>
          <div className="space-y-3">
            {blocks.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-600/15">
                    <Building2 size={18} className="text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-heading">{b.name}</p>
                    <p className="text-xs text-muted">{b.totalFloors} floors</p>
                  </div>
                </div>
                <span className="text-xs text-sub">
                  {b.wardenName || 'No warden'}
                </span>
              </div>
            ))}
            {blocks.length === 0 && (
              <p className="text-sm text-muted text-center py-4">No blocks found</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
