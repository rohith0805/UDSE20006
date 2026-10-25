import { useEffect, useState } from 'react';
import { Check, X, ClipboardCheck } from 'lucide-react';
import api from '../api';

function date(value) { return new Date(value).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}); }
export default function AdminDashboard() {
  const [leaves,setLeaves] = useState([]); const [error,setError] = useState(''); const [busyId,setBusyId] = useState('');
  async function load() { try { const {data}=await api.get('/admin/leaves'); setLeaves(data.leaves); } catch(e) { setError(e.response?.data?.message || 'Could not load admin requests.'); } }
  useEffect(()=>{load();},[]);
  async function review(id,status) {
    const adminComment = status === 'rejected' ? (window.prompt('Optional reason for rejection:') || '') : '';
    setError(''); setBusyId(id);
    try { await api.patch(`/admin/leaves/${id}`,{status,adminComment}); await load(); }
    catch(e) { setError(e.response?.data?.message || 'Could not update request.'); }
    finally { setBusyId(''); }
  }
  const pending = leaves.filter(l=>l.status==='pending');
  return <main className="page"><section className="welcome-row"><div><p className="eyebrow">ADMINISTRATION</p><h1>Leave approvals</h1><p className="muted">Review employee requests and update their status.</p></div><div className="admin-count"><ClipboardCheck size={20}/><strong>{pending.length}</strong><span>pending</span></div></section>
    {error && <div className="alert error">{error}</div>}
    <section className="panel"><div className="panel-heading"><div><h2>All employee requests</h2><p className="muted">Approving a request deducts days from the employee's balance.</p></div></div>
      {leaves.length ? <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Leave type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead><tbody>{leaves.map(l=><tr key={l._id}><td><strong>{l.user?.name || 'Unknown'}</strong><div className="muted tiny">{l.user?.email}</div></td><td className="capitalize">{l.leaveType}</td><td>{date(l.startDate)} – {date(l.endDate)}</td><td>{l.days}</td><td className="reason-cell">{l.reason}</td><td><span className={`status ${l.status}`}>{l.status}</span></td><td>{l.status==='pending' ? <div className="action-buttons"><button className="approve" disabled={busyId===l._id} onClick={()=>review(l._id,'approved')} title="Approve"><Check size={16}/> Approve</button><button className="reject" disabled={busyId===l._id} onClick={()=>review(l._id,'rejected')} title="Reject"><X size={16}/> Reject</button></div> : <span className="muted tiny">{l.reviewedAt ? date(l.reviewedAt) : 'Reviewed'}</span>}</td></tr>)}</tbody></table></div> : <div className="empty"><ClipboardCheck size={30}/><h3>No leave requests</h3><p>Employee applications will appear here.</p></div>}
    </section>
  </main>;
}
