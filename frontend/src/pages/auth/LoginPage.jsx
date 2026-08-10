import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Building2, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      // Route based on role
      if (user.role === 'ADMIN') navigate('/warden');
      else if (user.role === 'WARDEN') navigate('/warden');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary-400/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl" />
      </div>

      <div className="glass-card w-full max-w-md p-8 relative animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-2.5 rounded-xl bg-primary-600/20">
              <Building2 size={28} className="text-primary-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-heading">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              HostelHub
            </span>
          </h1>
          <p className="text-sm text-muted mt-2">
            Sign in to manage your hostel journey
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-slide-up">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@college.edu"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-muted hover:text-heading transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            icon={LogIn}
            loading={loading}
          >
            Sign In
          </Button>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 pt-5 border-t divider">
          <p className="text-xs text-muted text-center mb-3">Demo Credentials</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Student', email: 'aarav@student.edu', pw: 'student123' },
              { label: 'Warden', email: 'anita.warden@college.edu', pw: 'warden123' },
              { label: 'Admin', email: 'admin@college.edu', pw: 'admin123' },
            ].map((cred) => (
              <button
                key={cred.label}
                type="button"
                className="glass-card !p-2.5 text-center cursor-pointer hover:!bg-white/8 transition-all group"
                onClick={() => setForm({ email: cred.email, password: cred.pw })}
              >
                <p className="text-xs font-semibold text-heading group-hover:text-primary-400 transition-colors">
                  {cred.label}
                </p>
                <p className="text-[0.6rem] text-muted mt-0.5 truncate">{cred.email}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Register link */}
        <p className="text-sm text-center text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
