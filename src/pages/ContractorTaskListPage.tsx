import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HardHat, MapPin, Clock, ArrowRight, RefreshCcw, Search } from "lucide-react";
import { getWorkOrders, getIssues } from "../services/api";
import { getCurrentUser } from "../services/auth";
import { WorkOrder, Issue } from "../types";

export default function ContractorTaskListPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [tasks, setTasks] = useState<WorkOrder[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadTasks = () => {
    setIsRefreshing(true);
    const allWorkOrders = getWorkOrders();
    const allIssues = getIssues();
    
    // Filter tasks assigned to this contractor's company
    const myTasks = allWorkOrders.filter(wo => 
      wo.assignedContractor?.name === user?.contractorName
    ).reverse();
    
    setTasks(myTasks);
    setIssues(allIssues);
    
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    const issue = issues.find(i => i.id === task.issueId);
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      task.workOrderId.toLowerCase().includes(query) ||
      (issue?.title || "").toLowerCase().includes(query) ||
      task.status.toLowerCase().includes(query)
    );
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1200px] mx-auto p-4 md:p-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-ink mb-1">My Repair Tasks</h1>
          <p className="text-sm text-slate-500 font-medium">Manage and execute work orders assigned to {user?.contractorName}</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet"
            />
          </div>
          <button 
            onClick={loadTasks} 
            className="p-2.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCcw size={16} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <HardHat size={32} className="text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-ink mb-2">No assigned tasks yet</h2>
          <p className="text-slate-500 max-w-sm mb-6">
            When a municipal admin assigns a verified work order to {user?.contractorName}, it will appear here.
          </p>
          <button onClick={loadTasks} className="px-6 py-2.5 bg-violet text-white rounded-full font-bold shadow-md hover:bg-violet-deep transition-colors flex items-center gap-2">
            <RefreshCcw size={16} /> Refresh Tasks
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => {
            const issue = issues.find(i => i.id === task.issueId);
            
            // Determine card styling based on status
            const isCompleted = task.status === 'AI Verified' || task.status === 'Payment Released' || task.status === 'Repair Uploaded';
            const isRework = task.status === 'Rework Required';
            
            return (
              <div key={task.id} className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col transition-all hover:shadow-md ${isRework ? 'border-coral/30' : 'border-slate-200'}`}>
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      {task.workOrderId}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isCompleted ? 'bg-mint/10 text-mint' : 
                      isRework ? 'bg-coral/10 text-coral' : 
                      'bg-amber/10 text-amber'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  {issue?.severity === 'High' && !isCompleted && (
                    <span className="w-2 h-2 rounded-full bg-coral animate-pulse" title="High Priority"></span>
                  )}
                </div>
                
                <h3 className="font-bold text-ink text-lg leading-tight mb-2 line-clamp-2">
                  {issue?.title || "Unknown Issue"}
                </h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <MapPin size={14} className="text-slate-400" />
                    <span className="truncate">{issue?.location || "Location pending"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      SLA: {task.slaDeadline}
                    </div>
                    <div className="font-bold text-ink">
                      {task.estimatedCost}
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => navigate(`/contractor-task/${task.id}`)}
                    className={`w-full py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                      isCompleted ? 'bg-slate-50 text-slate-600 hover:bg-slate-100' : 
                      isRework ? 'bg-coral text-white hover:bg-coral-dark shadow-md shadow-coral/20' : 
                      'bg-violet-deep text-white hover:bg-violet shadow-md shadow-violet/20'
                    }`}
                  >
                    {isCompleted ? 'View Proof' : isRework ? 'Fix Issue' : 'Open Task'} <ArrowRight size={16} />
                  </button>
                </div>
                
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
