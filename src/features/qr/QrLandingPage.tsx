import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Recycle, AlertCircle } from 'lucide-react';

import { resolveQrToken } from '@/mock/services';
import { useSessionStore } from '@/store/sessionStore';

export function QrLandingPage() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const { session, setUnitId } = useSessionStore();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const resolve = async () => {
            if (!token) {
                setError('Invalid QR code');
                setLoading(false);
                return;
            }

            try {
                const result = await resolveQrToken(token);
                if (result.success && result.unitId) {
                    setUnitId(result.unitId);

                    if (session.isAuthenticated) {
                        navigate('/home', { replace: true });
                    } else {
                        navigate('/login', { replace: true });
                    }
                } else {
                    setError(result.error || 'Could not resolve QR code');
                    setLoading(false);
                }
            } catch {
                setError('Something went wrong');
                setLoading(false);
            }
        };

        resolve();
    }, [token, session.isAuthenticated]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24
            }}>
                <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: '#22C55E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24,
                    boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)',
                    animation: 'pulse 1.5s ease-in-out infinite'
                }}>
                    <Recycle style={{ width: 40, height: 40, color: 'white' }} />
                </div>
                <p style={{ fontSize: 16, fontWeight: 500, color: '#0F172A', marginBottom: 8 }}>Verifying QR Code...</p>
                <p style={{ fontSize: 14, color: '#64748B' }}>Please wait</p>

                <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.9; }
          }
        `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                background: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24
            }}>
                <div style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: '#FEE2E2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 24
                }}>
                    <AlertCircle style={{ width: 40, height: 40, color: '#EF4444' }} />
                </div>
                <p style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', marginBottom: 8 }}>Invalid QR Code</p>
                <p style={{ fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 24 }}>{error}</p>
                <button
                    onClick={() => navigate('/qr/demo-token')}
                    style={{
                        padding: '12px 24px',
                        background: '#22C55E',
                        border: 'none',
                        borderRadius: 12,
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer'
                    }}
                >
                    Try Demo QR
                </button>
            </div>
        );
    }

    return null;
}
