import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, ArrowLeft, Eye } from 'lucide-react';
import { toast } from 'sonner';

import { getPayment, devMarkVerified } from '@/mock/services';
import { useSessionStore } from '@/store/sessionStore';
import { useHouseholdStore } from '@/store/householdStore';
import { formatCurrency, formatMonth, getPaymentStatusLabel } from '@/utils/format';
import { PaymentStatus } from '@/types/models';

export function PaymentStatusPage() {
    const navigate = useNavigate();
    const { session } = useSessionStore();
    const { payment, collector, paymentLoading, setPayment, setCollector, setPaymentLoading } = useHouseholdStore();
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        const fetchPayment = async () => {
            if (!session.unitId) return;

            setPaymentLoading(true);
            try {
                const result = await getPayment(session.unitId);
                if (result.success && result.data) {
                    setPayment(result.data.payment);
                    setCollector(result.data.collector);
                }
            } catch (error) {
                console.error('Failed to fetch payment:', error);
            } finally {
                setPaymentLoading(false);
            }
        };

        fetchPayment();
    }, [session.unitId]);

    const handleDevVerify = async () => {
        if (!session.unitId) return;

        setVerifying(true);
        try {
            const result = await devMarkVerified(session.unitId);
            if (result.success && result.data) {
                setPayment(result.data);
                toast.success('Payment verified!');
            }
        } catch {
            toast.error('Verification failed');
        } finally {
            setVerifying(false);
        }
    };

    if (paymentLoading || !payment) {
        return (
            <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 32, height: 32, border: '3px solid #E2E8F0', borderTopColor: '#22C55E', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    const getStatusConfig = () => {
        switch (payment.status) {
            case PaymentStatus.VERIFIED:
                return { icon: CheckCircle, bg: '#22C55E', label: 'Payment Verified', desc: 'Your payment has been confirmed' };
            case PaymentStatus.CLAIMED:
                return { icon: Clock, bg: '#F59E0B', label: 'Pending Verification', desc: 'Collector will verify your payment soon' };
            default:
                return { icon: AlertCircle, bg: '#EF4444', label: 'Payment Required', desc: 'Please make your payment' };
        }
    };

    const config = getStatusConfig();
    const StatusIcon = config.icon;

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: 100 }}>
            {/* Header */}
            <div style={{ background: 'white', padding: '16px', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ maxWidth: 448, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => navigate('/home')} style={{ width: 36, height: 36, borderRadius: 10, background: '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <ArrowLeft style={{ width: 18, height: 18, color: '#0F172A' }} />
                    </button>
                    <h1 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A' }}>Payment Status</h1>
                </div>
            </div>

            <div style={{ padding: 16 }}>
                <div style={{ maxWidth: 448, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Status Hero */}
                    <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                        <div style={{ background: config.bg, padding: 32, textAlign: 'center', color: 'white' }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <StatusIcon style={{ width: 32, height: 32 }} />
                            </div>
                            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{config.label}</h2>
                            <p style={{ fontSize: 13, opacity: 0.8 }}>{config.desc}</p>
                        </div>
                        <div style={{ background: 'white', padding: 20, textAlign: 'center' }}>
                            <p style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>{formatMonth(payment.month)}</p>
                            <p style={{ fontSize: 28, fontWeight: 700, color: '#0F172A' }}>{formatCurrency(payment.amount)}</p>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginBottom: 8, paddingLeft: 4 }}>Payment Details</p>
                        <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #E2E8F0' }}>
                                <span style={{ fontSize: 13, color: '#64748B' }}>Status</span>
                                <span style={{
                                    padding: '4px 10px',
                                    borderRadius: 20,
                                    fontSize: 11,
                                    fontWeight: 500,
                                    background: payment.status === PaymentStatus.VERIFIED ? '#DCFCE7' : payment.status === PaymentStatus.CLAIMED ? '#FEF3C7' : '#FEE2E2',
                                    color: payment.status === PaymentStatus.VERIFIED ? '#16A34A' : payment.status === PaymentStatus.CLAIMED ? '#D97706' : '#DC2626'
                                }}>
                                    {getPaymentStatusLabel(payment.status)}
                                </span>
                            </div>
                            {payment.utr && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #E2E8F0' }}>
                                    <span style={{ fontSize: 13, color: '#64748B' }}>UTR</span>
                                    <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', fontFamily: 'monospace' }}>{payment.utr}</span>
                                </div>
                            )}
                            {payment.claimedAt && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 13, color: '#64748B' }}>Submitted</span>
                                    <span style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>
                                        {new Date(payment.claimedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Collector Info */}
                    {collector && (
                        <div>
                            <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginBottom: 8, paddingLeft: 4 }}>Your Collector</p>
                            <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#F1F5F9', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${collector.id}`} alt={collector.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>{collector.name}</p>
                                        <p style={{ fontSize: 12, color: '#64748B' }}>{collector.mobile}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dev Verify Button */}
                    {payment.status === PaymentStatus.CLAIMED && (
                        <button
                            onClick={handleDevVerify}
                            disabled={verifying}
                            style={{
                                width: '100%',
                                padding: 14,
                                background: '#22C55E',
                                border: 'none',
                                borderRadius: 12,
                                color: 'white',
                                fontSize: 14,
                                fontWeight: 500,
                                cursor: verifying ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8
                            }}
                        >
                            <Eye style={{ width: 18, height: 18 }} />
                            {verifying ? 'Verifying...' : '[Dev] Simulate Verification'}
                        </button>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
