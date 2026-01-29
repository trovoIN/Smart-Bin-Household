import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session } from '@/types/models';

interface SessionState {
    session: Session;
    setSession: (session: Session) => void;
    setUnitId: (unitId: string) => void;
    login: (mobile: string, unitId: string | null) => void;
    logout: () => void;
}

const initialSession: Session = {
    isAuthenticated: false,
    mobile: null,
    unitId: null,
    authenticatedAt: null,
};

export const useSessionStore = create<SessionState>()(
    persist(
        (set) => ({
            session: initialSession,
            setSession: (session) => set({ session }),
            setUnitId: (unitId) =>
                set((state) => ({
                    session: { ...state.session, unitId },
                })),
            login: (mobile, unitId) =>
                set({
                    session: {
                        isAuthenticated: true,
                        mobile,
                        unitId,
                        authenticatedAt: new Date().toISOString(),
                    },
                }),
            logout: () => set({ session: initialSession }),
        }),
        {
            name: 'hsb_session_v1',
        }
    )
);
