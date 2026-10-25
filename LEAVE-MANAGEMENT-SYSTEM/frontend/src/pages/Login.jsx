import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import api from '../api';
import { useAuth } from '../App';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth(); const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try { const { data } = await api.post('/auth/login', form); login(data); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Unable to log in. Check the backend connection.'); }
    finally { setBusy(false); }
  }
  return <main className="auth-wrap"><section className="auth-card">
    <div className="auth-symbol"><LogIn size={26}/></div><p className="eyebrow">WELCOME BACK</p>
    <h1>Sign in to your account</h1><p className="muted">Manage your leave requests in one place.</p>
    {error && <div className="alert error">{error}</div>}
    <form onSubmit={submit}>
      <label>Email address<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com"/></label>
      <label>Password<input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter your password"/></label>
      <button className="primary full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
    <p className="auth-footer">New to LeaveEase? <Link to="/register">Create an account</Link></p>
  </section></main>;
}
