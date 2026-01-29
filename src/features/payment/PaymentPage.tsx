import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Upload, Loader2, CheckCircle2, Smartphone, ArrowLeft, X } from 'lucide-react';
import { toast } from 'sonner';

import { getPayment, uploadPaymentProof } from '@/mock/services';
import { useSessionStore } from '@/store/sessionStore';
import { useHouseholdStore } from '@/store/householdStore';
import { formatCurrency, formatMonth } from '@/utils/format';
import { PaymentStatus } from '@/types/models';

export function PaymentPage() {
    const navigate = useNavigate();
    const { session } = useSessionStore();
    const { payment, collector, paymentLoading, setPayment, setCollector, setPaymentLoading } = useHouseholdStore();

    const [upiDialogOpen, setUpiDialogOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [screenshotName, setScreenshotName] = useState('');
    const [utr, setUtr] = useState('');
    const [screenshotUrl, setScreenshotUrl] = useState('');

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

    const handleCopyUpi = () => {
        if (collector?.upiId) {
            navigator.clipboard.writeText(collector.upiId);
            toast.success('UPI ID copied!');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setScreenshotName(file.name);
            setScreenshotUrl(`mock://screenshots/${file.name}`);
        }
    };

    const handleSubmitProof = async () => {
        if (!session.unitId) return;
        if (!utr && !screenshotUrl) {
            toast.error('Please provide UTR or screenshot');
            return;
        }

        setSubmitting(true);
        try {
            const result = await uploadPaymentProof(session.unitId, {
                utr: utr || undefined,
                screenshotUrl: screenshotUrl || undefined,
            });

            if (result.success && result.data) {
                setPayment(result.data);
                toast.success('Payment proof submitted!');
                navigate('/payment-status');
            } else {
                toast.error(result.error || 'Failed to submit');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    if (paymentLoading || !payment || !collector) {
        return (
            <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 32, height: 32, border: '3px solid #E2E8F0', borderTopColor: '#22C55E', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (payment.status !== PaymentStatus.UNPAID) {
        navigate('/payment-status', { replace: true });
        return null;
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: 32 }}>
            {/* Header */}
            <div style={{ background: 'white', padding: '16px', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ maxWidth: 448, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 10, background: '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <ArrowLeft style={{ width: 18, height: 18, color: '#0F172A' }} />
                    </button>
                    <h1 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A' }}>Make Payment</h1>
                </div>
            </div>

            <div style={{ padding: 16 }}>
                <div style={{ maxWidth: 448, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Amount Card */}
                    <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                        <div style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)', padding: 24, textAlign: 'center', color: 'white' }}>
                            <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>{formatMonth(payment.month)}</p>
                            <p style={{ fontSize: 36, fontWeight: 700 }}>{formatCurrency(payment.amount)}</p>
                            <p style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>Amount Due</p>
                        </div>
                    </div>

                    {/* UPI Section */}
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginBottom: 8, paddingLeft: 4 }}>Pay via UPI</p>
                        <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#F1F5F9', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${collector.id}`} alt={collector.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{collector.name}</p>
                                    <p style={{ fontSize: 11, color: '#64748B' }}>Collector</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <label style={{ fontSize: 10, color: '#64748B', display: 'block', marginBottom: 4 }}>UPI ID</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <div style={{ flex: 1, background: '#F1F5F9', borderRadius: 10, padding: '10px 14px', fontFamily: 'monospace', fontSize: 13, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {collector.upiId}
                                    </div>
                                    <button onClick={handleCopyUpi} style={{ width: 44, height: 44, borderRadius: 10, background: 'white', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                        <Copy style={{ width: 18, height: 18, color: '#64748B' }} />
                                    </button>
                                </div>
                            </div>

                            <button onClick={() => setUpiDialogOpen(true)} style={{ width: '100%', padding: 14, background: '#22C55E', border: 'none', borderRadius: 12, color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                <Smartphone style={{ width: 18, height: 18 }} />
                                Open UPI App
                            </button>
                        </div>
                    </div>

                    {/* Proof Section */}
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginBottom: 8, paddingLeft: 4 }}>Submit Payment Proof</p>
                        <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 10, color: '#64748B', display: 'block', marginBottom: 4 }}>UTR / Reference Number</label>
                                <input
                                    type="text"
                                    placeholder="Enter UTR number"
                                    value={utr}
                                    onChange={(e) => setUtr(e.target.value)}
                                    style={{ width: '100%', padding: '12px 14px', fontSize: 14, border: '1.5px solid #E2E8F0', borderRadius: 10, outline: 'none', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                                <span style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase' }}>Or</span>
                                <div style={{ flex: 1, height: 1, background: '#E2E8F0' }} />
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ fontSize: 10, color: '#64748B', display: 'block', marginBottom: 4 }}>Upload Screenshot</label>
                                <input type="file" accept="image/*" id="screenshot-upload" style={{ display: 'none' }} onChange={handleFileChange} />
                                <button onClick={() => document.getElementById('screenshot-upload')?.click()} style={{ width: '100%', padding: 14, background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 10, color: '#64748B', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    <Upload style={{ width: 18, height: 18 }} />
                                    {screenshotName || 'Choose File'}
                                </button>
                            </div>

                            <button
                                onClick={handleSubmitProof}
                                disabled={submitting || (!utr && !screenshotUrl)}
                                style={{
                                    width: '100%',
                                    padding: 14,
                                    background: (!utr && !screenshotUrl) ? '#94A3B8' : '#22C55E',
                                    border: 'none',
                                    borderRadius: 12,
                                    color: 'white',
                                    fontSize: 14,
                                    fontWeight: 500,
                                    cursor: (!utr && !screenshotUrl) || submitting ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8
                                }}
                            >
                                {submitting ? (
                                    <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    <>
                                        <CheckCircle2 style={{ width: 18, height: 18 }} />
                                        I Have Paid - Submit
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* UPI Dialog */}
            {upiDialogOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 50 }}>
                    <div style={{ width: '100%', maxWidth: 320, background: 'white', borderRadius: 20, padding: 24, position: 'relative' }}>
                        <button onClick={() => setUpiDialogOpen(false)} style={{ position: 'absolute', right: 16, top: 16, background: 'none', border: 'none', cursor: 'pointer' }}>
                            <X style={{ width: 20, height: 20, color: '#94A3B8' }} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <Smartphone style={{ width: 20, height: 20, color: '#22C55E' }} />
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>Open UPI App</h3>
                        </div>
                        <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>This simulates opening your UPI app.</p>
                        <div style={{ textAlign: 'center', padding: '16px 0' }}>
                            <p style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Pay to</p>
                            <p style={{ fontSize: 14, fontFamily: 'monospace', fontWeight: 500, color: '#0F172A', marginBottom: 12 }}>{collector.upiId}</p>
                            <p style={{ fontSize: 28, fontWeight: 700, color: '#22C55E' }}>{formatCurrency(payment.amount)}</p>
                        </div>
                        <button onClick={() => setUpiDialogOpen(false)} style={{ width: '100%', marginTop: 16, padding: 14, background: '#22C55E', border: 'none', borderRadius: 12, color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                            Done
                        </button>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
