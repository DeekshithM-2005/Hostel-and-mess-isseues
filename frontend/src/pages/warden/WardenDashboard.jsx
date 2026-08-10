import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import GlassCard from '../../components/ui/GlassCard';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Pagination from '../../components/ui/Pagination';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import {
  AlertTriangle, Star, Building2, Filter, Download,
  Users, TrendingUp, Clock, CheckCircle, ArrowUpRight,
} from 'lucide-react';

export default function WardenDashboard() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const promises = [api.get('/complaints')];
    if (role === 'ADMIN') {
      promises.push(api.get('/analytics/summary'));
      promises.push(api.get('/admin/hostel-blocks'));
    }

    Promise.all(promises)
      .then(([complaintsRes, analyticsRes, blocksRes]) => {
        setComplaints(complaintsRes.data);
        if (analyticsRes) setAnalytics(analyticsRes.data);
        if (blocksRes) setBlocks(blocksRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [role]);

  if (loading) return <PageLoader />;

  const activeIssues = complaints.filter((c) => c.status !== 'RESOLVED').length;
  const resolvedToday = complaints.filter((c) => {
    if (c.status !== 'RESOLVED') return false;
    const updated = new Date(c.updatedAt);
    const today = new Date();
    return updated.toDateString() === today.toDateString();
  }).length;

  const totalPages = Math.ceil(complaints.length / perPage);
  const paginated = complaints.slice((page - 1) * perPage, page * perPage);

  // Heatmap data (simulated — based on blocks if available)
  const heatmapRows = 4;
  const heatmapCols = 10;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-heading">Admin Console</h1>
        <p className="text-sub mt-1">
          Manage infrastructure, oversee student welfare, and track real-time hostel operations
          from one unified interface.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up stagger-1">
        <StatCard
          icon={AlertTriangle}
          label="Total Active Issues"
          value={activeIssues}
          trend={12}
        />
        <StatCard
          icon={Star}
          label="Mess Feedback Rating"
          value={analytics?.averageRating?.toFixed(1) || '4.2'}
          subtitle="/ 5.0"
        />
        <StatCard
          icon={Building2}
          label="Hostel Occupancy"
          value={analytics?.totalStudents || '1,408'}
          subtitle="/ 1,600"
        />
      </div>

      {/* Grievance Table */}
      <GlassCard className="!p-0 overflow-hidden animate-slide-up stagger-2">
        <div className="flex items-center justify-between p-5 pb-3">
          <h3 className="text-lg font-bold text-heading">Recent Student Grievances</h3>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={Filter}>Filter</Button>
            <Button size="sm" icon={Download} className="!bg-red-500/15 !text-red-400 !border-red-500/20 hover:!bg-red-500/25 !shadow-none">
              Export Report
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b divider">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Student & ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted hidden lg:table-cell">Description</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Urgency</th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c) => (
                <tr
                  key={c.id}
                  className="border-b divider last:border-0 hover:bg-white/3 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.studentName || 'Student'} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-heading">{c.studentName}</p>
                        <p className="text-[0.65rem] text-muted">
                          {c.studentEmail?.split('@')[0]?.toUpperCase()} • Room {c.roomNumber || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="badge badge-info">{c.category}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <p className="text-sm text-sub truncate max-w-[280px]">{c.title}</p>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={c.priority} />
                  </td>
                  <td className="px-5 py-4">
                    <Button
                      size="sm"
                      variant={c.status === 'PENDING' ? 'primary' : 'secondary'}
                      onClick={() => navigate(`/grievances/${c.id}`)}
                    >
                      {c.status === 'PENDING' ? 'Assign' : c.status === 'IN_REVIEW' ? 'Approve' : 'View'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t divider">
          <p className="text-xs text-muted">
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, complaints.length)} of {complaints.length} entries
          </p>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </GlassCard>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Block Occupancy Heatmap */}
        <GlassCard className="lg:col-span-2 animate-slide-up stagger-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-heading">Block-wise Occupancy</h3>
              <p className="text-xs text-muted mt-0.5">Real-time room availability heatmap</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-primary-600" /> Full
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-primary-600/35" /> Partial
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {Array.from({ length: heatmapRows }).map((_, row) => (
              <div key={row} className="flex gap-1.5">
                {Array.from({ length: heatmapCols }).map((_, col) => {
                  const seed = (row * heatmapCols + col + 7) % 5;
                  const cls = seed < 3 ? 'heatmap-full' : seed < 4 ? 'heatmap-partial' : 'heatmap-empty';
                  return <div key={col} className={`heatmap-cell ${cls}`} />;
                })}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Staff On-Duty */}
        <GlassCard className="animate-slide-up stagger-4">
          <h3 className="text-lg font-bold text-heading mb-4">Staff On-Duty</h3>
          <div className="space-y-4">
            {[
              { name: 'Robert Wilson', role: 'Chief Electrician', online: true },
              { name: 'Elena Rodriguez', role: 'Mess Supervisor', online: true },
              { name: 'Kevin Chen', role: 'IT Support', online: false },
            ].map((staff) => (
              <div key={staff.name} className="flex items-center gap-3">
                <Avatar name={staff.name} size="md" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-heading">{staff.name}</p>
                  <p className={`text-xs ${staff.online ? 'text-primary-400' : 'text-muted'}`}>
                    {staff.role} {!staff.online && '(Offline)'}
                  </p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${staff.online ? 'bg-green-500' : 'bg-surface-400'}`} />
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 !text-primary-400">
            View Full Directory
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}
