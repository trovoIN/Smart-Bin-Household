import type { MockDatabase } from '@/types/models';
import {
    PaymentStatus,
    CollectionStatus,
    ComplaintStatus,
    ComplaintType,
} from '@/types/models';

// Generate dates for the last 30 days
const generateCollectionDates = (): string[] => {
    const dates: string[] = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
};

const collectionDates = generateCollectionDates();

// Get current month in YYYY-MM format
const getCurrentMonth = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// Get due date (15th of current month)
const getDueDate = (): string => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-15`;
};

export const seedData: MockDatabase = {
    collectors: [
        {
            id: 'collector-001',
            name: 'Ramesh Kumar',
            mobile: '9876543210',
            upiId: 'ramesh.kumar@paytm',
            photoUrl: undefined,
        },
        {
            id: 'collector-002',
            name: 'Suresh Sharma',
            mobile: '9876543211',
            upiId: 'suresh.sharma@gpay',
            photoUrl: undefined,
        },
    ],

    units: [
        {
            id: 'unit-001',
            unitNo: 'A-101',
            address: '101, Green Valley Apartments, Sector 15',
            ward: 'Ward 12',
            area: 'Sector 15, Gurgaon',
            registeredMobile: '9898989898',
            collectorId: 'collector-001',
            monthlyFee: 150,
        },
        {
            id: 'unit-002',
            unitNo: 'B-205',
            address: '205, Blue Ridge Society, Sector 22',
            ward: 'Ward 8',
            area: 'Sector 22, Gurgaon',
            registeredMobile: '9797979797',
            collectorId: 'collector-002',
            monthlyFee: 200,
        },
    ],

    payments: [
        {
            id: 'payment-001',
            unitId: 'unit-001',
            month: getCurrentMonth(),
            amount: 150,
            status: PaymentStatus.UNPAID,
            dueDate: getDueDate(),
        },
        {
            id: 'payment-002',
            unitId: 'unit-002',
            month: getCurrentMonth(),
            amount: 200,
            status: PaymentStatus.UNPAID,
            dueDate: getDueDate(),
        },
    ],

    collections: [
        // Generate mixed collection entries for unit-001
        ...collectionDates.slice(0, 25).map((date, index) => ({
            id: `collection-001-${index}`,
            unitId: 'unit-001',
            date,
            status: index % 7 === 0 ? CollectionStatus.MISSED : CollectionStatus.COLLECTED,
            collectorId: 'collector-001',
            notes: index % 7 === 0 ? 'Gate was locked' : undefined,
        })),
        // Generate collection entries for unit-002
        ...collectionDates.slice(0, 20).map((date, index) => ({
            id: `collection-002-${index}`,
            unitId: 'unit-002',
            date,
            status: index % 10 === 0 ? CollectionStatus.MISSED : CollectionStatus.COLLECTED,
            collectorId: 'collector-002',
            notes: index % 10 === 0 ? 'No one at home' : undefined,
        })),
    ],

    complaints: [
        {
            id: 'complaint-001',
            unitId: 'unit-001',
            type: ComplaintType.MISSED_COLLECTION,
            description: 'Garbage was not collected for 2 days in a row.',
            status: ComplaintStatus.RESOLVED,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            resolution: 'Issue has been addressed. Collection resumed.',
        },
        {
            id: 'complaint-002',
            unitId: 'unit-001',
            type: ComplaintType.BILLING_ISSUE,
            description: 'I was charged twice for last month.',
            status: ComplaintStatus.OPEN,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ],

    qrTokenMappings: [
        {
            token: 'demo-token',
            unitId: 'unit-001',
        },
        {
            token: 'demo-token-2',
            unitId: 'unit-002',
        },
        {
            token: 'A101-QR-2024',
            unitId: 'unit-001',
        },
        {
            token: 'B205-QR-2024',
            unitId: 'unit-002',
        },
    ],
};
