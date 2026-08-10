import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';
import PrivateRoute from './components/auth/PrivateRoute';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import GrievancePage from './pages/complaints/GrievancePage';
import MyComplaintsPage from './pages/complaints/MyComplaintsPage';
import ComplaintDetailPage from './pages/complaints/ComplaintDetailPage';
import MessPage from './pages/mess/MessPage';
import WardenDashboard from './pages/warden/WardenDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes — wrapped in AppLayout */}
            <Route element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }>
              {/* Dashboard */}
              <Route path="/dashboard" element={<StudentDashboard />} />

              {/* Grievances */}
              <Route path="/grievances" element={<GrievancePage />} />
              <Route path="/grievances/my" element={<MyComplaintsPage />} />
              <Route path="/grievances/:id" element={<ComplaintDetailPage />} />

              {/* Mess */}
              <Route path="/mess" element={<MessPage />} />

              {/* Maintenance (placeholder — redirects to grievances for now) */}
              <Route path="/maintenance" element={<MyComplaintsPage />} />

              {/* Warden Panel */}
              <Route path="/warden" element={
                <PrivateRoute roles={['WARDEN', 'ADMIN']}>
                  <WardenDashboard />
                </PrivateRoute>
              } />

              {/* Admin Analytics */}
              <Route path="/admin" element={
                <PrivateRoute roles={['ADMIN']}>
                  <AdminDashboard />
                </PrivateRoute>
              } />

              {/* Settings placeholder */}
              <Route path="/settings" element={
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-heading">Settings</h1>
                  <p className="text-sub">Profile and preference settings coming soon.</p>
                </div>
              } />

              {/* Notifications placeholder */}
              <Route path="/notifications" element={
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-heading">Notifications</h1>
                  <p className="text-sub">Notification center coming soon.</p>
                </div>
              } />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
