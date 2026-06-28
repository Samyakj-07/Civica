import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
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
import { getWorkOrderById, getIssueById, MOCK_CONTRACTORS, updateWorkOrder, updateWorkOrderStatus } from "../services/api";
import { WorkOrder, Issue } from "../types";

export default function ContractorTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [issue, setIssue] = useState<Issue | null>(null);

  // State
  const [checklist, setChecklist] = useState<boolean[]>(Array(8).fill(false));
  const [file, setFile] = useState<File | null>(null);
  const [afterRepairImageUrl, setAfterRepairImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  const [materialNotes, setMaterialNotes] = useState('');
  const [completionNotes, setCompletionNotes] = useState('');

  useEffect(() => {
    if (id) {
      const wo = getWorkOrderById(id);
      if (wo) {
        setWorkOrder(wo);
        
        // Hydrate from localStorage
        if (wo.checklistState) setChecklist(wo.checklistState);
        if (wo.afterRepairImageUrl) {
          setAfterRepairImageUrl(wo.afterRepairImageUrl);
          setUploadComplete(true);
        }
        if (wo.materialNotes) setMaterialNotes(wo.materialNotes);
        if (wo.completionNotes) setCompletionNotes(wo.completionNotes);

        const parentIssue = getIssueById(wo.issueId);
        if (parentIssue) {
          setIssue(parentIssue);
        }
      }
    }
  }, [id]);

  const handleToggleChecklist = (index: number) => {
    const newChecklist = [...checklist];
    newChecklist[index] = !newChecklist[index];
    setChecklist(newChecklist);
    
    if (workOrder) {
      updateWorkOrder(workOrder.id, { checklistState: newChecklist });
    }
  };

  const saveNotes = () => {
    if (workOrder) {
      updateWorkOrder(workOrder.id, { materialNotes, completionNotes });
      toast.success("Progress saved.");
    }
  };

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
      const imgUrl = URL.createObjectURL(uploadedFile);
      setIsUploading(false);
      setUploadComplete(true);
      setAfterRepairImageUrl(imgUrl);
      
      if (workOrder) {
        updateWorkOrder(workOrder.id, { afterRepairImageUrl: imgUrl });
      }
      
      // Auto check the photo uploaded steps
      const newChecklist = [...checklist];
      newChecklist[4] = true;
      newChecklist[6] = true;
      setChecklist(newChecklist);
      if (workOrder) {
        updateWorkOrder(workOrder.id, { checklistState: newChecklist });
      }
      
      toast.success("Repair proof verified locally");
    }, 2000);
  };

  const handleSubmitProof = () => {
    if (workOrder) {
      updateWorkOrderStatus(workOrder.id, 'Repair Uploaded');
      toast.success("Repair proof uploaded successfully.");
      navigate(`/ai-verification/${workOrder.id}`);
    }
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
  
  const checklistLabels = [
    "Inspect reported location",
    "Confirm issue matches evidence",
    "Complete required repair",
    "Clean repair area",
    "Upload after-repair photo",
    "Upload 10-second video",
    "Confirm GPS timestamp",
    "Add material usage note"
  ];
  
  const completedSteps = checklist.filter(Boolean).length;

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
          <Link to={`/work-order/${workOrder.id}`} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-muted hover:text-ink">
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
          <button onClick={saveNotes} className="text-sm font-bold text-ink hover:text-violet px-4 py-2 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
            Save Progress
          </button>
          <button 
            disabled={!uploadComplete}
            onClick={handleSubmitProof}
            className={`px-5 py-2 rounded-full font-bold text-sm shadow-md transition-colors ${uploadComplete ? 'bg-violet-deep text-white shadow-violet/20 hover:bg-violet' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
          >
            Submit for AI Verification
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-4 md:p-6 flex-1 w-full">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-extrabold">Assigned Repair Task</h1>
            <span className="text-xs font-bold px-2.5 py-1 bg-violet/10 text-violet rounded-full border border-violet/10">
              Contractor Assigned
            </span>
            <span className="text-xs font-bold px-2.5 py-1 bg-mint/10 text-mint rounded-full border border-mint/10">
              SLA Active
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 bg-coral/10 text-coral rounded-full border border-coral/10">
              High Priority
            </span>
          </div>
          <p className="text-sm text-muted font-medium mb-4">Complete the repair and upload verified proof for AI assurance.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-5 mb-6">
          
          {/* Left Column: Task Summary */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bento-card bg-white p-4 border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400">Task Summary</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-mint/10 text-mint rounded">{workOrder.status}</span>
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
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Work Order ID</div>
                  <div className="text-sm font-bold text-violet">{workOrder.workOrderId}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Issue Title</div>
                  <div className="text-sm font-bold text-ink">{issue.title}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Category</div>
                    <div className="text-sm font-bold text-ink truncate" title={issue.category}>{issue.category}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Severity</div>
                    <div className="text-sm font-bold text-coral">{issue.severity}</div>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Location</div>
                  <div className="text-sm font-bold text-ink flex items-center gap-1"><MapPin size={12} className="text-coral shrink-0" /> <span className="truncate">{issue.location}</span></div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Assigned To</div>
                  <div className="text-sm font-bold text-ink">{assignedContractor.name}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-wider">SLA Deadline</div>
                  <div className="text-sm font-bold text-coral flex items-center gap-1"><Clock size={12} /> {workOrder.slaDeadline}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold mb-0.5 uppercase tracking-wider">Estimated Cost</div>
                  <div className="text-sm font-bold text-mint">{workOrder.estimatedCost}</div>
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
                <div className="text-xs font-bold text-violet bg-violet/10 px-2 py-1 rounded">{completedSteps}/8 steps completed</div>
              </div>
              
              <div className="space-y-2.5">
                {checklistLabels.map((label, idx) => {
                  const checked = checklist[idx];
                  return (
                    <div 
                      key={idx} 
                      onClick={() => handleToggleChecklist(idx)}
                      className={`flex items-start gap-3 p-2 rounded-lg transition-colors cursor-pointer select-none ${checked ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${checked ? 'bg-mint border-mint text-white' : 'border-slate-300'}`}>
                        {checked && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <span className={`text-sm font-medium transition-colors ${checked ? 'text-slate-400 line-through' : 'text-ink'}`}>{label}</span>
                    </div>
                  );
                })}
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
                className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all duration-300 mb-4 ${afterRepairImageUrl ? 'border-mint bg-mint/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-violet/30'}`}
              >
                <input 
                  type="file" 
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                
                <AnimatePresence mode="wait">
                  {!afterRepairImageUrl && !isUploading && (
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
                  
                  {isUploading && (
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

                  {afterRepairImageUrl && !isUploading && (
                    <motion.div 
                      key="complete"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center pointer-events-none w-full relative h-32 rounded-lg overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${afterRepairImageUrl})` }} />
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="relative z-10 flex flex-col items-center justify-center h-full">
                        <div className="w-10 h-10 rounded-full bg-mint/20 backdrop-blur flex items-center justify-center text-mint mb-2">
                          <CheckCircle2 size={20} />
                        </div>
                        <p className="font-bold text-white mb-1 text-sm drop-shadow">Repair proof uploaded</p>
                        <p className="text-[10px] text-white/80 drop-shadow">Click to replace</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Material usage notes</label>
                  <textarea 
                    value={materialNotes}
                    onChange={(e) => setMaterialNotes(e.target.value)}
                    onBlur={saveNotes}
                    rows={2} 
                    placeholder="E.g., 2 bags of concrete, 1 patch kit..." 
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet/50 focus:border-violet text-sm bg-slate-50 resize-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Repair completion note</label>
                  <textarea 
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    onBlur={saveNotes}
                    rows={2} 
                    placeholder="Details about the fix performed..." 
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet/50 focus:border-violet text-sm bg-slate-50 resize-none" 
                  />
                </div>
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

              <p className="text-xs font-medium text-slate-300 mb-3">Payment locked until verification is complete.</p>
              
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
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    {uploadComplete ? <span className="text-amber animate-pulse">Awaiting AI Verification</span> : <><Lock size={10}/> Locked</>}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400">Potential Release</span>
                  <span className="text-sm font-extrabold text-mint">{workOrder.estimatedCost}</span>
                </div>
                {uploadComplete ? (
                  <div className="pt-2 mt-2 border-t border-slate-700 text-[10px] text-mint font-bold text-center">
                    Evidence Uploaded
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
            <button onClick={saveNotes} className="px-4 py-1.5 rounded-full border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 transition-colors hidden sm:block">
              Save Progress
            </button>
            <button 
              disabled={!uploadComplete}
              onClick={handleSubmitProof}
              className={`px-4 py-1.5 rounded-full font-bold text-xs shadow-md transition-colors ${uploadComplete ? 'bg-violet-deep text-white shadow-violet/20 hover:bg-violet' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'}`}
            >
              Submit for AI Verification
            </button>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
