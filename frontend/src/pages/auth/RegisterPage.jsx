import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { Building2, UserPlus, Eye, EyeOff } from 'lucide-react';
import api from '../../lib/api';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'STUDENT',
    hostelBlockId: '', roomNumber: '', phone: '',
  });
  const [hostelBlocks, setHostelBlocks] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/hostel-blocks')
      .then(({ data }) => setHostelBlocks(data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        hostelBlockId: form.hostelBlockId ? Number(form.hostelBlockId) : null,
      };
      const user = await register(payload);
      if (user.role === 'ADMIN' || user.role === 'WARDEN') navigate('/warden');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-primary-400/8 rounded-full blur-3xl" />
      </div>

      <div className="glass-card w-full max-w-lg p-8 relative animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="p-2.5 rounded-xl bg-primary-600/20">
              <Building2 size={28} className="text-primary-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-heading">
            Join{' '}
            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              HostelHub
            </span>
          </h1>
          <p className="text-sm text-muted mt-1">Create your account to get started</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. Aarav Patel"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="name@student.edu"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
          />
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 6 characters"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-muted hover:text-heading transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Select
            label="Role"
            value={form.role}
            onChange={(e) => update('role', e.target.value)}
            options={[
              { value: 'STUDENT', label: 'Student' },
              { value: 'WARDEN', label: 'Warden' },
              { value: 'ADMIN', label: 'Admin' },
            ]}
          />

          {form.role === 'STUDENT' && (
            <div className="grid grid-cols-2 gap-4 animate-slide-up">
              <Select
                label="Hostel Block"
                value={form.hostelBlockId}
                onChange={(e) => update('hostelBlockId', e.target.value)}
                options={hostelBlocks.map((b) => ({ value: String(b.id), label: b.name }))}
                placeholder="Select block"
              />
              <Input
                label="Room Number"
                placeholder="e.g. K-201"
                value={form.roomNumber}
                onChange={(e) => update('roomNumber', e.target.value)}
              />
            </div>
          )}

          <Input
            label="Phone (Optional)"
            type="tel"
            placeholder="9876543210"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
          />

          <Button type="submit" className="w-full" size="lg" icon={UserPlus} loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="text-sm text-center text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
