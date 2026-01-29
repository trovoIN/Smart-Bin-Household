// ==================== ENUMS (as const objects for erasableSyntaxOnly) ====================

export const PaymentStatus = {
    UNPAID: 'UNPAID',
    CLAIMED: 'CLAIMED',
    VERIFIED: 'VERIFIED',
} as const;
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export const CollectionStatus = {
    COLLECTED: 'COLLECTED',
    MISSED: 'MISSED',
} as const;
export type CollectionStatus = typeof CollectionStatus[keyof typeof CollectionStatus];

export const ComplaintStatus = {
    OPEN: 'OPEN',
    IN_PROGRESS: 'IN_PROGRESS',
    RESOLVED: 'RESOLVED',
    CLOSED: 'CLOSED',
} as const;
export type ComplaintStatus = typeof ComplaintStatus[keyof typeof ComplaintStatus];

export const ComplaintType = {
    MISSED_COLLECTION: 'MISSED_COLLECTION',
    RUDE_BEHAVIOR: 'RUDE_BEHAVIOR',
    IMPROPER_DISPOSAL: 'IMPROPER_DISPOSAL',
    BILLING_ISSUE: 'BILLING_ISSUE',
    OTHER: 'OTHER',
} as const;
export type ComplaintType = typeof ComplaintType[keyof typeof ComplaintType];

// ==================== MODELS ====================

export interface Collector {
    id: string;
    name: string;
    mobile: string;
    upiId: string;
    photoUrl?: string;
}

export interface Unit {
    id: string;
    unitNo: string;
    address: string;
    ward: string;
    area: string;
    registeredMobile: string;
    collectorId: string;
    monthlyFee: number;
}

export interface Payment {
    id: string;
    unitId: string;
    month: string; // Format: YYYY-MM
    amount: number;
    status: PaymentStatus;
    dueDate: string;
    claimedAt?: string;
    verifiedAt?: string;
    utr?: string;
    screenshotUrl?: string;
}

export interface CollectionEntry {
    id: string;
    unitId: string;
    date: string;
    status: CollectionStatus;
    collectorId: string;
    notes?: string;
}

export interface Complaint {
    id: string;
    unitId: string;
    type: ComplaintType;
    description: string;
    status: ComplaintStatus;
    createdAt: string;
    updatedAt: string;
    photoUrl?: string;
    resolution?: string;
}

export interface Session {
    isAuthenticated: boolean;
    mobile: string | null;
    unitId: string | null;
    authenticatedAt: string | null;
}

// ==================== QR TOKEN MAPPING ====================

export interface QrTokenMapping {
    token: string;
    unitId: string;
}

// ==================== MOCK DATABASE ====================

export interface MockDatabase {
    units: Unit[];
    collectors: Collector[];
    payments: Payment[];
    collections: CollectionEntry[];
    complaints: Complaint[];
    qrTokenMappings: QrTokenMapping[];
}

// ==================== API RESPONSES ====================

export interface DashboardData {
    unit: Unit;
    collector: Collector;
    currentPayment: Payment;
    recentCollections: CollectionEntry[];
}

export interface PaymentProof {
    utr?: string;
    screenshotUrl?: string;
}

export interface CreateComplaintPayload {
    type: ComplaintType;
    description: string;
    photoUrl?: string;
}
