import { Issue, AIAnalysis, WorkOrder, Contractor, IssueStatus } from '../types';

// Mock Data
export const MOCK_CONTRACTORS: Contractor[] = [
  {
    id: 'CON-001',
    name: 'AquaFix Services',
    tier: 'Tier 1 Vendor',
    contractorScore: 4.6,
    slaCompliance: '92%',
    repeatFailureRate: '3.1%',
    averageRepairTime: '18 hours',
    isTopMatch: true,
  },
  {
    id: 'CON-002',
    name: 'UrbanFlow Repairs',
    tier: 'Tier 2 Vendor',
    contractorScore: 4.3,
    slaCompliance: '88%',
    repeatFailureRate: '5.2%',
    averageRepairTime: '24 hours',
    isTopMatch: false,
  },
  {
    id: 'CON-003',
    name: 'JalCare Works',
    tier: 'Tier 2 Vendor',
    contractorScore: 4.1,
    slaCompliance: '85%',
    repeatFailureRate: '6.4%',
    averageRepairTime: '36 hours',
    isTopMatch: false,
  }
];

// Utility Functions
export const generateIssueId = () => `ISS-${Math.floor(10000 + Math.random() * 90000)}`;
export const generateWorkOrderId = () => `WO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

// Mock AI Analysis
export const analyzeIssue = async (issue: Partial<Issue>): Promise<AIAnalysis> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const text = `${issue.title} ${issue.category} ${issue.description}`.toLowerCase();
      
      let detectedIssue = 'General Maintenance';
      let category = issue.category || 'General';
      let responsibleTeam = 'General Services';
      let recommendedAction = 'Inspect and report back.';
      
      if (text.includes('water') || text.includes('leakage')) {
        detectedIssue = 'Water Leakage';
        category = 'Water & Sanitation';
        responsibleTeam = 'Water Maintenance';
        recommendedAction = 'Inspect and repair suspected pipeline leakage.';
      } else if (text.includes('pothole') || text.includes('road')) {
        detectedIssue = 'Road Damage';
        category = 'Roads & Transport';
        responsibleTeam = 'Roads Department';
        recommendedAction = 'Fill pothole and level road surface.';
      } else if (text.includes('garbage') || text.includes('waste')) {
        detectedIssue = 'Waste Overflow';
        category = 'Sanitation';
        responsibleTeam = 'Waste Management';
        recommendedAction = 'Clear garbage and sanitize area.';
      } else if (text.includes('light') || text.includes('streetlight')) {
        detectedIssue = 'Streetlight Failure';
        category = 'Electrical';
        responsibleTeam = 'Electrical Department';
        recommendedAction = 'Replace faulty bulb or wiring.';
      }

      resolve({
        detectedIssue,
        category,
        severity: issue.urgency || 'Medium',
        locationConfidence: '92%',
        duplicateRisk: 'Low (8%)',
        evidenceStrength: 'Strong (87%)',
        suggestedSLA: '24 Hours',
        responsibleTeam,
        priorityScore: 87,
        recommendedAction,
      });
    }, 2000); // 2 second mock delay
  });
};

// LocalStorage API
const ISSUES_KEY = 'civica_issues';
const WORK_ORDERS_KEY = 'civica_work_orders';

export const saveIssue = (issue: Issue) => {
  const issues = getIssues();
  issues.push(issue);
  localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
};

export const getIssues = (): Issue[] => {
  const data = localStorage.getItem(ISSUES_KEY);
  return data ? JSON.parse(data) : [];
};

export const getIssueById = (id: string): Issue | undefined => {
  return getIssues().find(i => i.id === id);
};

export const createWorkOrderFromIssue = (issue: Issue, aiAnalysis: AIAnalysis): WorkOrder => {
  const workOrder: WorkOrder = {
    id: generateWorkOrderId(),
    issueId: issue.id,
    workOrderId: generateWorkOrderId(),
    slaDeadline: aiAnalysis.suggestedSLA,
    department: aiAnalysis.responsibleTeam,
    requiredAction: aiAnalysis.recommendedAction,
    estimatedCost: '₹8,500', // Mock cost
    repairInstructions: `Follow standard protocol for ${aiAnalysis.category}. ${aiAnalysis.recommendedAction}`,
    priorityScore: aiAnalysis.priorityScore,
    status: 'Work Order Created',
    paymentRule: {
      imageUploaded: false,
      gpsVerified: false,
      aiConfidenceMet: false,
      adminApproved: false,
    }
  };

  const workOrders = getWorkOrders();
  workOrders.push(workOrder);
  localStorage.setItem(WORK_ORDERS_KEY, JSON.stringify(workOrders));
  
  // Update issue status
  updateIssueStatus(issue.id, 'Work Order Created');
  
  return workOrder;
};

export const getWorkOrders = (): WorkOrder[] => {
  const data = localStorage.getItem(WORK_ORDERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getWorkOrderById = (id: string): WorkOrder | undefined => {
  return getWorkOrders().find(wo => wo.id === id || wo.workOrderId === id);
};

export const updateWorkOrderStatus = (id: string, status: IssueStatus) => {
  const workOrders = getWorkOrders();
  const index = workOrders.findIndex(wo => wo.id === id || wo.workOrderId === id);
  if (index !== -1) {
    workOrders[index].status = status;
    localStorage.setItem(WORK_ORDERS_KEY, JSON.stringify(workOrders));
    
    // Also update associated issue
    updateIssueStatus(workOrders[index].issueId, status);
  }
};

export const updateIssueStatus = (id: string, status: IssueStatus) => {
  const issues = getIssues();
  const index = issues.findIndex(i => i.id === id);
  if (index !== -1) {
    issues[index].status = status;
    localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
  }
};
