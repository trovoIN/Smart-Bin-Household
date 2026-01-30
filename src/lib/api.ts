import type { Session } from '@/types/models';

const API_BASE_URL = 'http://localhost:3000/api';

export class ApiError extends Error {
    public status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.status = status;
    }
}


async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    } as HeadersInit;

    // Add token if it exists in local storage
    const token = localStorage.getItem('token');
    if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new ApiError(data.error || 'Something went wrong', response.status);
    }

    return data.data as T;
}

// ==================== AUTH SERVICES ====================

export const sendOtp = async (mobile: string): Promise<{ success: boolean; error?: string }> => {
    try {
        await fetchJson('/auth/request-otp', {
            method: 'POST',
            body: JSON.stringify({ phone: `+91${mobile}`, userType: 'household' }),
        });
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const verifyOtp = async (mobile: string, otp: string): Promise<{ success: boolean; session?: Session; error?: string }> => {
    try {
        const data: any = await fetchJson('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ phone: `+91${mobile}`, code: otp, userType: 'household' }),
        });

        // Store token
        localStorage.setItem('token', data.accessToken);

        // Decode token or get user info (simplified for now)
        const session: Session = {
            isAuthenticated: true,
            mobile,
            unitId: data.unitId || null,
            authenticatedAt: new Date().toISOString(),
        };

        return { success: true, session };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

// ==================== REGISTRATION ====================

export const registerHousehold = async (data: {
    unitNumber: string;
    householdPhone: string;
    residentName: string;
    latitude: number;
    longitude: number;
}): Promise<{ success: boolean; tokens?: any; error?: string }> => {
    try {
        const response: any = await fetchJson('/household/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (response.tokens) {
            localStorage.setItem('token', response.tokens.accessToken);
        }

        return { success: true, tokens: response.tokens };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

// ==================== DASHBOARD SERVICES ====================

export const getDashboard = async (unitId: string) => {
    // Implement dashboard fetch
    // return fetchJson(`/household/${unitId}/dashboard`);
    // For now, let's just return what the mock did if backend not ready?
    // Actually backend IS ready.
    try {
        const data = await fetchJson<any>('/household/dashboard');
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getQR = async () => {
    try {
        const data = await fetchJson<any>('/household/qr');
        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};
