import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import GlassCard from '../../components/ui/GlassCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Avatar from '../../components/ui/Avatar';
import EmptyState from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import { Filter, Download, AlertTriangle, Search } from 'lucide-react';

export default function MyComplaintsPage() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    api.get('/complaints')
      .then(({ data }) => setComplaints(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const filtered = complaints
    .filter((c) => filter === 'ALL' || c.status === filter)
    .filter((c) =>
      search === '' ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const STATUSES = ['ALL', 'PENDING', 'IN_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'ESCALATED'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold text-heading">My Complaints</h1>
          <p className="text-sub mt-1">Track and manage all your grievances</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={Filter} onClick={() => {}}>
            Filter
          </Button>
          <Button variant="primary" size="sm" icon={Download}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 animate-slide-up stagger-1">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search complaints..."
            className="glass-input pl-10 pr-4 py-2.5 text-sm w-full"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-white/5 text-sub hover:bg-white/8 hover:text-heading'
              }`}
            >
              {s === 'ALL' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {paginated.length > 0 ? (
        <GlassCard className="!p-0 overflow-hidden animate-slide-up stagger-2">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b divider">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">Student & ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">Category</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted hidden md:table-cell">Description</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">Status</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted">Priority</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b divider last:border-0 hover:bg-white/3 cursor-pointer transition-colors"
                    onClick={() => navigate(`/grievances/${c.id}`)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.studentName || 'Student'} size="sm" />
                        <div>
                          <p className="text-sm font-semibold text-heading">{c.studentName || 'You'}</p>
                          <p className="text-[0.65rem] text-muted">{c.studentEmail} • {c.roomNumber || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="badge badge-info">{c.category}</span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <p className="text-sm text-sub truncate max-w-[250px]">{c.title}</p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={c.priority} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t divider">
            <p className="text-xs text-muted">
              Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length} entries
            </p>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </GlassCard>
      ) : (
        <EmptyState
          icon={AlertTriangle}
          title="No complaints found"
          message={search ? 'Try adjusting your search or filters' : 'You haven\'t filed any complaints yet'}
          action={
            <Button onClick={() => navigate('/grievances')}>
              Raise a Grievance
            </Button>
          }
        />
      )}
    </div>
  );
}
