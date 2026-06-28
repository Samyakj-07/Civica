export type IssueStatus = 
  | 'Reported' 
  | 'AI Reviewed' 
  | 'Work Order Created' 
  | 'Contractor Assigned' 
  | 'Repair Uploaded' 
  | 'AI Verified' 
  | 'Payment Released';

export interface AIAnalysis {
  detectedIssue: string;
  category: string;
  severity: string;
  locationConfidence: string;
  duplicateRisk: string;
  evidenceStrength: string;
  suggestedSLA: string;
  responsibleTeam: string;
  priorityScore: number;
  recommendedAction: string;
}

export interface Issue {
  id: string;
  title: string;
  category: string;
  description: string;
  urgency: string;
  severity: string;
  location: string;
  reportedBy: string;
  createdAt: string;
  beforeImageUrl: string;
  status: IssueStatus;
  aiAnalysis?: AIAnalysis;
}

export interface Contractor {
  id: string;
  name: string;
  tier: string;
  contractorScore: number;
  slaCompliance: string;
  repeatFailureRate: string;
  averageRepairTime: string;
  isTopMatch: boolean;
}

export interface PaymentRule {
  imageUploaded: boolean;
  gpsVerified: boolean;
  aiConfidenceMet: boolean;
  adminApproved: boolean;
}

export interface WorkOrder {
  id: string;
  issueId: string;
  workOrderId: string;
  slaDeadline: string;
  department: string;
  requiredAction: string;
  estimatedCost: string;
  repairInstructions: string;
  priorityScore: number;
  assignedContractor?: Contractor;
  status: IssueStatus;
  paymentRule: PaymentRule;
}
