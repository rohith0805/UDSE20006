import { CalendarDays, Pencil, Trash2, UserRound } from 'lucide-react';

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, { day:'numeric', month:'short', year:'numeric' });
}
export default function TaskCard({ task, onStatus, onEdit, onDelete }) {
  const next = task.status === 'Pending' ? 'In Progress' : task.status === 'In Progress' ? 'Completed' : 'Pending';
  return <article className="task-card">
    <div className="task-card-top"><span className={`priority ${task.priority.toLowerCase()}`}><i/> {task.priority} priority</span><div className="card-actions"><button className="mini-icon" title="Edit task" onClick={()=>onEdit(task)}><Pencil size={14}/></button><button className="mini-icon delete-icon" title="Delete task" onClick={()=>onDelete(task)}><Trash2 size={14}/></button></div></div>
    <h3>{task.title}</h3>
    {task.description && <p className="task-description">{task.description}</p>}
    <div className="task-meta">{task.assignee && <span><UserRound size={14}/>{task.assignee}</span>}{task.dueDate && <span><CalendarDays size={14}/>{formatDate(task.dueDate)}</span>}</div>
    <div className="task-card-bottom"><span className={`status-pill ${task.status.toLowerCase().replace(' ','-')}`}>{task.status}</span><button className="move-button" onClick={()=>onStatus(task,next)}>{task.status==='Completed'?'Reopen task':`Move to ${next}`} →</button></div>
  </article>;
}
