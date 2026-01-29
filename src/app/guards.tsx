import { Navigate, useLocation } from 'react-router-dom';
import { useSessionStore } from '@/store/sessionStore';

interface GuardProps {
    children: React.ReactNode;
}

/**
 * Guard that requires a unit to be selected via QR scan
 */
export function RequireUnitGuard({ children }: GuardProps) {
    const { session } = useSessionStore();
    const location = useLocation();

    if (!session.unitId) {
        // Redirect to QR landing page with demo token
        return <Navigate to="/qr/demo-token" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

/**
 * Guard that requires user to be authenticated
 */
export function AuthGuard({ children }: GuardProps) {
    const { session } = useSessionStore();
    const location = useLocation();

    if (!session.isAuthenticated) {
        // Redirect to login page
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!session.unitId) {
        // No unit selected, redirect to QR
        return <Navigate to="/qr/demo-token" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

/**
 * Guard for public routes - redirects to home if already authenticated
 */
export function PublicGuard({ children }: GuardProps) {
    const { session } = useSessionStore();

    if (session.isAuthenticated && session.unitId) {
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
}
