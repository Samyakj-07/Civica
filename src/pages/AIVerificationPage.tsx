import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle2,
  Lock,
  Loader2,
  AlertCircle,
  MapPin,
  Clock,
  User,
  Activity,
  CheckSquare,
  FileCheck,
  FileText
} from "lucide-react";
import toast from "react-hot-toast";
import { getWorkOrderById, getIssueById, verifyRepair, updateWorkOrderStatus, updateWorkOrder } from "../services/api";
import { WorkOrder, Issue, AIVerificationResult } from "../types";

export default function AIVerificationPage() {
  const { id } = useParams<{ id: string }>();
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
  const [issue, setIssue] = useState<Issue | null>(null);
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStep, setVerificationStep] = useState(0);
  const [result, setResult] = useState<AIVerificationResult | null>(null);

  useEffect(() => {
    if (id) {
      const wo = getWorkOrderById(id);
      if (wo) {
        setWorkOrder(wo);
        const parentIssue = getIssueById(wo.issueId);
        if (parentIssue) {
          setIssue(parentIssue);
        }

        // If already verified, load result immediately
        if (wo.verificationResult) {
          setResult(wo.verificationResult);
          setIsVerifying(false);
        } else {
          // Run AI Verification sequence
          runVerificationSequence(wo);
        }
      }
    }
  }, [id]);

  const runVerificationSequence = async (wo: WorkOrder) => {
    setIsVerifying(true);
    
    // Simulate steps
    const steps = [
      "Analyzing before/after evidence...",
      "Checking location match...",
      "Evaluating repair quality...",
      "Preparing payment recommendation..."
    ];
    
    for (let i = 0; i < steps.length; i++) {
      setVerificationStep(i);
      await new Promise(r => setTimeout(r, 800)); // 800ms per step
    }

    const verificationResult = await verifyRepair(wo);
    setResult(verificationResult);
    
    // Save to local storage
    updateWorkOrder(wo.id, { verificationResult });
    updateWorkOrderStatus(wo.id, 'AI Verified');
    
    // Refresh local state
    const updatedWo = getWorkOrderById(wo.id);
    if (updatedWo) setWorkOrder(updatedWo);
    
    setIsVerifying(false);
    toast.success("AI Verification Complete");
  };

  const handleApprovePayment = () => {
    if (workOrder) {
      updateWorkOrderStatus(workOrder.id, 'Payment Released');
      const updatedWo = getWorkOrderById(workOrder.id);
      if (updatedWo) setWorkOrder(updatedWo);
      toast.success("Payment released successfully.");
    }
  };

  if (!workOrder || !issue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-center text-slate-500">
          <Loader2 size={32} className="animate-spin mx-auto mb-4" />
          <p>Loading Data...</p>
        </div>
      </div>
    );
  }

  const isPaymentReleased = workOrder.status === 'Payment Released';
  const isVerified = workOrder.status === 'AI Verified' || isPaymentReleased;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="min-h-screen bg-[#FAFAFA] text-ink font-sans flex flex-col"
    >
      {/* Navbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to={`/contractor-task/${workOrder.id}`} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-muted hover:text-ink">
            <ArrowLeft size={20} />
          </Link>
          <span className="font-semibold text-slate-500 text-sm">AI Verification</span>
        </div>
        <div className="flex items-center gap-2">
          {isPaymentReleased ? (
             <span className="text-xs font-bold px-3 py-1.5 bg-mint/10 text-mint rounded-full border border-mint/20 flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 size={14} /> Case Closed
             </span>
          ) : (
            <>
              <span className="text-xs font-bold px-3 py-1.5 bg-blue/10 text-blue rounded-full border border-blue/20">
                Repair Uploaded
              </span>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors ${isVerifying ? 'bg-amber/10 text-amber border-amber/20' : 'bg-mint/10 text-mint border-mint/20'}`}>
                {isVerifying ? <><Loader2 size={12} className="animate-spin" /> AI Verification Running</> : <><CheckCircle2 size={12} /> AI Verified</>}
              </span>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${isVerified && !isVerifying ? 'bg-blue-deep text-white border-blue-deep/20' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                {isVerified && !isVerifying ? <><ShieldCheck size={12} /> Payment Recommended</> : <><Lock size={12} /> Payment Locked</>}
              </span>
            </>
          )}
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto p-4 md:p-6 flex-1 w-full flex flex-col gap-6">
        <div className="mb-2">
          <h1 className="text-3xl font-display font-extrabold mb-2">AI Repair Verification</h1>
          <p className="text-sm text-muted font-medium">Civica checks repair proof before payment release.</p>
        </div>

        {/* Top Section: Evidence Comparison & AI Verdict */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* Section 1: Evidence Comparison */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Evidence Comparison</h2>
            
            <div className="grid sm:grid-cols-2 gap-4 h-full">
              {/* Before Card */}
              <div className="bento-card bg-white p-4 border border-slate-200 flex flex-col h-full">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Before</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-coral/10 text-coral rounded">Reported Evidence</span>
                </div>
                
                <div className="w-full aspect-video bg-slate-100 rounded-xl mb-4 relative overflow-hidden group border border-slate-200">
                  <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: issue.beforeImageUrl ? `url(${issue.beforeImageUrl})` : `url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=800&auto=format&fit=crop')` }} 
                  />
                </div>
                
                <div className="space-y-2.5 mt-auto bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-xs">
                    <User size={14} className="text-slate-400" />
                    <span className="font-bold text-slate-500 w-24">Uploaded by:</span>
                    <span className="font-medium text-ink truncate">{issue.reportedBy} (Citizen App)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock size={14} className="text-slate-400" />
                    <span className="font-bold text-slate-500 w-24">Time:</span>
                    <span className="font-medium text-ink truncate">{issue.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="font-bold text-slate-500 w-24">Location:</span>
                    <span className="font-medium text-ink truncate">{issue.location}</span>
                  </div>
                </div>
              </div>

              {/* After Card */}
              <div className="bento-card bg-white p-4 border border-slate-200 flex flex-col h-full">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">After</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-mint/10 text-mint rounded">Repair Proof</span>
                </div>
                
                <div className="w-full aspect-video bg-slate-100 rounded-xl mb-4 relative overflow-hidden group border border-slate-200">
                  <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: workOrder.afterRepairImageUrl ? `url(${workOrder.afterRepairImageUrl})` : `url('https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop')` }} 
                  />
                </div>

                <div className="space-y-2.5 mt-auto bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-xs">
                    <User size={14} className="text-slate-400" />
                    <span className="font-bold text-slate-500 w-24">Uploaded by:</span>
                    <span className="font-medium text-ink truncate">{workOrder.assignedContractor?.name || 'Contractor'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock size={14} className="text-slate-400" />
                    <span className="font-bold text-slate-500 w-24">Time:</span>
                    <span className="font-medium text-ink truncate">Just now</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="font-bold text-slate-500 w-24">Location:</span>
                    <span className="font-medium text-mint truncate flex items-center gap-1">GPS Match <CheckCircle2 size={10} /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: AI Verdict */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Civica AI Verdict</h2>
            
            <div className="bento-card bg-slate-900 text-white p-6 relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue/20 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <Activity size={20} className={isVerifying ? "text-blue animate-pulse" : "text-mint"} />
                <h3 className="font-display font-bold text-lg">AI Verification Analysis</h3>
              </div>

              {isVerifying ? (
                <div className="flex-1 flex flex-col justify-center relative z-10 mb-8">
                  <div className="flex justify-center mb-8">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-slate-700 rounded-full" />
                      <div className="w-20 h-20 border-4 border-blue border-t-transparent rounded-full animate-spin absolute inset-0" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShieldCheck size={24} className="text-blue animate-pulse" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      "Analyzing before/after evidence...",
                      "Checking location match...",
                      "Evaluating repair quality...",
                      "Preparing payment recommendation..."
                    ].map((stepText, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {verificationStep > idx ? (
                           <CheckCircle2 size={16} className="text-mint shrink-0" />
                        ) : verificationStep === idx ? (
                           <Loader2 size={16} className="text-blue animate-spin shrink-0" />
                        ) : (
                           <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                        )}
                        <span className={`text-sm ${verificationStep === idx ? 'text-white font-bold' : verificationStep > idx ? 'text-slate-400' : 'text-slate-600'}`}>
                          {stepText}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : result && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="flex-1 flex flex-col relative z-10"
                >
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-6 text-sm">
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-1">Repair Confidence</div>
                      <div className="font-extrabold text-mint flex items-center gap-1.5"><Activity size={14}/> {result.repairConfidence}%</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-1">Location Match</div>
                      <div className="font-extrabold text-mint flex items-center gap-1.5"><MapPin size={14}/> {result.sameLocationMatch}%</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-1">GPS Verified</div>
                      <div className="font-bold text-slate-200">{result.gpsVerified ? 'Yes' : 'No'}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-1">Timestamp Verified</div>
                      <div className="font-bold text-slate-200">{result.timestampVerified ? 'Yes' : 'No'}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-1">Tamper Risk</div>
                      <div className="font-bold text-mint">{result.evidenceTamperRisk}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-1">Repair Quality</div>
                      <div className="font-bold text-mint">{result.repairQuality}</div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    {result.repairConfidence >= 80 && result.issueResolved ? (
                      <div className="bg-mint/10 border border-mint/20 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center text-mint shrink-0">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <div className="font-extrabold text-mint mb-0.5">Verified for Payment</div>
                          <div className="text-xs text-mint/80">Repair meets all requirements and SLA standards.</div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-coral/10 border border-coral/20 rounded-xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center text-coral shrink-0">
                          <AlertCircle size={24} />
                        </div>
                        <div>
                          <div className="font-extrabold text-coral mb-0.5">Hold Payment / Rework Required</div>
                          <div className="text-xs text-coral/80">Confidence threshold not met. Manual review needed.</div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Payment Recommendation & Audit Trail */}
        <div className="grid lg:grid-cols-12 gap-6 pb-12">
          
          {/* Payment Recommendation Card */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Payment Authorization</h2>
            
            <div className="bento-card bg-white p-6 border border-slate-200 relative overflow-hidden h-full flex flex-col justify-between">
              
              {!isVerifying && result && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-ink mb-1">Payment Recommendation: <span className={result.repairConfidence >= 80 ? 'text-mint' : 'text-coral'}>{result.recommendation}</span></h3>
                      <p className="text-sm text-slate-500 max-w-md">{result.reason}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Amount</div>
                      <div className="text-2xl font-extrabold text-ink">{workOrder.estimatedCost}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-500">Work Order ID</span>
                      <span className="font-bold text-blue">{workOrder.workOrderId}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-500">Contractor</span>
                      <span className="font-bold text-ink">{workOrder.assignedContractor?.name || 'Contractor'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-slate-200 pt-3">
                      <span className="font-bold text-slate-500">Status</span>
                      {isPaymentReleased ? (
                        <span className="font-bold text-mint flex items-center gap-1.5"><CheckCircle2 size={16} /> Payment Released</span>
                      ) : (
                        <span className="font-bold text-amber flex items-center gap-1.5"><Lock size={16} /> Awaiting Admin Approval</span>
                      )}
                    </div>
                  </div>
                  
                  {!isPaymentReleased && (
                    <div className="flex items-center gap-4 pt-2">
                      <button 
                        onClick={handleApprovePayment}
                        className="flex-1 bg-blue-deep text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-blue/20 hover:bg-blue transition-colors flex justify-center items-center gap-2"
                      >
                        <ShieldCheck size={18} />
                        Approve Payment
                      </button>
                      <button className="flex-1 bg-white text-slate-600 font-bold py-3 px-6 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                        <AlertCircle size={18} />
                        Request Rework
                      </button>
                    </div>
                  )}
                  {isPaymentReleased && (
                     <div className="flex flex-col gap-3">
                       <div className="bg-mint/10 text-mint border border-mint/20 font-bold py-3 px-6 rounded-xl flex justify-center items-center gap-2">
                          <CheckCircle2 size={18} />
                          Payment successfully authorized and processed.
                       </div>
                       <Link to="/reports" className="w-full bg-white text-slate-600 font-bold py-3 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                         <FileText size={18} /> View Reports
                       </Link>
                     </div>
                  )}
                </motion.div>
              )}
              
              {isVerifying && (
                <div className="h-48 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <Lock size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">Awaiting AI verification results...</p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Audit Trail */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Audit Trail</h2>
            
            <div className="bento-card bg-white p-6 border border-slate-200 h-full">
              <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-[11px] before:w-[2px] before:bg-slate-100">
                
                {[
                  { label: "Issue reported by citizen", active: true },
                  { label: "AI issue DNA generated", active: true },
                  { label: "Work order created", active: true },
                  { label: "Contractor assigned", active: true },
                  { label: "Repair proof uploaded", active: true },
                  { label: "AI verification completed", active: !isVerifying },
                  { label: "Payment recommendation generated", active: !isVerifying },
                  { label: "Payment released", active: isPaymentReleased }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[31px] w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white ${item.active ? 'border-mint text-mint' : 'border-slate-200 text-slate-300'}`}>
                      {item.active ? <CheckCircle2 size={14} className="text-mint bg-white rounded-full" /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${item.active ? 'text-ink' : 'text-slate-400'}`}>{item.label}</p>
                      {item.active && <p className="text-[10px] font-semibold text-slate-400 mt-0.5 flex items-center gap-1"><FileCheck size={10} /> Recorded in ledger</p>}
                    </div>
                  </div>
                ))}
                
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
              <span className="flex items-center gap-1.5 text-mint whitespace-nowrap"><CheckSquare size={14}/> Contractor Assigned</span>
              <div className="w-6 h-px bg-mint mx-2 shrink-0" />
              <span className="flex items-center gap-1.5 text-mint whitespace-nowrap"><CheckSquare size={14}/> Repair Uploaded</span>
              
              <div className={`w-6 h-px mx-2 shrink-0 ${!isVerifying ? 'bg-mint' : 'bg-slate-200'}`} />
              
              {isVerifying ? (
                 <span className="flex items-center gap-1.5 text-blue whitespace-nowrap bg-blue/10 px-2 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-blue animate-pulse" /> AI Verifying</span>
              ) : (
                <span className="flex items-center gap-1.5 text-mint whitespace-nowrap"><CheckSquare size={14}/> AI Verified</span>
              )}

              <div className={`w-6 h-px mx-2 shrink-0 ${isPaymentReleased ? 'bg-mint' : 'bg-slate-200'}`} />
              
              {isPaymentReleased ? (
                <span className="flex items-center gap-1.5 text-mint whitespace-nowrap"><CheckSquare size={14}/> Payment Released</span>
              ) : (
                <span className="text-slate-400 whitespace-nowrap">Payment Released</span>
              )}
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
