import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Search,
  Plus,
  Download,
  AlertCircle,
  CheckCircle2,
  Lock,
  Activity,
  MapPin,
  Clock,
  TrendingUp,
  TrendingDown,
  User,
  ArrowRight
} from "lucide-react";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getWorkOrders, getIssues, approveAllPendingPayments, MOCK_CONTRACTORS } from "../services/api";
import { WorkOrder, Issue } from "../types";

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons based on severity
const getMarkerIcon = (severity: string) => {
  const color = severity === 'High' ? '#ef4444' : severity === 'Medium' ? '#f59e0b' : '#10b981';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

export default function DashboardPage() {
  const navigate = useNavigate();
  
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const loadData = () => {
    setWorkOrders(getWorkOrders().reverse());
    setIssues(getIssues().reverse());
  };

  useEffect(() => {
    loadData();
    // Setup a small interval for pseudo-realtime feeling in demo
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApprovePayments = () => {
    approveAllPendingPayments();
    loadData();
    toast.success("Pending verified payments released.");
  };

  // KPI Calculations
  const openIssuesCount = workOrders.filter(wo => wo.status !== 'Payment Released' && wo.status !== 'Case Closed').length;
  const aiVerifiedCount = workOrders.filter(wo => !!wo.verificationResult && (wo.status === 'AI Verified' || wo.status === 'Payment Released')).length;
  
  const releasedPaymentsSum = workOrders
    .filter(wo => wo.status === 'Payment Released')
    .reduce((sum, wo) => sum + parseInt(wo.estimatedCost.replace(/\D/g, '') || '0'), 0);
    
  const paymentHoldsCount = workOrders.filter(wo => 
    !wo.verificationResult || 
    (wo.verificationResult && wo.status !== 'Payment Released')
  ).length;

  const avgContractorScore = MOCK_CONTRACTORS.reduce((sum, c) => sum + c.contractorScore, 0) / (MOCK_CONTRACTORS.length || 1);

  // Filter logic
  const filteredWorkOrders = workOrders.filter(wo => {
    const matchesSearch = wo.workOrderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (wo.assignedContractor?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "All") return matchesSearch;
    if (filter === "Open") return matchesSearch && wo.status !== 'Payment Released';
    if (filter === "Contractor Assigned") return matchesSearch && wo.status === 'Contractor Assigned';
    if (filter === "Awaiting Verification") return matchesSearch && wo.status === 'Repair Uploaded';
    if (filter === "Payment Recommended") return matchesSearch && wo.verificationResult?.recommendation === 'Release Payment' && wo.status !== 'Payment Released';
    if (filter === "Payment Released") return matchesSearch && wo.status === 'Payment Released';
    if (filter === "Rework Required") return matchesSearch && wo.status === 'Rework Required';
    return matchesSearch;
  });

  // AI Stats
  const verifiedWOs = workOrders.filter(wo => !!wo.verificationResult);
  const avgConfidence = verifiedWOs.length 
    ? Math.round(verifiedWOs.reduce((sum, wo) => sum + (wo.verificationResult?.repairConfidence || 0), 0) / verifiedWOs.length)
    : 0;
  const avgLocationMatch = verifiedWOs.length 
    ? Math.round(verifiedWOs.reduce((sum, wo) => sum + (wo.verificationResult?.sameLocationMatch || 0), 0) / verifiedWOs.length)
    : 0;

  // Map markers generation (assigning pseudo-random coords around Mumbai if none exist)
  const mapMarkers = issues.map((issue, idx) => {
    // Basic mock coordinates around Mumbai for the demo
    const lat = 19.0760 + (Math.random() - 0.5) * 0.1;
    const lng = 72.8777 + (Math.random() - 0.5) * 0.1;
    const relatedWo = workOrders.find(wo => wo.issueId === issue.id);
    
    return {
      id: issue.id,
      title: issue.title,
      location: issue.location,
      severity: issue.severity,
      lat,
      lng,
      status: relatedWo ? relatedWo.status : issue.status,
      confidence: relatedWo?.verificationResult?.repairConfidence
    };
  });

  // Action Button Helper
  const getAction = (wo: WorkOrder) => {
    switch(wo.status) {
      case 'Work Order Created': return { label: 'Review', path: `/work-order/${wo.id}` };
      case 'Contractor Assigned': return { label: 'Open Task', path: `/contractor-task/${wo.id}` };
      case 'Repair Uploaded': return { label: 'Verify', path: `/ai-verification/${wo.id}` };
      case 'AI Verified': return { label: 'Approve Payment', path: `/ai-verification/${wo.id}` };
      case 'Payment Released': return { label: 'View Audit', path: `/audit-trail/${wo.id}` };
      default: return { label: 'View', path: `/work-order/${wo.id}` };
    }
  };

  // Funnel Data (Simple counts)
  const funnel = {
    reported: issues.length,
    reviewed: issues.filter(i => !!i.aiAnalysis).length,
    assigned: workOrders.filter(wo => wo.status !== 'Work Order Created').length,
    uploaded: workOrders.filter(wo => ['Repair Uploaded', 'AI Verified', 'Payment Released'].includes(wo.status)).length,
    verified: workOrders.filter(wo => ['AI Verified', 'Payment Released'].includes(wo.status)).length,
    paid: workOrders.filter(wo => wo.status === 'Payment Released').length
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8F9FE] text-ink font-sans pb-12"
      style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}
    >
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 font-display font-extrabold text-xl text-ink">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-ink text-white shadow-sm">
            <ShieldCheck size={18} />
          </span>
          Civica Command
        </div>
        
        <div className="flex-1 max-w-xl w-full relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search issues, work orders, contractors..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-violet/50 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link to="/reports" className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={16} /> Export Report
          </Link>
          <Link to="/create-case" className="flex items-center gap-2 px-4 py-2 bg-violet-deep text-white rounded-full text-sm font-bold shadow-md shadow-violet/20 hover:bg-violet transition-colors">
            <Plus size={16} /> Create Civic Case
          </Link>
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex-shrink-0 ml-2">
             <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=256&auto=format&fit=crop" alt="Admin" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6 mt-4">
        
        <div className="mb-2">
          <h1 className="text-3xl font-display font-extrabold text-ink mb-1">Command Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium">Track verified civic repairs, contractor performance, and payment assurance in real time.</p>
        </div>

        {/* SECTION 1: KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center text-coral"><AlertCircle size={20}/></div>
              <span className="text-xs font-bold text-coral bg-coral/10 px-2 py-0.5 rounded-full flex items-center gap-1"><TrendingUp size={10}/> 12%</span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-ink mb-1">{openIssuesCount}</div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Open Issues</div>
            </div>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-violet/10 flex items-center justify-center text-violet"><ShieldCheck size={20}/></div>
              <span className="text-xs font-bold text-mint bg-mint/10 px-2 py-0.5 rounded-full flex items-center gap-1"><TrendingUp size={10}/> 8%</span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-ink mb-1">{aiVerifiedCount}</div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">AI Verified Repairs</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-mint/10 flex items-center justify-center text-mint"><CheckCircle2 size={20}/></div>
              <span className="text-xs font-bold text-mint bg-mint/10 px-2 py-0.5 rounded-full flex items-center gap-1"><TrendingUp size={10}/> 24%</span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-ink mb-1">₹{releasedPaymentsSum.toLocaleString()}</div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Payments Released</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center text-amber"><Lock size={20}/></div>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1"><TrendingDown size={10}/> 2%</span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-ink mb-1">{paymentHoldsCount}</div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Payment Holds</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><User size={20}/></div>
              <span className="text-xs font-bold text-mint bg-mint/10 px-2 py-0.5 rounded-full flex items-center gap-1"><TrendingUp size={10}/> 0.1</span>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-ink mb-1">{avgContractorScore.toFixed(1)}<span className="text-sm text-slate-400">/5</span></div>
              <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Avg Contractor Score</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Left Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* SECTION 2: Active Work Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Active Work Orders</h2>
                <div className="flex gap-2">
                  {["All", "Open", "Awaiting Verification", "Payment Released"].map(f => (
                    <button 
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors ${filter === f ? 'bg-violet text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div className="overflow-auto flex-1 p-0">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">ID & Issue</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">Contractor</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">Status</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">AI Trust</th>
                      <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredWorkOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Search size={24} className="text-slate-300" />
                          </div>
                          <p className="text-slate-500 font-bold mb-1">No work orders found</p>
                          <p className="text-xs text-slate-400">Adjust filters or create a new case.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredWorkOrders.map(wo => {
                        const parentIssue = issues.find(i => i.id === wo.issueId);
                        const action = getAction(wo);
                        return (
                          <tr key={wo.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="text-xs font-bold text-violet mb-0.5">{wo.workOrderId}</div>
                              <div className="text-sm font-semibold text-ink truncate max-w-[200px]">{parentIssue?.title || 'Unknown Issue'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-xs font-medium text-slate-600">{wo.assignedContractor?.name || 'Unassigned'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold items-center gap-1
                                ${wo.status === 'Payment Released' ? 'bg-mint/10 text-mint' : 
                                  wo.status === 'Rework Required' ? 'bg-coral/10 text-coral' :
                                  wo.status.includes('Verified') ? 'bg-blue-500/10 text-blue-500' :
                                  'bg-slate-100 text-slate-600'}`
                              }>
                                {wo.status === 'Payment Released' && <CheckCircle2 size={10} />}
                                {wo.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {wo.verificationResult ? (
                                <div className="flex items-center gap-1.5">
                                  <div className="w-full bg-slate-100 rounded-full h-1.5 w-12 overflow-hidden">
                                    <div className={`h-full ${wo.verificationResult.repairConfidence >= 80 ? 'bg-mint' : 'bg-coral'}`} style={{width: `${wo.verificationResult.repairConfidence}%`}}></div>
                                  </div>
                                  <span className="text-xs font-bold text-slate-600">{wo.verificationResult.repairConfidence}%</span>
                                </div>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Pending</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <button onClick={() => navigate(action.path)} className="text-xs font-bold text-violet bg-violet/5 hover:bg-violet/10 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 whitespace-nowrap opacity-0 group-hover:opacity-100 focus:opacity-100">
                                {action.label} <ArrowRight size={12} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 3: Issue Map Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[400px] relative flex flex-col">
              <div className="px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-md absolute top-0 inset-x-0 z-[1000] flex justify-between items-center pointer-events-none">
                 <h2 className="text-sm font-bold uppercase tracking-wide text-slate-600 pointer-events-auto">Live Issue Map</h2>
                 <div className="flex gap-3 pointer-events-auto">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><div className="w-2 h-2 rounded-full bg-coral"></div> High</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><div className="w-2 h-2 rounded-full bg-amber"></div> Med</span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><div className="w-2 h-2 rounded-full bg-mint"></div> Low</span>
                 </div>
              </div>
              <div className="flex-1 w-full bg-slate-100 z-0">
                 <MapContainer center={[19.0760, 72.8777]} zoom={11} className="w-full h-full" zoomControl={false}>
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    {mapMarkers.map(marker => (
                      <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={getMarkerIcon(marker.severity)}>
                        <Popup className="custom-popup">
                          <div className="font-sans">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Issue</div>
                            <div className="text-sm font-bold text-ink mb-2 leading-tight">{marker.title}</div>
                            <div className="text-[10px] bg-slate-100 px-2 py-1 rounded inline-block font-semibold text-slate-600 mb-2">{marker.status}</div>
                            {marker.confidence && (
                              <div className="text-xs font-bold text-mint flex items-center gap-1"><ShieldCheck size={12}/> AI Trust: {marker.confidence}%</div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                 </MapContainer>
              </div>
            </div>

          </div>

          {/* Main Right Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* SECTION 4: AI Assurance Panel */}
            <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-violet/10">
              <div className="absolute top-0 right-0 w-48 h-48 bg-violet/20 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-6 relative z-10">
                <Activity size={18} className="text-violet" />
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-300">AI Assurance Overview</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 relative z-10 mb-6">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <div className="text-2xl font-extrabold text-white mb-1 flex items-center gap-1.5">{avgConfidence ? `${avgConfidence}%` : '--'}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Avg Confidence</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <div className="text-2xl font-extrabold text-white mb-1 flex items-center gap-1.5">{avgLocationMatch ? `${avgLocationMatch}%` : '--'}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Location Match</div>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                  <span className="font-semibold text-slate-400">Repairs Verified</span>
                  <span className="font-bold text-mint">{verifiedWOs.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                  <span className="font-semibold text-slate-400">Reworks Triggered</span>
                  <span className="font-bold text-coral">{workOrders.filter(wo => wo.status === 'Rework Required').length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-400">Tamper Risk Avg</span>
                  <span className="font-bold text-mint">Low</span>
                </div>
              </div>
            </div>

            {/* SECTION 5: Payment Assurance Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Payment Engine</h2>
                 <ShieldCheck size={18} className="text-mint" />
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-mint/10 flex items-center justify-center text-mint"><CheckCircle2 size={14}/></div>
                    <span className="text-sm font-bold text-slate-600">Released</span>
                  </div>
                  <span className="font-extrabold text-ink">₹{releasedPaymentsSum.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><Lock size={14}/></div>
                    <span className="text-sm font-bold text-slate-600">Locked</span>
                  </div>
                  <span className="font-extrabold text-ink">
                    ₹{workOrders.filter(w => !w.verificationResult && w.status !== 'Payment Released').reduce((s, w) => s + parseInt(w.estimatedCost.replace(/\D/g, '') || '0'), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-violet/10 flex items-center justify-center text-violet"><Activity size={14}/></div>
                    <span className="text-sm font-bold text-slate-600">Pending Approval</span>
                  </div>
                  <span className="font-extrabold text-violet">
                    ₹{workOrders.filter(w => w.verificationResult?.recommendation === 'Release Payment' && w.status !== 'Payment Released').reduce((s, w) => s + parseInt(w.estimatedCost.replace(/\D/g, '') || '0'), 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleApprovePayments}
                disabled={!workOrders.some(w => w.verificationResult?.recommendation === 'Release Payment' && w.status !== 'Payment Released')}
                className="w-full bg-violet-deep text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet flex justify-center items-center gap-2"
              >
                Approve Pending Payments
              </button>
            </div>

            {/* SECTION 7: Impact Analytics Funnel */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-6">Workflow Funnel</h2>
              
              <div className="space-y-3">
                <div className="relative h-8 bg-slate-50 rounded overflow-hidden flex items-center border border-slate-100">
                  <div className="absolute top-0 left-0 bottom-0 bg-slate-200" style={{ width: '100%' }}></div>
                  <div className="relative z-10 flex justify-between w-full px-3 text-xs font-bold text-slate-600">
                    <span>1. Reported</span>
                    <span>{funnel.reported}</span>
                  </div>
                </div>
                
                <div className="relative h-8 bg-slate-50 rounded overflow-hidden flex items-center border border-slate-100">
                  <div className="absolute top-0 left-0 bottom-0 bg-violet/20" style={{ width: `${Math.max((funnel.reviewed / funnel.reported) * 100 || 0, 5)}%` }}></div>
                  <div className="relative z-10 flex justify-between w-full px-3 text-xs font-bold text-slate-600">
                    <span>2. AI Reviewed</span>
                    <span>{funnel.reviewed}</span>
                  </div>
                </div>

                <div className="relative h-8 bg-slate-50 rounded overflow-hidden flex items-center border border-slate-100">
                  <div className="absolute top-0 left-0 bottom-0 bg-violet/40" style={{ width: `${Math.max((funnel.assigned / funnel.reported) * 100 || 0, 5)}%` }}></div>
                  <div className="relative z-10 flex justify-between w-full px-3 text-xs font-bold text-slate-700">
                    <span>3. Assigned</span>
                    <span>{funnel.assigned}</span>
                  </div>
                </div>

                <div className="relative h-8 bg-slate-50 rounded overflow-hidden flex items-center border border-slate-100">
                  <div className="absolute top-0 left-0 bottom-0 bg-violet/60" style={{ width: `${Math.max((funnel.verified / funnel.reported) * 100 || 0, 5)}%` }}></div>
                  <div className="relative z-10 flex justify-between w-full px-3 text-xs font-bold text-white drop-shadow-sm">
                    <span>4. AI Verified</span>
                    <span>{funnel.verified}</span>
                  </div>
                </div>

                <div className="relative h-8 bg-slate-50 rounded overflow-hidden flex items-center border border-slate-100">
                  <div className="absolute top-0 left-0 bottom-0 bg-mint" style={{ width: `${Math.max((funnel.paid / funnel.reported) * 100 || 0, 5)}%` }}></div>
                  <div className="relative z-10 flex justify-between w-full px-3 text-xs font-bold text-white drop-shadow-sm">
                    <span>5. Paid</span>
                    <span>{funnel.paid}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        
        {/* SECTION 6: Contractor Performance (Bottom Row) */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-4 px-2">Top Performing Contractors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_CONTRACTORS.map(contractor => (
              <div key={contractor.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop" alt="Technician" className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-ink">{contractor.name}</h3>
                    <span className="text-xs font-bold text-ink bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">{contractor.contractorScore} <span className="text-slate-400">/5</span></span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{contractor.tier}</p>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-100 pt-3">
                    <span className="flex flex-col gap-1"><span>SLA Met</span><span className="text-mint">{contractor.slaCompliance}</span></span>
                    <span className="flex flex-col gap-1"><span>Avg Time</span><span className="text-ink">{contractor.averageRepairTime}</span></span>
                    <span className="flex flex-col gap-1"><span>Rework</span><span className="text-coral">{contractor.repeatFailureRate}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
      
      {/* Empty State Overlay if needed */}
      {workOrders.length === 0 && issues.length === 0 && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
            <ShieldCheck size={40} className="text-slate-300" />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-ink mb-3">No civic cases yet</h1>
          <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
            Create your first verified civic case to start the assurance workflow. Track AI verifications and manage payments right here.
          </p>
          <Link to="/create-case" className="px-8 py-3 bg-violet-deep text-white rounded-full font-bold shadow-lg shadow-violet/20 hover:bg-violet transition-colors flex items-center gap-2">
            <Plus size={20} /> Create Civic Case
          </Link>
        </div>
      )}
    </motion.div>
  );
}
