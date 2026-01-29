import { mockDB } from './db';
import { randomDelay } from '@/utils/delay';
import { generateId, getCurrentMonth } from '@/utils/format';
import {
    type Collector,
    type Payment,
    type CollectionEntry,
    type Complaint,
    type DashboardData,
    type PaymentProof,
    type CreateComplaintPayload,
    type Session,
    PaymentStatus,
    ComplaintStatus,
} from '@/types/models';
import { storage, STORAGE_KEYS } from '@/utils/storage';

// ==================== AUTH SERVICES ====================

export const resolveQrToken = async (
    token: string
): Promise<{ success: boolean; unitId?: string; error?: string }> => {
    await randomDelay();

    const mapping = mockDB.getQrTokenMapping(token);
    if (!mapping) {
        return { success: false, error: 'Invalid QR code' };
    }

    const unit = mockDB.getUnit(mapping.unitId);
    if (!unit) {
        return { success: false, error: 'Unit not found' };
    }

    return { success: true, unitId: mapping.unitId };
};

export const sendOtp = async (
    mobile: string
): Promise<{ success: boolean; error?: string }> => {
    await randomDelay();

    // Validate mobile number (10 digits)
    if (!/^[6-9]\d{9}$/.test(mobile)) {
        return { success: false, error: 'Invalid mobile number' };
    }

    // In real app, this would send an OTP
    // For demo, we just return success
    console.log(`[Mock] OTP sent to ${mobile}: 123456`);
    return { success: true };
};

export const verifyOtp = async (
    mobile: string,
    otp: string
): Promise<{ success: boolean; session?: Session; error?: string }> => {
    await randomDelay();

    // Mock OTP verification - accept 123456
    if (otp !== '123456') {
        return { success: false, error: 'Invalid OTP' };
    }

    const session: Session = {
        isAuthenticated: true,
        mobile,
        unitId: null, // Will be set by the app
        authenticatedAt: new Date().toISOString(),
    };

    return { success: true, session };
};

// ==================== DASHBOARD SERVICES ====================

export const getDashboard = async (
    unitId: string
): Promise<{ success: boolean; data?: DashboardData; error?: string }> => {
    await randomDelay();

    const unit = mockDB.getUnit(unitId);
    if (!unit) {
        return { success: false, error: 'Unit not found' };
    }

    const collector = mockDB.getCollector(unit.collectorId);
    if (!collector) {
        return { success: false, error: 'Collector not found' };
    }

    let payment = mockDB.getPayment(unitId);
    if (!payment) {
        // Create a default payment for current month
        payment = {
            id: generateId(),
            unitId,
            month: getCurrentMonth(),
            amount: unit.monthlyFee,
            status: PaymentStatus.UNPAID,
            dueDate: `${getCurrentMonth()}-15`,
        };
    }

    const recentCollections = mockDB.getCollections(unitId).slice(0, 5);

    return {
        success: true,
        data: {
            unit,
            collector,
            currentPayment: payment,
            recentCollections,
        },
    };
};

// ==================== COLLECTION SERVICES ====================

export const getCollections = async (
    unitId: string
): Promise<{ success: boolean; data?: CollectionEntry[]; error?: string }> => {
    await randomDelay();

    const collections = mockDB.getCollections(unitId);
    return { success: true, data: collections };
};

// ==================== PAYMENT SERVICES ====================

export const getPayment = async (
    unitId: string
): Promise<{ success: boolean; data?: { payment: Payment; collector: Collector }; error?: string }> => {
    await randomDelay();

    const unit = mockDB.getUnit(unitId);
    if (!unit) {
        return { success: false, error: 'Unit not found' };
    }

    const collector = mockDB.getCollector(unit.collectorId);
    if (!collector) {
        return { success: false, error: 'Collector not found' };
    }

    let payment = mockDB.getPayment(unitId);
    if (!payment) {
        payment = {
            id: generateId(),
            unitId,
            month: getCurrentMonth(),
            amount: unit.monthlyFee,
            status: PaymentStatus.UNPAID,
            dueDate: `${getCurrentMonth()}-15`,
        };
    }

    return { success: true, data: { payment, collector } };
};

export const claimPayment = async (
    unitId: string
): Promise<{ success: boolean; data?: Payment; error?: string }> => {
    await randomDelay();

    const payment = mockDB.getPayment(unitId);
    if (!payment) {
        return { success: false, error: 'Payment not found' };
    }

    const updated = mockDB.updatePayment(payment.id, {
        status: PaymentStatus.CLAIMED,
        claimedAt: new Date().toISOString(),
    });

    return { success: true, data: updated };
};

export const uploadPaymentProof = async (
    unitId: string,
    proof: PaymentProof
): Promise<{ success: boolean; data?: Payment; error?: string }> => {
    await randomDelay();

    if (!proof.utr && !proof.screenshotUrl) {
        return { success: false, error: 'Please provide UTR or screenshot' };
    }

    const payment = mockDB.getPayment(unitId);
    if (!payment) {
        return { success: false, error: 'Payment not found' };
    }

    const updated = mockDB.updatePayment(payment.id, {
        status: PaymentStatus.CLAIMED,
        claimedAt: new Date().toISOString(),
        utr: proof.utr,
        screenshotUrl: proof.screenshotUrl,
    });

    return { success: true, data: updated };
};

export const devMarkVerified = async (
    unitId: string
): Promise<{ success: boolean; data?: Payment; error?: string }> => {
    await randomDelay(200, 400);

    const payment = mockDB.getPayment(unitId);
    if (!payment) {
        return { success: false, error: 'Payment not found' };
    }

    const updated = mockDB.updatePayment(payment.id, {
        status: PaymentStatus.VERIFIED,
        verifiedAt: new Date().toISOString(),
    });

    return { success: true, data: updated };
};

// ==================== COMPLAINT SERVICES ====================

export const createComplaint = async (
    unitId: string,
    payload: CreateComplaintPayload
): Promise<{ success: boolean; data?: Complaint; error?: string }> => {
    await randomDelay();

    if (!payload.description.trim()) {
        return { success: false, error: 'Description is required' };
    }

    const complaint: Complaint = {
        id: generateId(),
        unitId,
        type: payload.type,
        description: payload.description,
        status: ComplaintStatus.OPEN,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        photoUrl: payload.photoUrl,
    };

    const created = mockDB.addComplaint(complaint);
    return { success: true, data: created };
};

export const listComplaints = async (
    unitId: string
): Promise<{ success: boolean; data?: Complaint[]; error?: string }> => {
    await randomDelay();

    const complaints = mockDB.getComplaints(unitId);
    return { success: true, data: complaints };
};

// ==================== RESET SERVICES ====================

export const resetMockData = async (): Promise<{ success: boolean }> => {
    await randomDelay(200, 400);
    mockDB.reset();
    storage.remove(STORAGE_KEYS.SESSION);
    return { success: true };
};
