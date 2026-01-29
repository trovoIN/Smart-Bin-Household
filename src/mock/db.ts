import { storage, STORAGE_KEYS } from '@/utils/storage';
import { seedData } from './seed';
import type {
    MockDatabase,
    Unit,
    Collector,
    Payment,
    CollectionEntry,
    Complaint,
    QrTokenMapping,
} from '@/types/models';

class MockDB {
    private data: MockDatabase;

    constructor() {
        this.data = this.load();
    }

    private load(): MockDatabase {
        const stored = storage.get<MockDatabase>(STORAGE_KEYS.MOCK_DB);
        if (stored) {
            return stored;
        }
        // Initialize with seed data
        this.save(seedData);
        return seedData;
    }

    private save(data: MockDatabase): void {
        this.data = data;
        storage.set(STORAGE_KEYS.MOCK_DB, data);
    }

    // Reset to seed data
    reset(): void {
        this.save({ ...seedData });
    }

    // ==================== QR TOKEN ====================

    getQrTokenMapping(token: string): QrTokenMapping | undefined {
        return this.data.qrTokenMappings.find((mapping) => mapping.token === token);
    }

    // ==================== UNITS ====================

    getUnit(unitId: string): Unit | undefined {
        return this.data.units.find((unit) => unit.id === unitId);
    }

    getUnitByMobile(mobile: string): Unit | undefined {
        return this.data.units.find((unit) => unit.registeredMobile === mobile);
    }

    // ==================== COLLECTORS ====================

    getCollector(collectorId: string): Collector | undefined {
        return this.data.collectors.find((collector) => collector.id === collectorId);
    }

    // ==================== PAYMENTS ====================

    getPayment(unitId: string): Payment | undefined {
        return this.data.payments.find((payment) => payment.unitId === unitId);
    }

    updatePayment(paymentId: string, updates: Partial<Payment>): Payment | undefined {
        const index = this.data.payments.findIndex((p) => p.id === paymentId);
        if (index === -1) return undefined;

        this.data.payments[index] = {
            ...this.data.payments[index],
            ...updates,
        };
        this.save(this.data);
        return this.data.payments[index];
    }

    // ==================== COLLECTIONS ====================

    getCollections(unitId: string): CollectionEntry[] {
        return this.data.collections
            .filter((collection) => collection.unitId === unitId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // ==================== COMPLAINTS ====================

    getComplaints(unitId: string): Complaint[] {
        return this.data.complaints
            .filter((complaint) => complaint.unitId === unitId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    getComplaint(complaintId: string): Complaint | undefined {
        return this.data.complaints.find((complaint) => complaint.id === complaintId);
    }

    addComplaint(complaint: Complaint): Complaint {
        this.data.complaints.push(complaint);
        this.save(this.data);
        return complaint;
    }

    updateComplaint(complaintId: string, updates: Partial<Complaint>): Complaint | undefined {
        const index = this.data.complaints.findIndex((c) => c.id === complaintId);
        if (index === -1) return undefined;

        this.data.complaints[index] = {
            ...this.data.complaints[index],
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        this.save(this.data);
        return this.data.complaints[index];
    }
}

// Export singleton instance
export const mockDB = new MockDB();
