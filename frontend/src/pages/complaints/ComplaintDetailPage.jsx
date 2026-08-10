import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import GlassCard from '../../components/ui/GlassCard';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import {
  ArrowLeft, Send, Clock, AlertTriangle, ChevronRight,
  Image as ImageIcon, MapPin, User, Building2,
} from 'lucide-react';

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const { role, user } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComplaint = () => {
    api.get(`/complaints/${id}`)
      .then(({ data }) => setComplaint(data))
      .catch(() => navigate('/grievances/my'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchComplaint(); }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/complaints/${id}/comments`, { text: commentText });
      setCommentText('');
      fetchComplaint();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.patch(`/complaints/${id}/status`, { status: newStatus });
      fetchComplaint();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEscalate = async () => {
    try {
      await api.post(`/complaints/${id}/escalate`);
      fetchComplaint();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <PageLoader />;
  if (!complaint) return null;

  const statusFlow = ['PENDING', 'IN_REVIEW', 'IN_PROGRESS', 'RESOLVED'];
  const currentIdx = statusFlow.indexOf(complaint.status);

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="animate-slide-up">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-heading mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Back to complaints
        </button>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-heading">{complaint.title}</h1>
              <StatusBadge status={complaint.status} />
            </div>
            <p className="text-sm text-muted">
              Ticket #{complaint.id} • Filed on {new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          {(role === 'WARDEN' || role === 'ADMIN') && complaint.status !== 'RESOLVED' && (
            <div className="flex gap-2 flex-wrap">
              {complaint.status === 'PENDING' && (
                <Button size="sm" onClick={() => handleStatusUpdate('IN_REVIEW')}>
                  Accept Review
                </Button>
              )}
              {complaint.status === 'IN_REVIEW' && (
                <Button size="sm" onClick={() => handleStatusUpdate('IN_PROGRESS')}>
                  Start Work
                </Button>
              )}
              {complaint.status === 'IN_PROGRESS' && (
                <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate('RESOLVED')} className="!bg-green-500/15 !text-green-400 !border-green-500/20">
                  Mark Resolved
                </Button>
              )}
              {complaint.status !== 'ESCALATED' && (
                <Button size="sm" variant="danger" onClick={handleEscalate}>
                  Escalate
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Status Progress */}
          <GlassCard className="animate-slide-up stagger-1">
            <h3 className="text-sm font-semibold text-heading mb-4">Status Progress</h3>
            <div className="flex items-center gap-2">
              {statusFlow.map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    i <= currentIdx
                      ? 'bg-primary-600 text-white'
                      : complaint.status === 'ESCALATED' && s === 'RESOLVED'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-surface-600/30 text-surface-300'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i <= currentIdx ? 'text-heading' : 'text-muted'}`}>
                    {s.replace('_', ' ')}
                  </span>
                  {i < statusFlow.length - 1 && (
                    <div className={`flex-1 h-0.5 ${i < currentIdx ? 'bg-primary-600' : 'bg-surface-600/30'}`} />
                  )}
                </div>
              ))}
              {complaint.status === 'ESCALATED' && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-500/20">
                    <AlertTriangle size={14} className="text-purple-400" />
                  </div>
                  <span className="text-xs font-medium text-purple-400">Escalated</span>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Description */}
          <GlassCard className="animate-slide-up stagger-2">
            <h3 className="text-sm font-semibold text-heading mb-3">Description</h3>
            <p className="text-sm text-sub leading-relaxed">{complaint.description}</p>
            {complaint.imageUrl && (
              <div className="mt-4 p-3 rounded-xl bg-white/3 flex items-center gap-2">
                <ImageIcon size={16} className="text-primary-400" />
                <a
                  href={complaint.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-400 hover:underline"
                >
                  View attached evidence
                </a>
              </div>
            )}
          </GlassCard>

          {/* Comments */}
          <GlassCard className="animate-slide-up stagger-3">
            <h3 className="text-sm font-semibold text-heading mb-4">
              Comments ({complaint.comments?.length || 0})
            </h3>

            <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
              {complaint.comments?.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <Avatar name={c.authorName || 'User'} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-heading">{c.authorName || 'Unknown'}</span>
                      <span className="text-[0.65rem] text-muted">
                        {new Date(c.createdAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-sm text-sub">{c.text}</p>
                  </div>
                </div>
              ))}
              {(!complaint.comments || complaint.comments.length === 0) && (
                <p className="text-sm text-muted text-center py-4">No comments yet</p>
              )}
            </div>

            {complaint.status !== 'RESOLVED' && (
              <form onSubmit={handleComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="glass-input px-4 py-2.5 text-sm flex-1"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button type="submit" size="sm" icon={Send} loading={submitting} disabled={!commentText.trim()}>
                  Send
                </Button>
              </form>
            )}
          </GlassCard>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-5">
          <GlassCard className="animate-slide-up stagger-2">
            <h3 className="text-sm font-semibold text-heading mb-4">Details</h3>
            <div className="space-y-3">
              <InfoRow icon={AlertTriangle} label="Category" value={complaint.category} />
              <InfoRow icon={Clock} label="Priority" value={<StatusBadge status={complaint.priority} />} />
              <InfoRow icon={MapPin} label="Room" value={complaint.roomNumber || 'N/A'} />
              <InfoRow icon={Building2} label="Block" value={complaint.hostelBlockName || 'N/A'} />
              <InfoRow icon={User} label="Filed by" value={complaint.studentName || 'Student'} />
              {complaint.assignedWardenName && (
                <InfoRow icon={User} label="Assigned to" value={complaint.assignedWardenName} />
              )}
            </div>
          </GlassCard>

          {/* Timeline */}
          <GlassCard className="animate-slide-up stagger-3">
            <h3 className="text-sm font-semibold text-heading mb-4">Timeline</h3>
            <div className="space-y-4">
              {complaint.timeline?.map((t, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-500 shrink-0" />
                    {i < complaint.timeline.length - 1 && (
                      <div className="w-0.5 flex-1 bg-surface-600/30 mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-heading">{t.note}</p>
                    <p className="text-[0.65rem] text-muted mt-0.5">
                      {t.changedByName && `by ${t.changedByName} • `}
                      {new Date(t.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b divider last:border-0">
      <div className="flex items-center gap-2 text-muted">
        <Icon size={14} />
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-sm font-medium text-heading">
        {typeof value === 'string' ? value : value}
      </span>
    </div>
  );
}
