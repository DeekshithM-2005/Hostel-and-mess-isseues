import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import GlassCard from '../../components/ui/GlassCard';
import Select from '../../components/ui/Select';
import { TextArea } from '../../components/ui/Input';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import FileUpload from '../../components/ui/FileUpload';
import StatusBadge from '../../components/ui/StatusBadge';
import { Send, AlertTriangle, Zap, Droplets, Wifi, Armchair, SprayCan, HelpCircle, Phone } from 'lucide-react';
import { useEffect } from 'react';

const CATEGORIES = [
  { value: 'ELECTRICAL', label: 'Electrical', icon: Zap },
  { value: 'PLUMBING', label: 'Plumbing', icon: Droplets },
  { value: 'WIFI', label: 'WiFi / IT', icon: Wifi },
  { value: 'FURNITURE', label: 'Furniture', icon: Armchair },
  { value: 'CLEANLINESS', label: 'Cleanliness', icon: SprayCan },
  { value: 'OTHER', label: 'Other', icon: HelpCircle },
];

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

export default function GrievancePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'LOW',
    roomNumber: '',
    floorNumber: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.get('/complaints')
      .then(({ data }) => setHistory(data.slice(0, 5)))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) {
      setError('Please select a category');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        title: form.title || `${form.category} issue`,
        floorNumber: form.floorNumber ? Number(form.floorNumber) : null,
      };
      await api.post('/complaints', payload);
      setSuccess(true);
      setForm({ title: '', description: '', category: '', priority: 'LOW', roomNumber: '', floorNumber: '', imageUrl: '' });
      // Refresh history
      const { data } = await api.get('/complaints');
      setHistory(data.slice(0, 5));
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit grievance');
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const CATEGORY_ICONS = {
    ELECTRICAL: Zap, PLUMBING: Droplets, WIFI: Wifi,
    FURNITURE: Armchair, CLEANLINESS: SprayCan, OTHER: HelpCircle,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="text-3xl font-bold text-heading">Grievance Portal</h1>
        <p className="text-sub mt-1">
          Report issues regarding your room, mess, or hostel facilities. We aim for 24h resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <GlassCard className="animate-slide-up stagger-1">
            {success && (
              <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm animate-slide-up">
                ✅ Grievance submitted successfully! Your request is being reviewed.
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Select
                  label="Issue Category"
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                  options={CATEGORIES.map((c) => ({ value: c.value, label: c.label }))}
                  placeholder="Select category"
                />
                <div>
                  <label className="text-sm font-medium text-sub block mb-1.5">Urgency</label>
                  <div className="flex gap-2">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => update('priority', p)}
                        className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all
                          ${form.priority === p
                            ? p === 'LOW' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : p === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'glass-card !py-3 text-sub hover:text-heading'
                          }`}
                      >
                        {p.charAt(0) + p.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Input
                label="Title"
                placeholder="Brief summary of the issue"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
              />

              <TextArea
                label="Description"
                placeholder="Describe the issue in detail (e.g., Room 402, ceiling leak near window)..."
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Room Number"
                  placeholder="e.g. K-201"
                  value={form.roomNumber}
                  onChange={(e) => update('roomNumber', e.target.value)}
                />
                <Input
                  label="Floor Number"
                  type="number"
                  placeholder="e.g. 2"
                  value={form.floorNumber}
                  onChange={(e) => update('floorNumber', e.target.value)}
                />
              </div>

              <FileUpload
                value={form.imageUrl}
                onUpload={(url) => update('imageUrl', url)}
              />

              <Button type="submit" className="w-full" size="lg" icon={Send} loading={loading}>
                Submit Grievance
              </Button>
            </form>
          </GlassCard>
        </div>

        {/* History Sidebar */}
        <div className="space-y-5">
          <GlassCard className="animate-slide-up stagger-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-heading">Recent History</h3>
              <button
                className="text-xs text-primary-400 hover:text-primary-300 font-medium"
                onClick={() => navigate('/grievances/my')}
              >
                View All
              </button>
            </div>

            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map((c) => {
                  const CatIcon = CATEGORY_ICONS[c.category] || HelpCircle;
                  return (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-white/3 hover:bg-white/5 cursor-pointer transition-all"
                      onClick={() => navigate(`/grievances/${c.id}`)}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <CatIcon size={14} className="text-surface-300" />
                          <span className="text-sm font-semibold text-heading">{c.category}</span>
                        </div>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="text-xs text-muted mb-0.5">
                        G-{c.id} | {new Date(c.createdAt).toLocaleDateString('en-IN')}
                      </p>
                      <p className="text-xs text-sub truncate">{c.title}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted text-center py-4">No complaints yet</p>
            )}
          </GlassCard>

          {/* Emergency Card */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-primary-700 to-primary-900 animate-slide-up stagger-3">
            <h4 className="text-lg font-bold text-white mb-1">Need Urgent Help?</h4>
            <p className="text-sm text-primary-200 mb-4">
              For medical or safety emergencies, contact the Warden directly.
            </p>
            <Button variant="secondary" size="sm" icon={Phone} className="!bg-white/15 !text-white !border-white/20 hover:!bg-white/25">
              Call Warden Office
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
