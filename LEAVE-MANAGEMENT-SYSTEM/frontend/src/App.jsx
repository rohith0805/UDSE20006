import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import api from './api';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import AdminDashboard from './pages/AdminDashboard';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function Protected({ children, admin = false }) {
  const { user, loading } = useAuth();
  if (loading) return <main className="page"><p>Loading your account…</p></main>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  async function refreshUser() {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      localStorage.removeItem('leaveToken');
      setUser(null);
    } finally { setLoading(false); }
  }
  useEffect(() => {
    if (localStorage.getItem('leaveToken')) refreshUser();
    else setLoading(false);
  }, []);
  function login(data) {
    localStorage.setItem('leaveToken', data.token);
    setUser(data.user);
  }
  function logout() {
    localStorage.removeItem('leaveToken');
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, setUser, login, logout, loading, refreshUser }}>
    <Navbar />
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/" element={<Protected><Dashboard /></Protected>} />
      <Route path="/apply" element={<Protected><ApplyLeave /></Protected>} />
      <Route path="/history" element={<Protected><LeaveHistory /></Protected>} />
      <Route path="/admin" element={<Protected admin><AdminDashboard /></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </AuthContext.Provider>;
}
