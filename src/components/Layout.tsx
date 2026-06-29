import { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, LogOut, LayoutDashboard, Plus, FileText, Lock, CheckSquare } from "lucide-react";
import { getCurrentUser, logout } from "../services/auth";
import toast from "react-hot-toast";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate('/login');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'citizen': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'admin': return 'bg-blue/10 text-blue border-blue/20';
      case 'contractor': return 'bg-mint/10 text-mint border-mint/20';
      case 'auditor': return 'bg-amber/10 text-amber border-amber/20';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const renderNavLinks = () => {
    if (!user) return null;

    const isActive = (path: string) => location.pathname.startsWith(path) ? 'bg-slate-100 text-ink' : 'text-slate-500 hover:bg-slate-50 hover:text-ink';
    const linkClass = "px-3 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2";

    switch (user.role) {
      case 'citizen':
        return (
          <>
            <Link to="/create-case" className={`${linkClass} ${isActive('/create-case')}`}><Plus size={16} /> Create Case</Link>
          </>
        );
      case 'admin':
        return (
          <>
            <Link to="/dashboard" className={`${linkClass} ${isActive('/dashboard')}`}><LayoutDashboard size={16} /> Dashboard</Link>
            <Link to="/create-case" className={`${linkClass} ${isActive('/create-case')}`}><Plus size={16} /> Create Case</Link>
            <Link to="/reports" className={`${linkClass} ${isActive('/reports')}`}><FileText size={16} /> Reports</Link>
          </>
        );
      case 'contractor':
        return (
          <>
            <Link to="/contractor-task-list" className={`${linkClass} ${isActive('/contractor-task-list')}`}><CheckSquare size={16} /> My Tasks</Link>
          </>
        );
      case 'auditor':
        return (
          <>
            <Link to="/dashboard" className={`${linkClass} ${isActive('/dashboard')}`}><LayoutDashboard size={16} /> Dashboard</Link>
            <Link to="/reports" className={`${linkClass} ${isActive('/reports')}`}><FileText size={16} /> Reports</Link>
          </>
        );
      default:
        return null;
    }
  };

  const hideHeaderRoutes = ['/login', '/signup', '/'];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      {showHeader && (
        <header className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <Link to={user ? (user.role === 'citizen' ? '/create-case' : '/dashboard') : '/'} className="flex items-center gap-2 font-display font-extrabold text-xl text-ink">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-ink text-white shadow-sm">
                <ShieldCheck size={18} />
              </span>
              Civica
            </Link>
            <div className="h-6 w-px bg-slate-200 hidden md:block" />
            <nav className="hidden md:flex items-center gap-2">
              {renderNavLinks()}
            </nav>
          </div>

          {user && (
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-ink leading-tight">{user.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{user.email}</div>
                </div>
                <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${getRoleColor(user.role)}`}>
                  {user.role}
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-coral hover:bg-coral/10 rounded-full transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </header>
      )}
      
      {showHeader && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex overflow-x-auto gap-2">
           {renderNavLinks()}
        </div>
      )}

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
