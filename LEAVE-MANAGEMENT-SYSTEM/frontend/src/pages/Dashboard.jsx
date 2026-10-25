import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, CalendarPlus, Clock3, HeartPulse, Palmtree, ArrowRight } from 'lucide-react';
import api from '../api';
import { useAuth } from '../App';

function prettyDate(value) { return new Date(value).toLocaleDateString(undefined, { day:'numeric', month:'short', year:'numeric' }); }

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [leaves, setLeaves] = useState([]); const [error, setError] = useState('');
  async function load() {
    try { const [mine] = await Promise.all([api.get('/leaves/mine'), refreshUser()]); setLeaves(mine.data.leaves.slice(0,4)); }
    catch (err) { setError(err.response?.data?.message || 'Could not load dashboard.'); }
  }
  useEffect(() => { load(); }, []);
  const balance = user?.leaveBalance || { casual: 0, medical: 0 };
  const pending = leaves.filter(l => l.status === 'pending').length;
  return <main className="page">
    <section className="welcome-row"><div><p className="eyebrow">EMPLOYEE PORTAL</p><h1>Hello, {user?.name?.split(' ')[0]} 👋</h1><p className="muted">Here is your leave overview. Plan time off with confidence.</p></div><Link to="/apply" className="primary link-button"><CalendarPlus size={18}/> Apply for leave</Link></section>
    {error && <div className="alert error">{error}</div>}
    <section className="stats-grid">
      <article className="stat-card"><div className="stat-top"><span>Casual leave</span><span className="stat-icon green"><Palmtree size={20}/></span></div><strong>{balance.casual}</strong><p>days available</p><div className="progress"><span style={{width:`${Math.min(100,balance.casual/12*100)}%`}}/></div></article>
      <article className="stat-card"><div className="stat-top"><span>Medical leave</span><span className="stat-icon blue"><HeartPulse size={20}/></span></div><strong>{balance.medical}</strong><p>days available</p><div className="progress blue-progress"><span style={{width:`${Math.min(100,balance.medical/10*100)}%`}}/></div></article>
      <article className="stat-card"><div className="stat-top"><span>Pending requests</span><span className="stat-icon amber"><Clock3 size={20}/></span></div><strong>{pending}</strong><p>awaiting review</p><Link className="small-link" to="/history">View requests <ArrowRight size={14}/></Link></article>
    </section>
    <section className="panel"><div className="panel-heading"><div><h2>Recent leave requests</h2><p className="muted">Track your latest applications</p></div><Link className="text-link" to="/history">View all <ArrowRight size={15}/></Link></div>
      {leaves.length ? <div className="table-wrap"><table><thead><tr><th>Leave type</th><th>Dates</th><th>Days</th><th>Status</th></tr></thead><tbody>{leaves.map(l=><tr key={l._id}><td><span className="type-label">{l.leaveType === 'casual' ? '🌿' : '🩺'} {l.leaveType} leave</span></td><td>{prettyDate(l.startDate)} – {prettyDate(l.endDate)}</td><td>{l.days}</td><td><span className={`status ${l.status}`}>{l.status}</span></td></tr>)}</tbody></table></div> : <div className="empty"><CalendarCheck size={30}/><h3>No leave requests yet</h3><p>When you apply for leave, your requests will appear here.</p><Link to="/apply" className="text-link">Apply for your first leave <ArrowRight size={15}/></Link></div>}
    </section>
    {user?.role === 'admin' && <div className="admin-note">You have administrator access. <Link to="/admin">Open the admin dashboard →</Link></div>}
  </main>;
}
