import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  ArrowLeft, 
  UploadCloud, 
  MapPin, 
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Layers,
  Clock,
  Users,
  Zap,
  ThumbsUp
} from "lucide-react";
import toast from "react-hot-toast";
import { Issue, AIAnalysis } from "../types";
import { analyzeIssue, generateIssueId, saveIssue, createWorkOrderFromIssue } from "../services/api";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function CreateCasePage() {
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("Medium");
  
  // File & Analysis State
  const [file, setFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);

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

  const startUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsScanning(true);
    
    // Simulate AI scanning and analyze issue
    const mockIssuePartial = { title, category, description, urgency };
    const analysis = await analyzeIssue(mockIssuePartial);
    
    setAiAnalysis(analysis);
    setIsScanning(false);
    setScanComplete(true);
  };

  const handleCreateWorkOrder = () => {
    if (!aiAnalysis) return;

    const issueId = generateIssueId();
    const newIssue: Issue = {
      id: issueId,
      title: title || 'Untitled Issue',
      category: category || aiAnalysis.category,
      description,
      urgency,
      severity: aiAnalysis.severity,
      location: 'Auto-detected: Block B, Sector 4',
      reportedBy: 'Citizen App',
      createdAt: new Date().toISOString(),
      beforeImageUrl: file ? URL.createObjectURL(file) : '',
      status: 'Reported',
      aiAnalysis
    };

    saveIssue(newIssue);
    const workOrder = createWorkOrderFromIssue(newIssue, aiAnalysis);
    
    toast.success("Work Order successfully created!");
    
    // Navigate to the newly created work order
    navigate(`/work-order/${workOrder.id}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#FAFAFA] text-ink font-sans flex flex-col"
    >
      {/* Navbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-muted hover:text-ink">
            <ArrowLeft size={20} />
          </Link>
          <span className="font-semibold text-slate-500 text-sm">Issue Intake</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-bold text-muted hover:text-ink px-4 py-2">Cancel</button>
          <button 
            disabled={!scanComplete}
            onClick={handleCreateWorkOrder}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
              scanComplete 
                ? 'bg-violet-deep text-white shadow-md shadow-violet/20 hover:bg-violet' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            {scanComplete ? 'Create Verified Work Order' : 'Create Work Order'}
          </button>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto p-4 md:p-6 flex-1 w-full">
        <div className="mb-4">
          <h1 className="text-2xl font-display font-extrabold mb-1">Create Civic Case</h1>
          <p className="text-sm text-muted font-medium mb-4">Upload issue evidence to generate an AI-verified work order.</p>
          
          {/* Progress Stepper */}
          <div className="flex items-center gap-3 text-sm font-bold overflow-x-auto pb-2">
            <span className="flex items-center gap-2 text-violet whitespace-nowrap"><span className="w-6 h-6 rounded-full bg-violet text-white flex items-center justify-center text-xs">1</span> Intake</span>
            <span className="w-12 h-px bg-slate-300 shrink-0" />
            <span className="flex items-center gap-2 text-slate-400 whitespace-nowrap"><span className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-xs">2</span> AI Analysis</span>
            <span className="w-12 h-px bg-slate-300 shrink-0" />
            <span className="flex items-center gap-2 text-slate-400 whitespace-nowrap"><span className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-xs">3</span> Work Order</span>
            <span className="w-12 h-px bg-slate-300 shrink-0" />
            <span className="flex items-center gap-2 text-slate-400 whitespace-nowrap"><span className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-xs">4</span> Payment Assurance</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-5">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bento-card bg-white p-5">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-violet/10 text-violet flex items-center justify-center text-xs">1</span>
                Issue Details
              </h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Issue Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Water leakage near Block B" 
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet/50 focus:border-violet transition-all bg-slate-50 text-sm" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet/50 focus:border-violet transition-all bg-slate-50 text-slate-700 text-sm"
                  >
                    <option value="">Select Category...</option>
                    <option value="Water & Sanitation">Water & Sanitation</option>
                    <option value="Roads & Transport">Roads & Transport</option>
                    <option value="Electrical & Lighting">Electrical & Lighting</option>
                    <option value="Waste Management">Waste Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description (Optional)</label>
                  <textarea 
                    rows={2} 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add any specific details..." 
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet/50 focus:border-violet transition-all bg-slate-50 resize-none text-sm" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Urgency Level</label>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map(level => (
                      <button 
                        key={level} 
                        onClick={() => setUrgency(level)}
                        className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-colors ${
                          urgency === level 
                            ? 'border-violet bg-violet/5 text-violet' 
                            : 'border-slate-200 text-muted hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Column: Upload & Map */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bento-card bg-white p-5">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-violet/10 text-violet flex items-center justify-center text-xs">2</span>
                Evidence
              </h2>
              
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${file ? 'border-mint bg-mint/5' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-violet/30'}`}
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
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-violet mb-3">
                        <UploadCloud size={20} />
                      </div>
                      <p className="font-bold text-sm text-ink mb-1">Upload Evidence</p>
                      <p className="text-xs text-muted mb-4">Photo, video, or field proof</p>
                      
                      <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded shadow-sm">Image</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded shadow-sm">Video</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded shadow-sm">GPS</span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded shadow-sm">Timestamp</span>
                      </div>
                      
                      <p className="text-[10px] text-slate-400 max-w-[200px] leading-tight">
                        AI will scan: category &bull; severity &bull; location &bull; duplicate risk
                      </p>
                    </motion.div>
                  )}
                  
                  {file && isScanning && (
                    <motion.div 
                      key="scanning"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center pointer-events-none"
                    >
                      <Loader2 size={32} className="text-violet animate-spin mb-4" />
                      <p className="font-bold text-violet mb-1">AI Scanning...</p>
                      <p className="text-sm text-muted">Analyzing image metadata and visual damage.</p>
                    </motion.div>
                  )}

                  {file && scanComplete && (
                    <motion.div 
                      key="complete"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center pointer-events-none w-full"
                    >
                      <div className="w-full h-32 rounded-lg bg-slate-200 mb-4 overflow-hidden relative">
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: file.type.startsWith('image/') ? `url(${URL.createObjectURL(file)})` : 'none' }}>
                          {!file.type.startsWith('image/') && <div className="w-full h-full flex items-center justify-center text-slate-400"><UploadCloud size={32} /></div>}
                        </div>
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1"><CheckCircle2 size={12} className="text-mint"/> AI Scan Complete</div>
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">Confidence: 91%</div>
                      </div>
                      <p className="font-bold text-ink mb-1 truncate max-w-full w-full px-4 text-center">{file.name}</p>
                      <p className="text-sm text-mint font-bold flex items-center justify-center gap-1"><CheckCircle2 size={14}/> Evidence Verified</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="bento-card bg-white p-5">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <MapPin size={16} className="text-muted" /> Location
                </h2>
                {scanComplete && <span className="text-[10px] font-bold px-2 py-0.5 bg-violet/10 text-violet rounded">Auto-detected</span>}
              </div>
              <div className="w-full h-28 bg-slate-100 rounded-xl relative overflow-hidden flex items-center justify-center group mb-3">
                {/* Fake map background using CSS pattern */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                
                {scanComplete ? (
                  <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative z-10 flex flex-col items-center"
                  >
                    <MapPin size={32} className="text-coral drop-shadow-lg" />
                    <div className="mt-2 bg-white px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold">Block B, Sector 4</div>
                  </motion.div>
                ) : (
                  <span className="text-sm font-bold text-slate-400 relative z-10">Upload image to detect location</span>
                )}
              </div>
              
              {scanComplete && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1.5 pt-2 border-t border-slate-100"
                >
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Asset Linked</span>
                    <span className="font-bold text-violet">Pipeline Zone P-12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Nearby Reports</span>
                    <span className="font-bold">2</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Duplicate Match</span>
                    <span className="font-bold text-mint">No</span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column: AI DNA Preview */}
          <div className="lg:col-span-4">
            <div className="bento-card bg-slate-900 text-white p-5 h-full relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 w-48 h-48 bg-violet/20 rounded-full blur-3xl mix-blend-screen" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-mint/10 rounded-full blur-3xl mix-blend-screen" />
              
              <div className="relative z-10 mb-4 flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-bold text-violet uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ShieldCheck size={12} /> AI Issue DNA
                  </div>
                  <h2 className="text-lg font-bold">Analysis Preview</h2>
                </div>
                {scanComplete && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-mint/20 text-mint rounded-full border border-mint/20"
                  >
                    <CheckCircle2 size={12} /> Verified
                  </motion.span>
                )}
              </div>

              <div className="relative z-10 flex-1 flex flex-col justify-center">
                {!file && !scanComplete && (
                  <div className="text-center text-slate-400">
                    <ImageIcon size={32} className="mx-auto mb-4 opacity-50" />
                    <p className="text-sm font-bold text-white mb-1">Awaiting evidence upload</p>
                    <p className="text-xs font-medium mb-6">AI will generate a complete analysis:</p>
                    
                    <div className="space-y-3 opacity-30 text-left pointer-events-none">
                      <DNAField icon={<Layers size={14} />} label="Category" value="--" />
                      <DNAField icon={<AlertTriangle size={14} />} label="Severity" value="--" />
                      <DNAField icon={<MapPin size={14} />} label="Location Confidence" value="--" />
                      <DNAField icon={<ShieldCheck size={14} />} label="Duplicate Risk" value="--" />
                      <DNAField icon={<Clock size={14} />} label="Suggested SLA" value="--" />
                      <DNAField icon={<Users size={14} />} label="Responsible Team" value="--" />
                    </div>
                  </div>
                )}

                {isScanning && (
                  <div className="space-y-4 w-full">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-full bg-slate-800/50 rounded-lg animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                )}

                {scanComplete && aiAnalysis && (
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="space-y-2"
                  >
                    <DNAField icon={<ShieldCheck size={14} />} label="Detected Issue" value={aiAnalysis.detectedIssue} color="text-mint" />
                    <DNAField icon={<Layers size={14} />} label="Category" value={aiAnalysis.category} />
                    <DNAField icon={<AlertTriangle size={14} />} label="Severity" value={aiAnalysis.severity} color={aiAnalysis.severity === 'High' ? 'text-coral' : 'text-amber'} />
                    <DNAField icon={<MapPin size={14} />} label="Location Confidence" value={aiAnalysis.locationConfidence} />
                    <DNAField icon={<ShieldCheck size={14} />} label="Duplicate Risk" value={aiAnalysis.duplicateRisk} />
                    <DNAField icon={<ThumbsUp size={14} />} label="Evidence Strength" value={aiAnalysis.evidenceStrength} color="text-mint" />
                    <DNAField icon={<Clock size={14} />} label="Suggested SLA" value={aiAnalysis.suggestedSLA} />
                    <DNAField icon={<Users size={14} />} label="Responsible Team" value={aiAnalysis.responsibleTeam} />
                    <DNAField icon={<Zap size={14} />} label="Recommended Action" value="Generated dynamically" color="text-amber" />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </motion.div>
  );
}

function DNAField({ icon, label, value, color = "text-white" }: { icon: React.ReactNode, label: string, value: string, color?: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
      }}
      className="flex justify-between items-center px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 text-xs text-slate-300">
        <span className="opacity-70">{icon}</span>
        {label}
      </div>
      <div className={`text-xs font-bold ${color} text-right truncate max-w-[150px]`} title={value}>{value}</div>
    </motion.div>
  );
}
