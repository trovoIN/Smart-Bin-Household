import { create } from 'zustand';
import type {
    DashboardData,
    CollectionEntry,
    Payment,
    Collector,
    Complaint,
} from '@/types/models';

interface HouseholdState {
    // Dashboard
    dashboardData: DashboardData | null;
    dashboardLoading: boolean;
    setDashboardData: (data: DashboardData | null) => void;
    setDashboardLoading: (loading: boolean) => void;

    // Collections
    collections: CollectionEntry[];
    collectionsLoading: boolean;
    setCollections: (collections: CollectionEntry[]) => void;
    setCollectionsLoading: (loading: boolean) => void;

    // Payment
    payment: Payment | null;
    collector: Collector | null;
    paymentLoading: boolean;
    setPayment: (payment: Payment | null) => void;
    setCollector: (collector: Collector | null) => void;
    setPaymentLoading: (loading: boolean) => void;

    // Complaints
    complaints: Complaint[];
    complaintsLoading: boolean;
    setComplaints: (complaints: Complaint[]) => void;
    setComplaintsLoading: (loading: boolean) => void;

    // Reset
    reset: () => void;
}

export const useHouseholdStore = create<HouseholdState>((set) => ({
    // Dashboard
    dashboardData: null,
    dashboardLoading: false,
    setDashboardData: (data) => set({ dashboardData: data }),
    setDashboardLoading: (loading) => set({ dashboardLoading: loading }),

    // Collections
    collections: [],
    collectionsLoading: false,
    setCollections: (collections) => set({ collections }),
    setCollectionsLoading: (loading) => set({ collectionsLoading: loading }),

    // Payment
    payment: null,
    collector: null,
    paymentLoading: false,
    setPayment: (payment) => set({ payment }),
    setCollector: (collector) => set({ collector }),
    setPaymentLoading: (loading) => set({ paymentLoading: loading }),

    // Complaints
    complaints: [],
    complaintsLoading: false,
    setComplaints: (complaints) => set({ complaints }),
    setComplaintsLoading: (loading) => set({ complaintsLoading: loading }),

    // Reset
    reset: () =>
        set({
            dashboardData: null,
            dashboardLoading: false,
            collections: [],
            collectionsLoading: false,
            payment: null,
            collector: null,
            paymentLoading: false,
            complaints: [],
            complaintsLoading: false,
        }),
}));
