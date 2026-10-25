import { BriefcaseBusiness, CirclePlus } from 'lucide-react';
export default function Navbar({ onAdd }) {
  return <header className="navbar"><a className="brand" href="#"><span className="brand-icon"><BriefcaseBusiness size={21}/></span><span>Task<span className="brand-accent">Flow</span></span></a><div className="nav-right"><span className="workspace-label">MY WORKSPACE</span><button className="nav-add" onClick={onAdd}><CirclePlus size={16}/> New task</button></div></header>;
}
