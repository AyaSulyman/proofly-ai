// Types mirror the ERD entities (see Proofly_AI_ERD docx) so the frontend
// contracts line up cleanly with the Django REST Framework serializers.

export type RiskLevel = "low" | "medium" | "high";
export type VerificationStatus = "unverified" | "pending" | "needs_info" | "verified";
export type SubjectType =
  | "seller"
  | "listing"
  | "website"
  | "business"
  | "freelancer"
  | "rental"
  | "message"
  | "other";
export type InvestigationStatus = "draft" | "analyzing" | "completed";
export type ReportStatus = "pending" | "approved" | "rejected";
export type DisputeStatus =
  | "open"
  | "awaiting_business"
  | "awaiting_customer"
  | "under_review"
  | "resolved"
  | "dismissed";

/** A business, seller, or any entity that can carry a public profile image. */
export interface ProfileImage {
  /** URL to an uploaded logo / avatar (Cloudinary/S3). Null if none uploaded yet. */
  imageUrl: string | null;
  /** Display name, used to derive initials + a deterministic fallback color. */
  name: string;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  /** True for an individual seller/freelancer (renders a circular photo),
   *  false/undefined for a company or storefront (renders a rounded-square logo). */
  isIndividual?: boolean;
  website?: string;
  email?: string;
  phone?: string;
  location?: string;
  imageUrl: string | null;
  verificationStatus: VerificationStatus;
  riskLevel: RiskLevel;
  riskScore: number;
  rating: number;
  reviewCount: number;
  memberSince: string;
  responseRate?: string;
}

export interface Identifier {
  id: string;
  type: "phone" | "email" | "domain" | "username" | "url" | "social_handle";
  value: string;
}

export interface EvidenceItem {
  id: string;
  type: "screenshot" | "image" | "document" | "url" | "text";
  fileName: string;
  category?: string;
  uploadedAt: string;
}

export interface RiskSignal {
  id: string;
  label: string;
  severity: RiskLevel;
  category: "Payment" | "Content" | "Technical" | "Network";
}

export interface Investigation {
  id: string;
  title: string;
  subjectType: SubjectType;
  status: InvestigationStatus;
  riskScore: number | null;
  riskLevel: RiskLevel | null;
  createdAt: string;
  imageUrl: string | null;
  identifiers: Identifier[];
  evidence: EvidenceItem[];
  riskSignals: RiskSignal[];
  summary?: string;
}

export interface CommunityReport {
  id: string;
  investigationId: string;
  category: string;
  description: string;
  status: ReportStatus;
  createdAt: string;
  subjectName: string;
}

export interface Dispute {
  id: string;
  reportId: string;
  subjectName: string;
  status: DisputeStatus;
  createdAt: string;
  messages: DisputeMessage[];
}

export interface DisputeMessage {
  id: string;
  author: "reporter" | "business";
  authorName: string;
  text: string;
  attachment?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  kind: "investigation" | "report" | "dispute" | "review" | "system";
}
