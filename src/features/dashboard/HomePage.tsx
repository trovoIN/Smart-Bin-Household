import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    CreditCard,
    History,
    MessageSquare,
    Phone,
    ChevronRight,
    CheckCircle,
    Leaf,
} from 'lucide-react';

import { LoadingDashboard } from '@/components/common/LoadingCard';
import { DigitalQR } from '@/components/DigitalQR';
import { getDashboard } from '@/lib/api';
import { useSessionStore } from '@/store/sessionStore';
import { useHouseholdStore } from '@/store/householdStore';
import { formatCurrency, formatMonth, getPaymentStatusLabel } from '@/utils/format';
import { PaymentStatus } from '@/types/models';

export function HomePage() {
    const navigate = useNavigate();
    const { session } = useSessionStore();
    const { dashboardData, dashboardLoading, setDashboardData, setDashboardLoading } = useHouseholdStore();

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!session.unitId) return;

            setDashboardLoading(true);
            try {
                const result = await getDashboard(session.unitId);
                if (result.success && result.data) {
                    setDashboardData(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard:', error);
            } finally {
                setDashboardLoading(false);
            }
        };

        fetchDashboard();
    }, [session.unitId]);

    if (dashboardLoading || !dashboardData) {
        return (
            <div style={{ padding: 16, maxWidth: 448, margin: '0 auto' }}>
                <LoadingDashboard />
            </div>
        );
    }

    const { unit, collector, currentPayment, recentCollections } = dashboardData;
    const collectedCount = recentCollections.filter((c) => c.status === 'COLLECTED').length;
    const missedCount = recentCollections.filter((c) => c.status === 'MISSED').length;

    const getStatusColor = (status: string) => {
        if (status === PaymentStatus.VERIFIED) return { bg: '#DCFCE7', text: '#16A34A' };
        if (status === PaymentStatus.CLAIMED) return { bg: '#FEF3C7', text: '#D97706' };
        return { bg: '#FEE2E2', text: '#DC2626' };
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: 100 }}>
            {/* Header */}
            <div style={{ background: 'white', padding: '20px 16px' }}>
                <div style={{ maxWidth: 448, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            background: 'rgba(34, 197, 94, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <User style={{ width: 22, height: 22, color: '#22C55E' }} />
                        </div>
                        <div>
                            <p style={{ fontSize: 12, color: '#64748B' }}>Hello,</p>
                            <h1 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>Unit {unit.unitNo}</h1>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/profile')}
                        style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                            {[1, 2, 3, 4].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#0F172A' }} />)}
                        </div>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: 16 }}>
                <div style={{ maxWidth: 448, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Stats Card */}
                    <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                        <div style={{ padding: 20, textAlign: 'center' }}>
                            <p style={{ fontSize: 32, fontWeight: 700, color: '#0F172A' }}>
                                {collectedCount * 2}<span style={{ fontSize: 14, fontWeight: 500, marginLeft: 4 }}>kg</span>
                            </p>
                            <p style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Waste collected this month</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid #E2E8F0' }}>
                            <div style={{ padding: 12, textAlign: 'center', borderRight: '1px solid #E2E8F0' }}>
                                <p style={{ fontSize: 20, fontWeight: 700, color: '#22C55E' }}>{collectedCount}</p>
                                <p style={{ fontSize: 10, color: '#64748B' }}>Collected</p>
                            </div>
                            <div style={{ padding: 12, textAlign: 'center' }}>
                                <p style={{ fontSize: 20, fontWeight: 700, color: '#EF4444' }}>{missedCount}</p>
                                <p style={{ fontSize: 10, color: '#64748B' }}>Missed</p>
                            </div>
                        </div>
                    </div>

                    {/* Collector Card */}
                    <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                                width: 44,
                                height: 44,
                                borderRadius: '50%',
                                background: '#F1F5F9',
                                overflow: 'hidden',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {collector ? (
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${collector.id}`}
                                        alt={collector.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <User style={{ width: 20, height: 20, color: '#94A3B8' }} />
                                )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 10, color: '#64748B' }}>Your Collector</p>
                                <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {collector ? collector.name : 'Unassigned'}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                    <Phone style={{ width: 12, height: 12, color: '#64748B' }} />
                                    <span style={{ fontSize: 12, color: '#64748B' }}>
                                        {collector ? collector.mobile : '---'}
                                    </span>
                                </div>
                            </div>
                            {collector && (
                                <button style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    flexShrink: 0
                                }}>
                                    <Phone style={{ width: 16, height: 16, color: '#22C55E' }} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Digital QR */}
                    <DigitalQR />

                    {/* Payment Card */}
                    <button
                        onClick={() => navigate(currentPayment.status === PaymentStatus.UNPAID ? '/payment' : '/payment-status')}
                        style={{
                            width: '100%',
                            background: 'white',
                            borderRadius: 16,
                            padding: 16,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            textAlign: 'left'
                        }}
                    >
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: getStatusColor(currentPayment.status).bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <CreditCard style={{ width: 18, height: 18, color: getStatusColor(currentPayment.status).text }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 10, color: '#64748B' }}>{formatMonth(currentPayment.month)}</p>
                            <p style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>{formatCurrency(currentPayment.amount)}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            <span style={{
                                padding: '4px 10px',
                                borderRadius: 20,
                                fontSize: 11,
                                fontWeight: 500,
                                background: getStatusColor(currentPayment.status).bg,
                                color: getStatusColor(currentPayment.status).text
                            }}>
                                {getPaymentStatusLabel(currentPayment.status)}
                            </span>
                            <ChevronRight style={{ width: 18, height: 18, color: '#94A3B8' }} />
                        </div>
                    </button>

                    {/* Quick Actions */}
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginBottom: 8, paddingLeft: 4 }}>Quick Actions</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <button
                                onClick={() => navigate('/payment')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: 14,
                                    background: '#22C55E',
                                    borderRadius: 14,
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'white'
                                }}
                            >
                                <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Leaf style={{ width: 18, height: 18 }} />
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 500 }}>Pay Now</span>
                            </button>
                            <button
                                onClick={() => navigate('/history')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    padding: 14,
                                    background: 'white',
                                    borderRadius: 14,
                                    border: '1px solid #E2E8F0',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ width: 32, height: 32, borderRadius: 10, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <History style={{ width: 18, height: 18, color: '#64748B' }} />
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>History</span>
                            </button>
                        </div>
                    </div>

                    {/* Recent Collections */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingLeft: 4 }}>
                            <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>Recent Collections</p>
                            <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', fontSize: 12, fontWeight: 500, color: '#22C55E', cursor: 'pointer' }}>
                                See All
                            </button>
                        </div>
                        <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                            {recentCollections.slice(0, 3).map((c, i) => (
                                <div key={c.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: 14,
                                    borderTop: i === 0 ? 'none' : '1px solid #E2E8F0'
                                }}>
                                    <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        background: c.status === 'COLLECTED' ? '#DCFCE7' : '#FEE2E2',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <CheckCircle style={{ width: 16, height: 16, color: c.status === 'COLLECTED' ? '#22C55E' : '#EF4444' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>
                                            {new Date(c.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                                        </p>
                                        <p style={{ fontSize: 10, color: '#64748B' }}>{c.status === 'COLLECTED' ? 'Collected' : 'Missed'}</p>
                                    </div>
                                    <span style={{
                                        padding: '3px 8px',
                                        borderRadius: 20,
                                        fontSize: 10,
                                        fontWeight: 500,
                                        background: c.status === 'COLLECTED' ? '#DCFCE7' : '#FEE2E2',
                                        color: c.status === 'COLLECTED' ? '#16A34A' : '#DC2626'
                                    }}>
                                        {c.status === 'COLLECTED' ? '✓' : '✗'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Support CTA */}
                    <button
                        onClick={() => navigate('/complaints/new')}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: 14,
                            background: '#22C55E',
                            borderRadius: 14,
                            border: 'none',
                            cursor: 'pointer',
                            color: 'white'
                        }}
                    >
                        <MessageSquare style={{ width: 20, height: 20 }} />
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <p style={{ fontSize: 14, fontWeight: 500 }}>Have an issue?</p>
                            <p style={{ fontSize: 10, opacity: 0.8 }}>Request for support</p>
                        </div>
                        <ChevronRight style={{ width: 20, height: 20 }} />
                    </button>
                </div>
            </div>
        </div>
    );
}
