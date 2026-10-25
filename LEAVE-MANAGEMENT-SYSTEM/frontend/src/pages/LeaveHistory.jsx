import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileClock } from 'lucide-react';
import api from '../api';

function date(value) { return new Date(value).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}); }
export default function LeaveHistory() {
  const [leaves,setLeaves] = useState([]); const [error,setError] = useState('');
  useEffect(()=>{api.get('/leaves/mine').then(r=>setLeaves(r.data.leaves)).catch(e=>setError(e.response?.data?.message || 'Could not load requests.'));},[]);
  return <main className="page"><Link to="/" className="back-link"><ArrowLeft size={16}/> Dashboard</Link>
    <section className="panel"><div className="panel-heading"><div><p className="eyebrow">YOUR ACTIVITY</p><h1>Leave requests</h1><p className="muted">All applications and their current status.</p></div><FileClock size={28} className="heading-icon"/></div>
      {error && <div className="alert error">{error}</div>}
      {leaves.length ? <div className="table-wrap"><table><thead><tr><th>Type</th><th>Start date</th><th>End date</th><th>Days</th><th>Reason</th><th>Status</th><th>Admin comment</th></tr></thead><tbody>{leaves.map(l=><tr key={l._id}><td className="capitalize">{l.leaveType}</td><td>{date(l.startDate)}</td><td>{date(l.endDate)}</td><td>{l.days}</td><td className="reason-cell">{l.reason}</td><td><span className={`status ${l.status}`}>{l.status}</span></td><td>{l.adminComment || '—'}</td></tr>)}</tbody></table></div> : <div className="empty"><FileClock size={30}/><h3>No applications found</h3><p>Submit a leave request to see it listed here.</p><Link to="/apply" className="text-link">Apply for leave →</Link></div>}
    </section>
  </main>;
}
