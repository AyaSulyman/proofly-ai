// Placeholder data standing in for the Django REST API responses during
// frontend development. Every shape here matches lib/types.ts, which in
// turn mirrors the ERD — so swapping these for real `fetch()` calls later
// is a drop-in change, not a redesign.
import type {
  Business,
  Investigation,
  CommunityReport,
  Dispute,
  AppNotification,
} from "./types";

/** Generates a placeholder avatar image URL for demo data. In production
 *  this is replaced by the real `imageUrl` returned from the Business /
 *  User serializer (an uploaded photo stored in Cloudinary/S3). */
function placeholderAvatar(seed: string, bg: string) {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    seed
  )}&backgroundColor=${bg}&fontFamily=Poppins&fontWeight=700`;
}

export const businesses: Business[] = [
  {
    id: "biz_techworld",
    name: "TechWorld Store",
    category: "Electronics & Gadgets",
    website: "techworld-store.com",
    location: "Beirut, Lebanon",
    imageUrl: placeholderAvatar("TechWorld Store", "d9a441"),
    verificationStatus: "verified",
    riskLevel: "low",
    riskScore: 18,
    rating: 4.8,
    reviewCount: 300,
    memberSince: "2025-03-01",
    responseRate: "96% within 2 hrs",
  },
  {
    id: "biz_rapidship",
    name: "RapidShip Sellers",
    category: "General Marketplace",
    phone: "+961 71 234 567",
    imageUrl: null,
    verificationStatus: "unverified",
    riskLevel: "high",
    riskScore: 84,
    rating: 2.1,
    reviewCount: 14,
    memberSince: "2026-08-01",
  },
  {
    id: "biz_globaltech",
    name: "@global_tech_deals",
    category: "Social Seller",
    isIndividual: true,
    imageUrl: placeholderAvatar("Global Tech Deals", "3B5BDB"),
    verificationStatus: "unverified",
    riskLevel: "medium",
    riskScore: 54,
    rating: 3.2,
    reviewCount: 9,
    memberSince: "2026-06-14",
  },
  {
    id: "biz_maya",
    name: "Maya Haddad — Freelance Designer",
    category: "Freelance / Design",
    isIndividual: true,
    email: "maya.h@studio.com",
    imageUrl: placeholderAvatar("Maya Haddad", "1E9E6B"),
    verificationStatus: "verified",
    riskLevel: "low",
    riskScore: 12,
    rating: 4.9,
    reviewCount: 52,
    memberSince: "2024-11-20",
  },
  {
    id: "biz_quickrentals",
    name: "QuickRentals LB",
    category: "Short-term Rentals",
    website: "quickrentals-lb.net",
    imageUrl: null,
    verificationStatus: "unverified",
    riskLevel: "medium",
    riskScore: 58,
    rating: 3.6,
    reviewCount: 21,
    memberSince: "2026-08-30",
  },
];

export const investigations: Investigation[] = [
  {
    id: "inv_1042",
    title: "TechDeals Express — Instagram seller",
    subjectType: "seller",
    status: "completed",
    riskScore: 84,
    riskLevel: "high",
    createdAt: "2026-09-15T07:22:00",
    imageUrl: null,
    identifiers: [
      { id: "id1", type: "url", value: "instagram.com/techdeals.express" },
    ],
    evidence: [
      { id: "ev1", type: "screenshot", fileName: "chat_screenshot_01.png", category: "Content", uploadedAt: "2026-09-15" },
      { id: "ev2", type: "screenshot", fileName: "payment_request.png", category: "Payment", uploadedAt: "2026-09-15" },
      { id: "ev3", type: "url", fileName: "instagram.com/techdeals.express", uploadedAt: "2026-09-15" },
    ],
    riskSignals: [
      { id: "rs1", label: "Advance payment requested outside platform", severity: "high", category: "Payment" },
      { id: "rs2", label: "Urgency / pressure language detected", severity: "high", category: "Content" },
      { id: "rs3", label: "Price significantly below market average", severity: "high", category: "Content" },
      { id: "rs4", label: "Account created 18 days ago", severity: "medium", category: "Technical" },
      { id: "rs5", label: "Linked to 2 other flagged seller accounts", severity: "high", category: "Network" },
    ],
    summary:
      "This seller shows classic advance-payment fraud patterns: urgency language, off-platform payment requests, and a very new account with low engagement relative to claimed sales volume.",
  },
  {
    id: "inv_1029",
    title: "Beachfront Studio — Batroun weekend rental",
    subjectType: "rental",
    status: "completed",
    riskScore: 22,
    riskLevel: "low",
    createdAt: "2026-09-12T09:14:00",
    imageUrl: placeholderAvatar("Beachfront Studio", "1E9E6B"),
    identifiers: [{ id: "id2", type: "url", value: "airbnb.com/rooms/batroun-studio" }],
    evidence: [
      { id: "ev4", type: "screenshot", fileName: "listing_screenshot.png", uploadedAt: "2026-09-12" },
      { id: "ev5", type: "screenshot", fileName: "host_profile.png", uploadedAt: "2026-09-12" },
    ],
    riskSignals: [
      { id: "rs6", label: "No advance-payment pressure detected", severity: "low", category: "Content" },
      { id: "rs7", label: "Consistent identity across platforms", severity: "low", category: "Network" },
    ],
    summary:
      "Host has a consistent booking history, verified identity, and responsive communication. Standard rental safety practices still apply.",
  },
  {
    id: "inv_1035",
    title: "quickrentals-lb.net",
    subjectType: "website",
    status: "completed",
    riskScore: 58,
    riskLevel: "medium",
    createdAt: "2026-09-10T10:00:00",
    imageUrl: null,
    identifiers: [{ id: "id3", type: "domain", value: "quickrentals-lb.net" }],
    evidence: [],
    riskSignals: [
      { id: "rs8", label: "Domain registered 14 days ago", severity: "medium", category: "Technical" },
    ],
  },
  {
    id: "inv_1050",
    title: "Nova Home Appliances",
    subjectType: "business",
    status: "analyzing",
    riskScore: null,
    riskLevel: null,
    createdAt: "2026-09-05T08:00:00",
    imageUrl: placeholderAvatar("Nova Home Appliances", "8C7FD6"),
    identifiers: [],
    evidence: [],
    riskSignals: [],
  },
  {
    id: "inv_draft_1",
    title: "Untitled investigation — draft",
    subjectType: "message",
    status: "draft",
    riskScore: null,
    riskLevel: null,
    createdAt: "2026-09-03T00:00:00",
    imageUrl: null,
    identifiers: [],
    evidence: [],
    riskSignals: [],
  },
];

export const communityReports: CommunityReport[] = [
  {
    id: "rep_2210",
    investigationId: "inv_1042",
    category: "Non-delivery",
    description:
      "Seller advertised an iPhone 16 Pro at $450, insisted on a wire transfer outside the platform, and used urgency language claiming other buyers were waiting.",
    status: "pending",
    createdAt: "2026-09-15",
    subjectName: "TechDeals Express",
  },
  {
    id: "rep_2184",
    investigationId: "inv_1035",
    category: "Payment issue",
    description:
      "Paid a $200 deposit for a short-term rental. The listing was removed within hours and contact stopped. No refund after three follow-up emails over 8 days.",
    status: "approved",
    createdAt: "2026-09-10",
    subjectName: "quickrentals-lb.net",
  },
];

export const disputes: Dispute[] = [
  {
    id: "disp_410",
    reportId: "rep_2184",
    subjectName: "QuickRentals LB",
    status: "awaiting_customer",
    createdAt: "2026-09-12",
    messages: [
      {
        id: "m1",
        author: "reporter",
        authorName: "You (Reporter)",
        text: "Paid a $200 deposit for a short-term rental. The listing was removed within hours and contact stopped. No refund after three follow-up emails over 8 days.",
        attachment: "deposit_transfer_receipt.png",
        createdAt: "2026-09-10",
      },
      {
        id: "m2",
        author: "business",
        authorName: "QuickRentals LB",
        text: "The listing was removed by our system because the host failed ID verification. The deposit was held in escrow and a refund was initiated on Sep 13. Attaching the refund confirmation.",
        attachment: "refund_confirmation_9312.pdf",
        createdAt: "2026-09-14",
      },
    ],
  },
];

export const notifications: AppNotification[] = [
  {
    id: "n1",
    title: "Your response is needed on Dispute #D-410",
    body: "QuickRentals LB submitted a response with refund evidence. Review and reply within 7 days.",
    read: false,
    createdAt: "2026-09-16T06:00:00",
    kind: "dispute",
  },
  {
    id: "n2",
    title: "Report #R-2184 was approved",
    body: "Your payment issue report is now visible on the public trust profile.",
    read: false,
    createdAt: "2026-09-15T09:00:00",
    kind: "report",
  },
  {
    id: "n3",
    title: "High risk detected — TechDeals Express",
    body: "Your investigation completed with a risk score of 84/100. Review the full report.",
    read: false,
    createdAt: "2026-09-15T07:22:00",
    kind: "investigation",
  },
  {
    id: "n4",
    title: "Investigation completed — Beachfront Studio",
    body: "Low risk (22/100). No significant risk signals detected.",
    read: true,
    createdAt: "2026-09-12T09:22:00",
    kind: "investigation",
  },
];

export const currentUser = {
  name: "Sara Ahmed",
  email: "sara.ahmed@email.com",
  phone: "+961 71 234 567",
  location: "Sidon, Lebanon",
  imageUrl: null as string | null,
  role: "Consumer",
};
