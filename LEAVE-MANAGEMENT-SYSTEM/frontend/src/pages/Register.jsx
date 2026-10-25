import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRoundPlus } from 'lucide-react';
import api from '../api';
import { useAuth } from '../App';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const { login } = useAuth(); const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try { const { data } = await api.post('/auth/register', form); login(data); navigate('/'); }
    catch (err) { setError(err.response?.data?.message || 'Unable to create account.'); }
    finally { setBusy(false); }
  }
  return <main className="auth-wrap"><section className="auth-card">
    <div className="auth-symbol"><UserRoundPlus size={26}/></div><p className="eyebrow">GET STARTED</p>
    <h1>Create your account</h1><p className="muted">Join your organization's leave portal.</p>
    {error && <div className="alert error">{error}</div>}
    <form onSubmit={submit}>
      <label>Full name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your full name"/></label>
      <label>Work email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com"/></label>
      <label>Password<input type="password" minLength="6" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="At least 6 characters"/></label>
      <button className="primary full" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
    </form>
    <p className="auth-footer">Already registered? <Link to="/login">Sign in</Link></p>
  </section></main>;
}
