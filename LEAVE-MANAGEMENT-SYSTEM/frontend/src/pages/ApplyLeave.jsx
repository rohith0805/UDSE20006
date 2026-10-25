import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarPlus, ArrowLeft } from 'lucide-react';
import api from '../api';
import { useAuth } from '../App';

export default function ApplyLeave() {
  const { user, refreshUser } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ leaveType:'casual', startDate:'', endDate:'', reason:'' });
  const [error, setError] = useState(''); const [success, setSuccess] = useState(''); const [busy, setBusy] = useState(false);
  const balance = user?.leaveBalance || { casual:0, medical:0 };
  async function submit(e) {
    e.preventDefault(); setError(''); setSuccess(''); setBusy(true);
    try {
      const { data } = await api.post('/leaves', form);
      setSuccess(`${data.message} Your request is pending administrator review.`);
      await refreshUser();
      setTimeout(() => navigate('/history'), 900);
    } catch (err) { setError(err.response?.data?.message || 'Could not submit your request.'); }
    finally { setBusy(false); }
  }
  return <main className="page narrow-page">
    <Link to="/" className="back-link"><ArrowLeft size={16}/> Back to dashboard</Link>
    <section className="panel form-panel"><div className="page-title-icon"><CalendarPlus size={24}/></div><p className="eyebrow">TIME OFF</p><h1>Apply for leave</h1><p className="muted">Submit your dates and a short reason for your manager to review.</p>
      <div className="balance-strip"><span>Casual: <strong>{balance.casual} days</strong></span><span>Medical: <strong>{balance.medical} days</strong></span></div>
      {error && <div className="alert error">{error}</div>}{success && <div className="alert success">{success}</div>}
      <form onSubmit={submit}>
        <label>Leave type<select value={form.leaveType} onChange={e=>setForm({...form,leaveType:e.target.value})}><option value="casual">Casual leave ({balance.casual} days left)</option><option value="medical">Medical leave ({balance.medical} days left)</option></select></label>
        <div className="two-fields"><label>Start date<input type="date" required min={new Date().toLocaleDateString('en-CA')} value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})}/></label><label>End date<input type="date" required min={form.startDate || new Date().toLocaleDateString('en-CA')} value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})}/></label></div>
        <label>Reason for leave<textarea required maxLength="500" rows="4" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} placeholder="Briefly explain why you need leave…"/></label>
        <p className="field-hint">Days are counted inclusively, including the start and end dates.</p>
        <button className="primary full" disabled={busy}>{busy ? 'Submitting…' : 'Submit leave request'}</button>
      </form>
    </section>
  </main>;
}
