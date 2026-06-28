export type Role = 'citizen' | 'admin' | 'contractor' | 'auditor';

export interface User {
  email: string;
  name: string;
  role: Role;
  contractorName?: string;
  password?: string;
}

export type IssueStatus = 
  | 'Reported' 
  | 'AI Reviewed' 
  | 'Work Order Created' 
  | 'Contractor Assigned' 
  | 'Repair Uploaded' 
  | 'AI Verified' 
  | 'Rework Required'
  | 'Payment Released'
  | 'Case Closed';

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

export interface AIVerificationResult {
  repairConfidence: number;
  sameLocationMatch: number;
  issueResolved: boolean;
  gpsVerified: boolean;
  timestampVerified: boolean;
  evidenceTamperRisk: string;
  repairQuality: 'Good' | 'Poor';
  recommendation: 'Release Payment' | 'Hold Payment' | 'Request Rework';
  reason: string;
  verifiedByUserId?: string;
  verifiedByName?: string;
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
  createdByUserId?: string;
  createdByName?: string;
  createdByRole?: string;
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
  checklistState?: boolean[];
  afterRepairImageUrl?: string;
  materialNotes?: string;
  completionNotes?: string;
  verificationResult?: AIVerificationResult;
  assignedByUserId?: string;
  assignedByName?: string;
  uploadedByUserId?: string;
  uploadedByName?: string;
  uploadedByContractor?: string;
  approvedByUserId?: string;
  approvedByName?: string;
}
