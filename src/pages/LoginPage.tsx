import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, User, Shield, HardHat, FileSearch, ArrowLeft, Loader2 } from "lucide-react";
import { login, DEMO_USERS, isAuthenticated, getRoleHomeRoute } from "../services/auth";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = login(email, password);
    setIsLoading(false);
    
    if (user) {
      toast.success(`Signed in as ${user.role}`);
      navigate(getRoleHomeRoute(user.role));
    } else {
      toast.error("Invalid credentials.");
    }
  };

  const handleDemoLogin = async (emailToUse: string) => {
    setEmail(emailToUse);
    setPassword("123456");
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = login(emailToUse, "123456");
    setIsLoading(false);
    
    if (user) {
      toast.success(`Signed in as ${user.role}`);
      navigate(getRoleHomeRoute(user.role));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Left side: Brand/Hero */}
      <div className="hidden lg:flex w-1/2 bg-violet-deep text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)' }} />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 font-display font-extrabold text-2xl mb-16">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white text-violet-deep shadow-lg">
              <ShieldCheck size={24} />
            </span>
            Civica
          </div>
          
          <h1 className="text-5xl font-display font-extrabold leading-tight mb-6">
            Accountability built into every civic repair.
          </h1>
          <p className="text-violet-200 text-lg max-w-md font-medium leading-relaxed">
            Verify repairs, manage work orders, and track civic accountability in real-time with AI-powered assurance.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-4 text-violet-200 text-sm font-bold">
           <span>© 2026 Civica</span>
           <span>•</span>
           <span>Hackathon Demo</span>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-ink transition-colors">
          <ArrowLeft size={16} /> Back
        </Link>
        <div className="w-full max-w-md mt-8 lg:mt-0">
          <div className="lg:hidden flex items-center justify-center gap-2 font-display font-extrabold text-2xl mb-8 text-ink">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-deep text-white shadow-md">
              <ShieldCheck size={24} />
            </span>
            Civica
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-display font-extrabold text-ink mb-2">Welcome back</h2>
            <p className="text-slate-500 font-medium">Sign in to your Civica workspace.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 mb-8">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-violet focus:ring-2 focus:ring-violet/20 transition-all font-medium bg-white"
                placeholder="name@civica.ai"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-violet focus:ring-2 focus:ring-violet/20 transition-all font-medium bg-white"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 mt-4 bg-violet-deep text-white rounded-xl font-bold shadow-lg shadow-violet/20 hover:bg-violet transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Sign In"}
            </button>
          </form>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-50 text-slate-400 font-bold">Or try a demo account</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button type="button" onClick={() => handleDemoLogin("citizen@civica.ai")} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group">
               <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><User size={16} /></div>
               <div>
                 <div className="text-xs font-bold text-ink">Citizen</div>
                 <div className="text-[10px] text-slate-400">Report & track</div>
               </div>
             </button>
             <button type="button" onClick={() => handleDemoLogin("admin@civica.ai")} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-colors text-left group">
               <div className="w-8 h-8 rounded bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><Shield size={16} /></div>
               <div>
                 <div className="text-xs font-bold text-ink">Admin</div>
                 <div className="text-[10px] text-slate-400">Manage orders</div>
               </div>
             </button>
             <button type="button" onClick={() => handleDemoLogin("contractor@civica.ai")} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-colors text-left group">
               <div className="w-8 h-8 rounded bg-green-100 text-green-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><HardHat size={16} /></div>
               <div>
                 <div className="text-xs font-bold text-ink">Contractor</div>
                 <div className="text-[10px] text-slate-400">Execute tasks</div>
               </div>
             </button>
             <button type="button" onClick={() => handleDemoLogin("auditor@civica.ai")} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-colors text-left group">
               <div className="w-8 h-8 rounded bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><FileSearch size={16} /></div>
               <div>
                 <div className="text-xs font-bold text-ink">Auditor</div>
                 <div className="text-[10px] text-slate-400">Approve payouts</div>
               </div>
             </button>
          </div>

          <p className="mt-8 text-center text-xs text-slate-400 font-medium">
            Demo credentials are provided for hackathon judging.
            <br />
            Need a custom account? <Link to="/signup" className="text-violet font-bold hover:underline">Sign up</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
