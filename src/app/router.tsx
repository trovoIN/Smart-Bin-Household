import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppLayout } from './layout/AppLayout';
import { AuthGuard, PublicGuard } from './guards';

import { QrLandingPage } from '@/features/qr/QrLandingPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { HomePage } from '@/features/dashboard/HomePage';
import { HistoryPage } from '@/features/history/HistoryPage';
import { PaymentPage } from '@/features/payment/PaymentPage';
import { PaymentStatusPage } from '@/features/payment/PaymentStatusPage';
import { ComplaintNewPage } from '@/features/complaints/ComplaintNewPage';
import { ComplaintsListPage } from '@/features/complaints/ComplaintsListPage';
import { ProfilePage } from '@/features/profile/ProfilePage';

export const router = createBrowserRouter([
    // Public routes
    {
        path: '/qr/:token',
        element: <QrLandingPage />,
    },
    {
        path: '/login',
        element: (
            <PublicGuard>
                <LoginPage />
            </PublicGuard>
        ),
    },
    {
        path: '/register',
        element: (
            <PublicGuard>
                <RegisterPage />
            </PublicGuard>
        ),
    },

    // Protected routes with AppLayout
    {
        path: '/',
        element: (
            <AuthGuard>
                <AppLayout />
            </AuthGuard>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/home" replace />,
            },
            {
                path: 'home',
                element: <HomePage />,
            },
            {
                path: 'history',
                element: <HistoryPage />,
            },
            {
                path: 'payment',
                element: <PaymentPage />,
            },
            {
                path: 'payment-status',
                element: <PaymentStatusPage />,
            },
            {
                path: 'complaints',
                element: <ComplaintsListPage />,
            },
            {
                path: 'complaints/new',
                element: <ComplaintNewPage />,
            },
            {
                path: 'profile',
                element: <ProfilePage />,
            },
        ],
    },

    // Catch-all redirect
    {
        path: '*',
        element: <Navigate to="/qr/demo-token" replace />,
    },
]);
