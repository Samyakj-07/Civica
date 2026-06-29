import { Navigate } from "react-router-dom";
import { isAuthenticated, getCurrentUser, hasRole } from "../services/auth";
import { Role } from "../types";
import { ShieldAlert, ArrowRight, LogOut } from "lucide-react";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const navigate = useNavigate();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    const user = getCurrentUser();
    
    const handleLogout = () => {
      logout();
      navigate('/login');
    };

    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
          <ShieldAlert size={40} className="text-coral" />
        </div>
        <h1 className="text-3xl font-display font-extrabold text-ink mb-3">Access restricted</h1>
        <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
          You don't have permission to view this Civica workspace.
        </p>
        <div className="flex items-center gap-2 mb-8 bg-slate-100 px-4 py-2 rounded-full border border-slate-200">
          <span className="text-xs font-semibold text-slate-500">Current Role:</span>
          <span className="text-xs font-bold text-ink uppercase">{user?.role}</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 px-6 py-3 bg-blue-deep text-white rounded-full font-bold shadow-lg shadow-blue/20 hover:bg-blue transition-colors"
          >
            Go to my workspace <ArrowRight size={16} />
          </button>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-full font-bold shadow-sm hover:bg-slate-50 transition-colors"
          >
            <LogOut size={16} /> Switch account
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
