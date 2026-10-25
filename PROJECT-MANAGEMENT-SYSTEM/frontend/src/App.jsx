import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, AlertCircle, CheckCircle2, CirclePlus, ClipboardList, Search, SlidersHorizontal } from 'lucide-react';
import api from './api';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import Navbar from './components/Navbar';

const columns = [
  { status: 'Pending', className: 'pending', icon: <AlertCircle size={17}/> },
  { status: 'In Progress', className: 'progressing', icon: <Activity size={17}/> },
  { status: 'Completed', className: 'completed', icon: <CheckCircle2 size={17}/> }
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [taskResponse, statResponse] = await Promise.all([
        api.get('/tasks', { params: { search: search || undefined } }),
        api.get('/tasks/stats')
      ]);
      setTasks(taskResponse.data.tasks);
      setStats(statResponse.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot connect to the backend. Check that the API and MongoDB are running.');
    } finally { setLoading(false); }
  }, [search]);

  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [load]);

  const visibleTasks = useMemo(() => tasks.filter(t => filter === 'All' || t.status === filter), [tasks, filter]);

  async function saveTask(form) {
    try {
      if (editing) await api.patch(`/tasks/${editing._id}`, form);
      else await api.post('/tasks', form);
      setShowForm(false); setEditing(null);
      setNotice(editing ? 'Task updated successfully.' : 'New task added successfully.');
      await load();
      setTimeout(() => setNotice(''), 2800);
    } catch (err) { throw new Error(err.response?.data?.message || 'Could not save task.'); }
  }
  async function changeStatus(task, status) {
    try { await api.patch(`/tasks/${task._id}`, { status }); setNotice(`Task moved to ${status}.`); await load(); setTimeout(() => setNotice(''), 2500); }
    catch (err) { setError(err.response?.data?.message || 'Could not update status.'); }
  }
  async function deleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    try { await api.delete(`/tasks/${task._id}`); setNotice('Task deleted.'); await load(); setTimeout(() => setNotice(''), 2500); }
    catch (err) { setError(err.response?.data?.message || 'Could not delete task.'); }
  }

  return <div className="app-shell">
    <Navbar onAdd={() => { setEditing(null); setShowForm(true); }}/>
    <main className="page">
      <section className="hero">
        <div><p className="eyebrow">WORKSPACE / OVERVIEW</p><h1>Project dashboard</h1><p className="muted">Organize the work. Track the progress. Deliver together.</p></div>
        <button className="primary" onClick={() => { setEditing(null); setShowForm(true); }}><CirclePlus size={18}/> Add new task</button>
      </section>
      {error && <div className="alert error">{error}</div>}
      {notice && <div className="alert success">{notice}</div>}
      <section className="stats-grid">
        <article className="stat-card"><div className="stat-label"><span className="stat-icon total"><ClipboardList size={19}/></span><span>Total tasks</span></div><strong>{stats.total}</strong><p>Across your workspace</p></article>
        <article className="stat-card"><div className="stat-label"><span className="stat-icon pending-icon"><AlertCircle size={19}/></span><span>Pending</span></div><strong>{stats.pending}</strong><p>Waiting to get started</p></article>
        <article className="stat-card"><div className="stat-label"><span className="stat-icon progress-icon"><Activity size={19}/></span><span>In progress</span></div><strong>{stats.inProgress}</strong><p>Currently being worked on</p></article>
        <article className="stat-card"><div className="stat-label"><span className="stat-icon completed-icon"><CheckCircle2 size={19}/></span><span>Completed</span></div><strong>{stats.completed}</strong><p>Successfully finished</p></article>
      </section>
      <section className="board-panel">
        <div className="board-toolbar"><div><h2>Tasks board</h2><p className="muted">Manage and update your team's work</p></div>
          <div className="toolbar-controls"><label className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks..."/></label><label className="filter-box"><SlidersHorizontal size={16}/><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option><option>Pending</option><option>In Progress</option><option>Completed</option></select></label></div>
        </div>
        {loading ? <div className="empty">Loading tasks…</div> : <section className="kanban">{columns.map(col => {
          const items = visibleTasks.filter(t => t.status === col.status);
          return <div className={`task-column ${col.className}`} key={col.status}>
            <div className="column-heading"><div className="column-title">{col.icon}<span>{col.status}</span><b>{items.length}</b></div><button className="icon-button" title={`Add ${col.status} task`} onClick={()=>{setEditing(null);setShowForm(true);}}><CirclePlus size={17}/></button></div>
            <div className="task-list">{items.map(task=><TaskCard key={task._id} task={task} onStatus={changeStatus} onEdit={t=>{setEditing(t);setShowForm(true);}} onDelete={deleteTask}/>)}
              {!items.length && <div className="column-empty">No tasks here yet</div>}
            </div>
          </div>;
        })}</section>}
        {!loading && visibleTasks.length===0 && tasks.length>0 && <p className="no-results">No tasks match this filter.</p>}
      </section>
      <footer className="footer">Project Management System <span>•</span> Built with React, Express & MongoDB</footer>
    </main>
    {showForm && <TaskForm initial={editing} onClose={()=>{setShowForm(false);setEditing(null);}} onSave={saveTask}/>}
  </div>;
}
