import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, LogOut } from 'lucide-react';
import { useAuth } from '../App';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function handleLogout() { logout(); navigate('/login'); }
  return <header className="navbar">
    <Link className="brand" to="/"><span className="brand-icon"><CalendarDays size={21} /></span> Leave<span>Ease</span></Link>
    <nav>
      {user ? <>
        <Link to="/">Dashboard</Link>
        <Link to="/apply">Apply Leave</Link>
        <Link to="/history">My Requests</Link>
        {user.role === 'admin' && <Link to="/admin">Admin</Link>}
        <span className="nav-user">{user.name}</span>
        <button className="logout-button" onClick={handleLogout}><LogOut size={16}/> Logout</button>
      </> : <><Link to="/login">Login</Link><Link className="nav-register" to="/register">Create account</Link></>}
    </nav>
  </header>;
}
