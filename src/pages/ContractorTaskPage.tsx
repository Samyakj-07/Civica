import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { 
  ShieldCheck, 
  ArrowLeft,
  MapPin, 
  CheckCircle2,
  Clock,
  UploadCloud,
  CheckSquare,
  Lock,
  Camera,
  Video,
  FileText,
  Loader2
} from "lucide-react";
import toast from "react-hot-toast";
import { getWorkOrderById, getIssueById, MOCK_CONTRACTORS } from "../services/api";
import { WorkOrder, Issue } from "../types";

export default function ContractorTaskPage() {
  const { id } = useParams<{ id: string }>();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [issue, setIssue] = useState<Issue | null>(null);

  useEffect(() => {
    if (id) {
      const wo = getWorkOrderById(id);
      if (wo) {
        setWorkOrder(wo);
        const parentIssue = getIssueById(wo.issueId);
        if (parentIssue) {
          setIssue(parentIssue);
        }
      }
    }
  }, [id]);

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startUpload(e.target.files[0]);
    }
  };

  const startUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      toast.success("Repair proof verified by AI");
    }, 2000);
  };

  const handleSubmitProof = () => {
    toast.success("Payment conditionally released!");
    // You could also navigate back to dashboard or show a completion modal here
  };

  if (!workOrder || !issue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center text-slate-500">
          <Loader2 size={32} className="animate-spin mx-auto mb-4" />
          <p>Loading Task...</p>
        </div>
      </div>
    );
  }

  const assignedContractor = workOrder.assignedContractor || MOCK_CONTRACTORS[0];

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
          <Link to="/work-order" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-muted hover:text-ink">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2 font-display font-bold text-lg text-ink">
            <span className="flex items-center justify-center w-6 h-6 rounded bg-ink text-white shadow-sm">
              <ShieldCheck size={14} />
            </span>
            Civica
          </div>
          <div className="h-4 w-px bg-slate-300 mx-2" />
          <span className="font-semibold text-slate-500 text-sm">Contractor Task</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-bold text-slate-500 px-4 py-2 pointer-events-none flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-mint" /> Task Accepted
          </button>
          <button 
            disabled={!uploadComplete}
            onClick={handleSubmitProof}
            className={`px-5 py-2 rounded-full font-bold text-sm shadow-md transition-colors ${uploadComplete ? 'bg-violet-deep text-white shadow-violet/20 hover:bg-violet' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
          >
            Submit Verified Proof
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 md:p-6 flex-1 w-full">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-extrabold">Assigned Repair Task</h1>
            <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-coral/10 text-coral rounded-full border border-coral/10">
              High Priority
            </span>
          </div>
          <p className="text-sm text-muted font-medium mb-4">Complete the work and upload verified repair proof.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-5 mb-6">
          
          {/* Left Column: Task Summary */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Technician Card */}
            <div className="bento-card bg-white p-4 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop" alt="Technician" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{assignedContractor.name}</div>
                  <div className="text-sm font-extrabold text-ink">Assigned Tech</div>
                </div>
              </div>
            </div>

            <div className="bento-card bg-white p-4 border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400">Task Summary</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-mint/10 text-mint rounded">In Progress</span>
              </div>
              
              <div className="w-full h-24 bg-slate-100 rounded-xl mb-4 relative overflow-hidden group border border-slate-200">
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{ backgroundImage: issue.beforeImageUrl ? `url(${issue.beforeImageUrl})` : `url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop')` }} 
                />
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded backdrop-blur-sm">Before</div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Work Order</div>
                  <div className="text-sm font-bold text-violet">{workOrder.workOrderId}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Issue</div>
                  <div className="text-sm font-bold text-ink">{issue.title}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Location</div>
                  <div className="text-sm font-bold text-ink flex items-center gap-1"><MapPin size={12} className="text-coral" /> {issue.location}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Deadline</div>
                  <div className="text-sm font-bold text-coral flex items-center gap-1"><Clock size={12} /> {workOrder.slaDeadline}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Estimated Cost</div>
                  <div className="text-sm font-bold text-ink">{workOrder.estimatedCost}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: Repair Checklist + Upload */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Checklist */}
            <div className="bento-card bg-white p-5 border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 flex items-center gap-2">
                  <CheckSquare size={16} /> Repair Checklist
                </h2>
                <div className="text-xs font-bold text-violet bg-violet/10 px-2 py-1 rounded">3/8 steps completed</div>
              </div>
              
              <div className="space-y-2.5">
                {[
                  { label: workOrder.repairInstructions.split('.')[0] || "Follow repair instructions", checked: true },
                  { label: "Stop active issue spread", checked: true },
                  { label: "Replace damaged section if required", checked: true },
                  { label: "Clean repair area", checked: false },
                  { label: "Upload after-repair photo", checked: uploadComplete },
                  { label: "Upload 10-second video", checked: uploadComplete },
                  { label: "Confirm GPS timestamp", checked: uploadComplete },
                  { label: "Add material usage notes", checked: false },
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${item.checked ? 'bg-slate-50' : 'hover:bg-slate-50'}`}>
                    <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${item.checked ? 'bg-mint border-mint text-white' : 'border-slate-300'}`}>
                      {item.checked && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <span className={`text-sm font-medium ${item.checked ? 'text-slate-400 line-through' : 'text-ink'}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Area */}
            <div className="bento-card bg-white p-5 border border-slate-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-1">Upload Repair Proof</h2>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1"><Camera size={10} /> After photo</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1"><Video size={10} /> Short video</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1"><MapPin size={10} /> GPS tag</span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-1"><FileText size={10} /> Materials</span>
                  </div>
                </div>
              </div>

              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all duration-300 ${file ? 'border-mint bg-mint/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-violet/30'}`}
              >
                <input 
                  type="file" 
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                
                <AnimatePresence mode="wait">
                  {!file && (
                    <motion.div 
                      key="upload"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center pointer-events-none"
                    >
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-violet mb-2">
                        <UploadCloud size={20} />
                      </div>
                      <p className="font-bold text-sm text-ink mb-1">Drop after-repair evidence here</p>
                      <p className="text-[10px] text-slate-400 leading-tight">Click or drag to upload media</p>
                    </motion.div>
                  )}
                  
                  {file && isUploading && (
                    <motion.div 
                      key="scanning"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center pointer-events-none"
                    >
                      <div className="w-8 h-8 border-2 border-violet border-t-transparent rounded-full animate-spin mb-3" />
                      <p className="font-bold text-sm text-violet mb-1">Uploading proof...</p>
                      <p className="text-xs text-muted">Encrypting GPS and timestamp data.</p>
                    </motion.div>
                  )}

                  {file && uploadComplete && (
                    <motion.div 
                      key="complete"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center pointer-events-none w-full"
                    >
                      <div className="w-12 h-12 rounded-full bg-mint/10 flex items-center justify-center text-mint mb-3">
                        <CheckCircle2 size={24} />
                      </div>
                      <p className="font-bold text-mint mb-1 text-sm">Repair proof uploaded</p>
                      <p className="text-xs text-muted mb-2">Ready for AI verification</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Assurance & Score */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Payment Assurance Lock */}
            <div className="bento-card bg-slate-900 text-white p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber/10 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
              
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className="text-[10px] font-bold text-amber uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={12} /> Payment Assurance
                </div>
                <Lock size={12} className="text-slate-500" />
              </div>

              <p className="text-xs font-medium text-slate-300 mb-3">Payment locked until:</p>
              
              <ul className="space-y-2 mb-5">
                <li className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <CheckCircle2 size={14} className={uploadComplete ? "text-mint" : "text-slate-600"} /> After-repair image uploaded
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <CheckCircle2 size={14} className={uploadComplete ? "text-mint" : "text-slate-600"} /> GPS timestamp captured
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <CheckCircle2 size={14} className="text-slate-600" /> Same-location match confirmed
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
                  <span className="text-xs font-bold text-slate-400">Payment Status</span>
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1"><Lock size={10}/> Locked</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400">Potential Release</span>
                  <span className="text-sm font-extrabold text-mint">{workOrder.estimatedCost}</span>
                </div>
                {uploadComplete ? (
                  <div className="pt-2 mt-2 border-t border-slate-700 text-[10px] text-amber font-bold text-center">
                    Pending AI Verification
                  </div>
                ) : (
                  <div className="pt-2 mt-2 border-t border-slate-700 text-[10px] text-slate-400 font-bold text-center">
                    Verification Required
                  </div>
                )}
              </div>
            </div>

            {/* Contractor Score Impact */}
            <div className="bento-card bg-white p-5 border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-3">Score Impact</h2>
              
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-600">Current Score</span>
                <span className="text-lg font-extrabold text-ink">{assignedContractor.contractorScore}<span className="text-sm text-slate-400">/5</span></span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">On-time completion</span>
                  <span className="font-bold text-mint bg-mint/10 px-2 py-0.5 rounded">+0.1</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Late submission</span>
                  <span className="font-bold text-coral bg-coral/10 px-2 py-0.5 rounded">-0.2</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500">Rework required</span>
                  <span className="font-bold text-coral bg-coral/10 px-2 py-0.5 rounded">-0.4</span>
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
              <span className="flex items-center gap-1.5 text-mint whitespace-nowrap"><CheckSquare size={14}/> Work Order Created</span>
              <div className="w-6 h-px bg-mint mx-2 shrink-0" />
              {!uploadComplete ? (
                <span className="flex items-center gap-1.5 text-violet whitespace-nowrap bg-violet/10 px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-violet animate-pulse" /> Contractor Assigned</span>
              ) : (
                <span className="flex items-center gap-1.5 text-mint whitespace-nowrap"><CheckSquare size={14}/> Contractor Assigned</span>
              )}
              
              <div className={`w-6 h-px mx-2 shrink-0 ${uploadComplete ? 'bg-mint' : 'bg-slate-200'}`} />
              
              {uploadComplete ? (
                <span className="flex items-center gap-1.5 text-violet whitespace-nowrap bg-violet/10 px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-violet animate-pulse" /> Repair Uploaded</span>
              ) : (
                <span className="text-slate-400 whitespace-nowrap">Repair Uploaded</span>
              )}

              <div className="w-6 h-px bg-slate-200 mx-2 shrink-0" />
              <span className="text-slate-400 whitespace-nowrap">AI Verified</span>
              <div className="w-6 h-px bg-slate-200 mx-2 shrink-0" />
              <span className="text-slate-400 whitespace-nowrap">Payment Released</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="px-4 py-1.5 rounded-full border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors hidden sm:block">Need Help?</button>
            <button 
              disabled={!uploadComplete}
              onClick={handleSubmitProof}
              className={`px-4 py-1.5 rounded-full font-bold text-xs shadow-md transition-colors ${uploadComplete ? 'bg-violet-deep text-white shadow-violet/20 hover:bg-violet' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
            >
              Submit Verified Proof
            </button>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
