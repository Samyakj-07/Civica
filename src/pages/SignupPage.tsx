import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import { registerUser, login, getRoleHomeRoute } from "../services/auth";
import { Role } from "../types";
import toast from "react-hot-toast";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("citizen");
  const [contractorName, setContractorName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser = {
      name,
      email,
      password,
      role,
      ...(role === 'contractor' ? { contractorName } : {})
    };

    registerUser(newUser);
    login(email, password);
    
    setIsLoading(false);
    toast.success("Account created successfully!");
    navigate(getRoleHomeRoute(role));
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center p-6 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-deep text-white shadow-md mb-4">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-display font-extrabold text-ink">Create an Account</h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Join the Civica demo platform</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-violet focus:ring-2 focus:ring-violet/20"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-violet focus:ring-2 focus:ring-violet/20"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-violet focus:ring-2 focus:ring-violet/20"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-violet focus:ring-2 focus:ring-violet/20 bg-white"
            >
              <option value="citizen">Citizen (Report Issues)</option>
              <option value="admin">Admin (Manage Orders)</option>
              <option value="contractor">Contractor (Execute Tasks)</option>
              <option value="auditor">Auditor (Approve Payouts)</option>
            </select>
          </div>
          
          {role === 'contractor' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 mt-4">Company Name</label>
              <input 
                type="text" 
                required
                value={contractorName}
                onChange={e => setContractorName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-violet focus:ring-2 focus:ring-violet/20"
                placeholder="AquaFix Services"
              />
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 mt-6 bg-violet-deep text-white rounded-lg font-bold shadow-md shadow-violet/20 hover:bg-violet transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 font-medium">
          Already have an account? <Link to="/login" className="text-violet font-bold hover:underline">Log in</Link>
        </p>

      </div>
    </div>
  );
}
