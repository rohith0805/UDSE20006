import { useEffect, useState } from 'react';
import { X, ClipboardList } from 'lucide-react';

const blank = { title:'', description:'', assignee:'', priority:'Medium', status:'Pending', dueDate:'' };
function localDate(value) {
  if (!value) return '';
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
export default function TaskForm({ initial, onClose, onSave }) {
  const [form,setForm] = useState(blank); const [error,setError] = useState(''); const [busy,setBusy] = useState(false);
  useEffect(()=>{if(initial) setForm({...blank,...initial,dueDate:localDate(initial.dueDate)}); else setForm(blank);},[initial]);
  function update(e) { setForm({...form,[e.target.name]:e.target.value}); }
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try { await onSave({...form,dueDate:form.dueDate || null}); }
    catch(err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <section className="modal">
      <div className="modal-heading"><div className="modal-symbol"><ClipboardList size={22}/></div><div><h2>{initial?'Edit task':'Create a task'}</h2><p className="muted">{initial?'Update the task details below.':'Add a task to your project board.'}</p></div><button className="close-button" onClick={onClose}><X size={20}/></button></div>
      {error && <div className="alert error">{error}</div>}
      <form onSubmit={submit} className="task-form">
        <label>Task title <span className="required">*</span><input name="title" required maxLength="120" value={form.title} onChange={update} placeholder="e.g. Design landing page"/></label>
        <label>Description<textarea name="description" rows="3" maxLength="1000" value={form.description} onChange={update} placeholder="What needs to be done?"/></label>
        <div className="two-fields"><label>Assignee<input name="assignee" maxLength="80" value={form.assignee} onChange={update} placeholder="Team member name"/></label><label>Due date<input name="dueDate" type="date" value={form.dueDate} onChange={update}/></label></div>
        <div className="two-fields"><label>Priority<select name="priority" value={form.priority} onChange={update}><option>Low</option><option>Medium</option><option>High</option></select></label><label>Status<select name="status" value={form.status} onChange={update}><option>Pending</option><option>In Progress</option><option>Completed</option></select></label></div>
        <div className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={busy}>{busy?'Saving…':initial?'Save changes':'Create task'}</button></div>
      </form>
    </section>
  </div>;
}
