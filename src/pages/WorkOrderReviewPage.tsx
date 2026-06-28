import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  ArrowLeft,
  MapPin, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Image as ImageIcon,
  CheckSquare,
  Lock,
  ChevronDown
} from "lucide-react";

export default function WorkOrderReviewPage() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="min-h-screen bg-[#FAFAFA] text-ink font-sans flex flex-col"
    >
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/create-case" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-muted hover:text-ink">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2 font-display font-bold text-lg text-ink">
            <span className="flex items-center justify-center w-6 h-6 rounded bg-ink text-white shadow-sm">
              <ShieldCheck size={14} />
            </span>
            Civica
          </div>
          <div className="h-4 w-px bg-slate-300 mx-2" />
          <span className="font-semibold text-slate-500 text-sm">Work Order Review</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-bold text-muted hover:text-ink px-4 py-2">Cancel</button>
          <button className="text-sm font-bold text-ink hover:text-violet px-4 py-2 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">Save Draft</button>
          <button onClick={() => navigate('/contractor-task')} className="px-5 py-2 rounded-full bg-violet-deep text-white font-bold text-sm shadow-md shadow-violet/20 hover:bg-violet transition-colors">
            Assign Verified Work Order
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 md:p-6 flex-1 w-full">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-extrabold">Review Work Order</h1>
            <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-mint/20 text-mint rounded-full border border-mint/20">
              <CheckCircle2 size={12} /> AI Verified
            </span>
            <span className="text-xs font-bold px-2.5 py-1 bg-coral/10 text-coral rounded-full border border-coral/10">
              High Priority
            </span>
          </div>
          <p className="text-sm text-muted font-medium mb-4">AI-generated repair task ready for assignment.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-5 mb-6">
          
          {/* Left Column: Issue Summary */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bento-card bg-white p-4">
              <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Issue Summary</h2>
              
              <div className="w-full h-24 bg-slate-100 rounded-xl mb-3 relative overflow-hidden group border border-slate-200">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center" />
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded backdrop-blur-sm">Before</div>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="text-xs text-slate-400 font-bold mb-1">Issue</div>
                  <div className="text-sm font-bold text-ink">Water leakage near Block B</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold mb-1">Category</div>
                  <div className="text-sm font-bold text-ink">Water & Sanitation</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold mb-1">Severity</div>
                  <div className="text-sm font-bold text-coral">High</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold mb-1">Location</div>
                  <div className="text-sm font-bold text-ink">Block B Service Road</div>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-400 font-bold mb-1">Reported by</div>
                  <div className="text-sm font-bold text-ink">Citizen App</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold mb-1">Created</div>
                  <div className="text-sm font-bold text-ink">Today, 11:42 AM</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-4">
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">GPS Verified</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">Strong Evidence</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-mint/10 text-mint rounded">No Duplicate</span>
              </div>
            </div>
          </div>

          {/* Center Column: Work Order Details */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bento-card bg-white p-5 h-full border border-slate-200">
              <div className="flex justify-between items-start mb-5 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-1">Work Order ID</h2>
                  <div className="text-2xl font-display font-extrabold text-ink">WO-2026-0184</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-400 mb-1">Priority Score</div>
                  <div className="text-2xl font-display font-extrabold text-violet">87<span className="text-slate-300 text-lg">/100</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">SLA Deadline</label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet/50 focus:border-violet appearance-none font-bold text-sm bg-slate-50 cursor-pointer">
                      <option>24 Hours (Urgent)</option>
                      <option>48 Hours</option>
                      <option>7 Days</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Department</label>
                  <div className="relative">
                    <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet/50 focus:border-violet appearance-none font-bold text-sm bg-slate-50 cursor-pointer">
                      <option>Water Maintenance</option>
                      <option>Roads</option>
                      <option>Electrical</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Required Action</label>
                  <input type="text" defaultValue="Inspect and repair suspected pipeline leakage" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet/50 focus:border-violet text-sm font-bold bg-slate-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Estimated Cost</label>
                  <input type="text" defaultValue="₹8,500" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet/50 focus:border-violet text-sm font-bold bg-slate-50" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 flex justify-between items-center">
                  <span>Repair Instructions</span>
                  <span className="text-mint text-[9px] flex items-center gap-1 bg-mint/10 px-1.5 py-0.5 rounded"><ShieldCheck size={10} /> AI Generated</span>
                </label>
                <textarea 
                  rows={3} 
                  defaultValue="Inspect pipeline near Block B service road. Upload after-repair photo, 10-second video, GPS timestamp, and material usage details before closure." 
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet/50 focus:border-violet text-xs leading-relaxed bg-slate-50 resize-none font-medium" 
                />
              </div>
            </div>
          </div>

          {/* Right Column: Contractor & Payment */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Contractor Recommendation */}
            <div className="bento-card bg-white p-4 border-2 border-violet/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-violet text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg">Top Match</div>
              <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Suggested Contractor</h2>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-deep to-violet text-white flex items-center justify-center font-bold text-lg shadow-md">A</div>
                <div>
                  <div className="font-extrabold text-lg text-ink">AquaFix Services</div>
                  <div className="text-xs font-bold text-slate-500">Tier 1 Vendor</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 gap-x-2 mb-4">
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Contractor Score</div>
                  <div className="text-xs font-bold text-ink">4.6/5 <span className="text-amber">★</span></div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase">SLA Compliance</div>
                  <div className="text-xs font-bold text-mint">92%</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Repeat Failure</div>
                  <div className="text-xs font-bold text-ink">3.1%</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase">Avg Repair Time</div>
                  <div className="text-xs font-bold text-ink">18 hours</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-1.5 rounded-lg bg-violet-deep text-white font-bold text-xs hover:bg-violet transition-colors">Assign</button>
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 font-bold text-xs text-slate-500 hover:text-ink transition-colors">Compare</button>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="text-[9px] font-bold text-slate-400 uppercase mb-2">Alternate Contractors</div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs group cursor-pointer hover:bg-slate-50 p-1 rounded -mx-1">
                    <span className="font-bold text-slate-600 group-hover:text-ink">UrbanFlow Repairs</span>
                    <span className="font-bold text-slate-400">4.3/5</span>
                  </div>
                  <div className="flex justify-between items-center text-xs group cursor-pointer hover:bg-slate-50 p-1 rounded -mx-1">
                    <span className="font-bold text-slate-600 group-hover:text-ink">JalCare Works</span>
                    <span className="font-bold text-slate-400">4.1/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Assurance Panel */}
            <div className="bento-card bg-slate-900 text-white p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber/10 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between mb-3">
                <div className="text-[10px] font-bold text-amber uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={12} /> Payment Rule
                </div>
                <Lock size={12} className="text-slate-500" />
              </div>

              <p className="text-xs font-medium text-slate-300 mb-3">Payment will be released only after:</p>
              
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <CheckCircle2 size={14} className="text-slate-600" /> After-repair image uploaded
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <CheckCircle2 size={14} className="text-slate-600" /> GPS and timestamp verified
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <CheckCircle2 size={14} className="text-slate-600" /> AI repair confidence &gt; 80%
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <CheckCircle2 size={14} className="text-slate-600" /> Admin approval completed
                </li>
              </ul>

              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400">Payment Mode</span>
                  <span className="text-xs font-bold bg-amber/10 text-amber px-2 py-0.5 rounded">Conditional Release</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Current Status</span>
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1"><Lock size={10}/> Locked</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Bottom Timeline */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 relative z-10 mt-auto">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1 w-full overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center text-[11px] font-bold tracking-wide">
              <span className="flex items-center gap-1.5 text-mint whitespace-nowrap"><CheckSquare size={14}/> Reported</span>
              <div className="w-6 h-px bg-mint mx-2 shrink-0" />
              <span className="flex items-center gap-1.5 text-mint whitespace-nowrap"><CheckSquare size={14}/> AI Reviewed</span>
              <div className="w-6 h-px bg-mint mx-2 shrink-0" />
              <span className="flex items-center gap-1.5 text-violet whitespace-nowrap bg-violet/10 px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-violet animate-pulse" /> Work Order Created</span>
              <div className="w-6 h-px bg-slate-200 mx-2 shrink-0" />
              <span className="text-slate-400 whitespace-nowrap">Contractor Assigned</span>
              <div className="w-6 h-px bg-slate-200 mx-2 shrink-0" />
              <span className="text-slate-400 whitespace-nowrap">Repair Uploaded</span>
              <div className="w-6 h-px bg-slate-200 mx-2 shrink-0" />
              <span className="text-slate-400 whitespace-nowrap">AI Verified</span>
              <div className="w-6 h-px bg-slate-200 mx-2 shrink-0" />
              <span className="text-slate-400 whitespace-nowrap">Payment Released</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="px-3 py-1.5 rounded-full border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors hidden sm:block">Edit</button>
            <button onClick={() => navigate('/contractor-task')} className="px-4 py-1.5 rounded-full bg-violet-deep text-white font-bold text-xs shadow-md shadow-violet/20 hover:bg-violet transition-colors">
              Assign Verified Work Order
            </button>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
