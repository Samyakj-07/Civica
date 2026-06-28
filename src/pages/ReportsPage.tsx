import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  ArrowLeft,
  CheckCircle2,
  Lock,
  Activity,
  FileText,
  Download,
  AlertCircle,
  TrendingUp,
  Search,
  ChevronDown,
  BarChart3,
  Calendar,
  CheckSquare,
  FileSpreadsheet,
  User
} from "lucide-react";
import toast from "react-hot-toast";
import { getWorkOrders, getIssues, MOCK_CONTRACTORS, updateWorkOrderStatus } from "../services/api";
import { WorkOrder, Issue } from "../types";

export default function ReportsPage() {
  const navigate = useNavigate();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("30 Days");

  const loadData = () => {
    setWorkOrders(getWorkOrders().reverse());
    setIssues(getIssues().reverse());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprovePayment = (wo: WorkOrder) => {
    updateWorkOrderStatus(wo.id, 'Payment Released');
    toast.success("Payment approved and report updated.");
    loadData();
  };

  // Section 1: KPIs
  const verifiedRepairs = workOrders.filter(wo => wo.verificationResult && wo.verificationResult.repairConfidence >= 80);
  const releasedAmount = workOrders.filter(wo => wo.status === 'Payment Released').reduce((sum, wo) => sum + parseInt(wo.estimatedCost.replace(/\D/g, '') || '0'), 0);
  const paymentHolds = workOrders.filter(wo => wo.status === 'Rework Required' || wo.status === 'Repair Uploaded' || wo.status === 'AI Verified');
  
  const avgConfidence = verifiedRepairs.length ? Math.round(verifiedRepairs.reduce((sum, wo) => sum + (wo.verificationResult?.repairConfidence || 0), 0) / verifiedRepairs.length) : 0;
  
  const resProgress = workOrders.length ? Math.round((workOrders.filter(wo => wo.status === 'Payment Released').length / workOrders.length) * 100) : 0;

  // Section 3: Categories
  const categories = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const categoryData = Object.keys(categories).map(key => ({
    name: key,
    count: categories[key],
    percentage: Math.round((categories[key] / issues.length) * 100)
  })).sort((a, b) => b.count - a.count);

  // Section 4: Funnel
  const funnel = {
    reported: issues.length,
    reviewed: issues.filter(i => !!i.aiAnalysis).length,
    assigned: workOrders.filter(wo => wo.status !== 'Work Order Created').length,
    uploaded: workOrders.filter(wo => ['Repair Uploaded', 'AI Verified', 'Payment Released'].includes(wo.status)).length,
    verified: workOrders.filter(wo => ['AI Verified', 'Payment Released'].includes(wo.status)).length,
    paid: workOrders.filter(wo => wo.status === 'Payment Released').length
  };

  // Export functions
  const exportCSV = () => {
    const headers = "WorkOrderID,IssueTitle,Category,Severity,Contractor,Status,EstimatedCost,RepairConfidence,Recommendation\n";
    const rows = workOrders.map(wo => {
      const issue = issues.find(i => i.id === wo.issueId);
      return `${wo.workOrderId},"${issue?.title || ''}",${issue?.category || ''},${issue?.severity || ''},"${wo.assignedContractor?.name || ''}",${wo.status},${wo.estimatedCost},${wo.verificationResult?.repairConfidence || ''},${wo.verificationResult?.recommendation || ''}`;
    }).join("\n");
    
    downloadFile("civica-work-orders.csv", headers + rows, "text/csv");
  };

  const exportImpactReport = () => {
    const report = `
CIVICA IMPACT REPORT
====================
Generated on: ${new Date().toLocaleDateString()}
Date Range: ${dateRange}

EXECUTIVE SUMMARY
-----------------
Total Civic Cases: ${issues.length}
Verified Repairs: ${verifiedRepairs.length}
Payments Released: ₹${releasedAmount.toLocaleString()}
Average AI Repair Confidence: ${avgConfidence}%

IMPACT STORY
------------
In this reporting period, Civica processed ${issues.length} civic cases, verified ${verifiedRepairs.length} repairs using AI, released ₹${releasedAmount.toLocaleString()} in contractor payments, and flagged ${paymentHolds.length} cases for hold or rework. The average repair confidence was ${avgConfidence}%, helping admins release payments with stronger proof and accountability.

CONTRACTOR PERFORMANCE SNAPSHOT
-------------------------------
${MOCK_CONTRACTORS.map(c => `- ${c.name}: Score ${c.contractorScore}/5, SLA Met: ${c.slaCompliance}`).join('\n')}

AI ASSURANCE METRICS
--------------------
Repairs successfully processed through the Civica AI Assurance Engine.
    `.trim();

    downloadFile("civica-impact-report.txt", report, "text/plain");
  };

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded.`);
  };

  if (issues.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
          <BarChart3 size={40} className="text-slate-300" />
        </div>
        <h1 className="text-3xl font-display font-extrabold text-ink mb-3">No report data yet</h1>
        <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
          Complete your first Civica repair workflow to generate verified impact reports.
        </p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/create-case')} className="px-8 py-3 bg-violet-deep text-white rounded-full font-bold shadow-lg shadow-violet/20 hover:bg-violet transition-colors">
            Create Civic Case
          </button>
          <button onClick={() => navigate('/dashboard')} className="px-8 py-3 bg-white text-ink border border-slate-200 rounded-full font-bold shadow-sm hover:bg-slate-50 transition-colors">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#FAFAFA] text-ink font-sans flex flex-col pb-12"
      style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}
    >
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-display font-extrabold text-xl text-ink">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-ink text-white shadow-sm">
              <ShieldCheck size={18} />
            </span>
            Civica
          </div>
          <div className="h-5 w-px bg-slate-300 mx-2" />
          <span className="font-semibold text-slate-500 text-sm">Reports & Impact</span>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative hidden md:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet/50"
            />
          </div>
          <div className="relative">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet/50"
            >
              <option>Today</option>
              <option>7 Days</option>
              <option>30 Days</option>
              <option>All Time</option>
            </select>
            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors bg-white">
            <FileSpreadsheet size={16} /> Export CSV
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 md:p-6 flex-1 w-full space-y-6 mt-2">
        
        <div className="mb-4">
          <h1 className="text-3xl font-display font-extrabold text-ink mb-1">Reports & Impact</h1>
          <p className="text-sm text-slate-500 font-medium">Measure verified repairs, contractor performance, payment assurance, and civic impact.</p>
        </div>

        {/* SECTION 2: Impact Story Panel */}
        <div className="bento-card bg-violet-deep text-white p-8 relative overflow-hidden shadow-lg shadow-violet/10 mb-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay pointer-events-none" />
          <h2 className="text-sm font-bold uppercase tracking-wide text-violet-100 mb-4 flex items-center gap-2"><BarChart3 size={18}/> Civic Impact Story</h2>
          <p className="text-xl font-medium leading-relaxed max-w-4xl relative z-10 mb-6">
            In this reporting period, Civica processed <strong className="text-mint">{issues.length}</strong> civic cases, verified <strong className="text-mint">{verifiedRepairs.length}</strong> repairs using AI, released <strong className="text-mint">₹{releasedAmount.toLocaleString()}</strong> in contractor payments, and flagged <strong className="text-coral">{paymentHolds.length}</strong> cases for rework or hold. The average repair confidence was <strong className="text-mint">{avgConfidence}%</strong>, helping admins release payments with stronger proof and accountability.
          </p>
          <div className="flex flex-wrap gap-3 relative z-10">
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold flex items-center gap-1.5"><Activity size={12}/> AI Verified</span>
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold flex items-center gap-1.5"><ShieldCheck size={12}/> Payment Assured</span>
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold flex items-center gap-1.5"><User size={12}/> Contractor Accountable</span>
            <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-bold flex items-center gap-1.5"><FileText size={12}/> Audit Ready</span>
          </div>
        </div>

        {/* SECTION 1: Executive Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><FileText size={14}/> Total Cases</div>
            <div className="text-3xl font-extrabold text-ink mb-1">{issues.length}</div>
            <div className="text-[10px] text-slate-400 font-semibold">Across all categories</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><ShieldCheck size={14} className="text-mint"/> Verified Repairs</div>
            <div className="text-3xl font-extrabold text-ink mb-1">{verifiedRepairs.length}</div>
            <div className="text-[10px] text-mint font-bold flex items-center gap-1"><TrendingUp size={10}/> AI Confidence &gt; 80%</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><CheckCircle2 size={14} className="text-mint"/> Paid Out</div>
            <div className="text-3xl font-extrabold text-ink mb-1">₹{releasedAmount.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 font-semibold">Released securely</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><AlertCircle size={14} className="text-amber"/> On Hold</div>
            <div className="text-3xl font-extrabold text-ink mb-1">{paymentHolds.length}</div>
            <div className="text-[10px] text-coral font-bold">Needs admin review</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Activity size={14} className="text-blue-500"/> Avg Confidence</div>
            <div className="text-3xl font-extrabold text-ink mb-1">{avgConfidence}%</div>
            <div className="text-[10px] text-slate-400 font-semibold">Across verified cases</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5"><CheckSquare size={14} className="text-violet"/> Resolution</div>
            <div className="text-3xl font-extrabold text-ink mb-1">{resProgress}%</div>
            <div className="text-[10px] text-slate-400 font-semibold">Cases fully closed</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* SECTION 4: Work Order Status Funnel */}
          <div className="bento-card bg-white p-6 border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-6">Workflow Conversion Funnel</h2>
            <div className="space-y-4">
              {[
                { label: '1. Reported', count: funnel.reported, color: 'bg-slate-200', text: 'text-slate-600' },
                { label: '2. AI Reviewed', count: funnel.reviewed, color: 'bg-violet/20', text: 'text-slate-700' },
                { label: '3. Assigned', count: funnel.assigned, color: 'bg-violet/40', text: 'text-slate-800' },
                { label: '4. Verified', count: funnel.verified, color: 'bg-violet/70', text: 'text-white' },
                { label: '5. Paid', count: funnel.paid, color: 'bg-mint', text: 'text-white' },
              ].map((stage, i) => (
                <div key={i} className="relative h-10 bg-slate-50 rounded-lg overflow-hidden flex items-center border border-slate-100">
                  <div className={`absolute top-0 left-0 bottom-0 ${stage.color} transition-all duration-1000`} style={{ width: `${Math.max((stage.count / funnel.reported) * 100 || 0, 5)}%` }}></div>
                  <div className={`relative z-10 flex justify-between w-full px-4 text-xs font-bold ${stage.text} drop-shadow-sm`}>
                    <span>{stage.label}</span>
                    <span className="flex items-center gap-4">
                      <span>{stage.count}</span>
                      <span className="opacity-70 text-[10px] w-8 text-right">{Math.round((stage.count / funnel.reported) * 100 || 0)}%</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: Category Breakdown */}
          <div className="bento-card bg-white p-6 border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-6">Issue Category Breakdown</h2>
            <div className="space-y-5">
              {categoryData.length > 0 ? categoryData.map((cat, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-xs font-bold text-slate-700">{cat.name}</span>
                    <span className="text-xs font-bold text-slate-500">{cat.count} <span className="text-[10px] text-slate-400 font-normal">({cat.percentage}%)</span></span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-violet" style={{ width: `${cat.percentage}%` }} />
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-400 text-sm">No categories available.</div>
              )}
            </div>
          </div>

        </div>

        {/* SECTION 5: Payment Assurance Report */}
        <div className="bento-card bg-white p-0 border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 flex items-center gap-2"><Lock size={16}/> Payment Assurance Ledger</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">Work Order ID</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">Contractor</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">Amount</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">AI Trust</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">Payment Status</th>
                  <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workOrders.filter(wo => wo.status !== 'Work Order Created' && wo.status !== 'Contractor Assigned').length === 0 ? (
                   <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-400">No payment records yet.</td></tr>
                ) : (
                  workOrders
                    .filter(wo => wo.status !== 'Work Order Created' && wo.status !== 'Contractor Assigned')
                    .map(wo => (
                    <tr key={wo.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-ink">{wo.workOrderId}</div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                        {wo.assignedContractor?.name || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 text-sm font-extrabold text-ink">
                        {wo.estimatedCost}
                      </td>
                      <td className="px-6 py-4">
                        {wo.verificationResult ? (
                          <div className={`text-xs font-bold px-2.5 py-1 inline-flex rounded-full ${wo.verificationResult.repairConfidence >= 80 ? 'bg-mint/10 text-mint' : 'bg-coral/10 text-coral'}`}>
                            {wo.verificationResult.repairConfidence}% Conf.
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">Pending Scan</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold items-center gap-1
                            ${wo.status === 'Payment Released' ? 'bg-mint/10 text-mint' : 
                              wo.verificationResult?.recommendation === 'Release Payment' ? 'bg-violet/10 text-violet' :
                              'bg-amber/10 text-amber'}`
                          }>
                            {wo.status === 'Payment Released' ? 'Released' : wo.verificationResult?.recommendation === 'Release Payment' ? 'Recommended' : 'Locked'}
                          </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => navigate(`/audit-trail/${wo.id}`)} className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded transition-colors">
                          Audit
                        </button>
                        {wo.status !== 'Payment Released' && wo.verificationResult?.recommendation === 'Release Payment' && (
                          <button onClick={() => handleApprovePayment(wo)} className="text-[10px] font-bold text-white bg-violet hover:bg-violet-deep px-3 py-1.5 rounded transition-colors">
                            Approve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* SECTION 6: Contractor Performance Report */}
          <div className="bento-card bg-white p-6 border border-slate-200 shadow-sm">
             <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-6 flex items-center gap-2"><User size={16}/> Contractor Performance</h2>
             <div className="space-y-4">
               {MOCK_CONTRACTORS.map(contractor => (
                 <div key={contractor.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="font-bold text-ink">{contractor.name}</h3>
                        <div className="text-[10px] text-slate-500">{contractor.tier}</div>
                      </div>
                      <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${contractor.contractorScore >= 4.5 ? 'bg-mint/10 text-mint' : 'bg-blue-500/10 text-blue-500'}`}>
                        {contractor.contractorScore >= 4.5 ? 'Excellent' : 'Good'}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 border-t border-slate-200 pt-3">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Score</div>
                        <div className="text-sm font-extrabold text-ink">{contractor.contractorScore}/5</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">SLA Met</div>
                        <div className="text-sm font-extrabold text-mint">{contractor.slaCompliance}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Rework</div>
                        <div className="text-sm font-extrabold text-coral">{contractor.repeatFailureRate}</div>
                      </div>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* SECTION 9: Export Center & AI Assurance */}
          <div className="space-y-6">
            
            {/* AI Assurance Quality Report */}
            <div className="bento-card bg-slate-900 text-white p-6 border border-slate-800 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-mint/10 rounded-full blur-2xl mix-blend-screen pointer-events-none" />
               <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400 mb-4 flex items-center gap-2"><ShieldCheck size={16} className="text-mint"/> AI Assurance Quality</h2>
               
               <div className="grid grid-cols-2 gap-4 mb-4">
                 <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">System Confidence Avg</div>
                    <div className="text-2xl font-extrabold text-mint">{avgConfidence}%</div>
                 </div>
                 <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Tamper Flags</div>
                    <div className="text-2xl font-extrabold text-white">0</div>
                 </div>
               </div>
               
               <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 text-xs text-slate-300 leading-relaxed font-medium">
                 Civica recommends payment only when repair confidence is above 80%, GPS location is verified, and evidence passes the tamper-risk scan.
               </div>
            </div>

            {/* Export Center */}
            <div className="bento-card bg-white p-6 border border-slate-200 shadow-sm">
               <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-4 flex items-center gap-2"><Download size={16}/> Export Center</h2>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <button onClick={exportImpactReport} className="flex items-center gap-2 px-4 py-3 bg-violet/5 hover:bg-violet/10 text-violet font-bold text-xs rounded-xl border border-violet/10 transition-colors text-left">
                    <FileText size={16} className="shrink-0" /> 
                    <span>Download Impact Report (.txt)</span>
                 </button>
                 <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors text-left">
                    <FileSpreadsheet size={16} className="shrink-0" /> 
                    <span>Download Work Orders (.csv)</span>
                 </button>
                 <button onClick={exportImpactReport} className="flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors text-left">
                    <User size={16} className="shrink-0" /> 
                    <span>Contractor Report (.txt)</span>
                 </button>
                 <button onClick={exportImpactReport} className="flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors text-left">
                    <Lock size={16} className="shrink-0" /> 
                    <span>Payment Report (.txt)</span>
                 </button>
               </div>
            </div>

          </div>
        </div>

      </main>
    </motion.div>
  );
}
