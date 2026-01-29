import { PaymentStatus, CollectionStatus, ComplaintStatus, ComplaintType } from '@/types/models';

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

export const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatMonth = (monthString: string): string => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
    });
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatMobile = (mobile: string): string => {
    if (mobile.length === 10) {
        return `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`;
    }
    return mobile;
};

export const getPaymentStatusLabel = (status: PaymentStatus): string => {
    switch (status) {
        case PaymentStatus.UNPAID:
            return 'Unpaid';
        case PaymentStatus.CLAIMED:
            return 'Verification Pending';
        case PaymentStatus.VERIFIED:
            return 'Verified';
        default:
            return status;
    }
};

export const getCollectionStatusLabel = (status: CollectionStatus): string => {
    switch (status) {
        case CollectionStatus.COLLECTED:
            return 'Collected';
        case CollectionStatus.MISSED:
            return 'Missed';
        default:
            return status;
    }
};

export const getComplaintStatusLabel = (status: ComplaintStatus): string => {
    switch (status) {
        case ComplaintStatus.OPEN:
            return 'Open';
        case ComplaintStatus.IN_PROGRESS:
            return 'In Progress';
        case ComplaintStatus.RESOLVED:
            return 'Resolved';
        case ComplaintStatus.CLOSED:
            return 'Closed';
        default:
            return status;
    }
};

export const getComplaintTypeLabel = (type: ComplaintType): string => {
    switch (type) {
        case ComplaintType.MISSED_COLLECTION:
            return 'Missed Collection';
        case ComplaintType.RUDE_BEHAVIOR:
            return 'Rude Behavior';
        case ComplaintType.IMPROPER_DISPOSAL:
            return 'Improper Disposal';
        case ComplaintType.BILLING_ISSUE:
            return 'Billing Issue';
        case ComplaintType.OTHER:
            return 'Other';
        default:
            return type;
    }
};

export const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getCurrentMonth = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};
