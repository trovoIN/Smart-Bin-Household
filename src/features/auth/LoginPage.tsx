import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Loader2, Recycle } from 'lucide-react';
import { toast } from 'sonner';

import { sendOtp, verifyOtp } from '@/lib/api';
import { useSessionStore } from '@/store/sessionStore';

export function LoginPage() {
    const navigate = useNavigate();
    const { session, login } = useSessionStore();

    const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleSendOtp = async () => {
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        try {
            const result = await sendOtp(mobile);
            if (result.success) {
                setStep('otp');
                setResendTimer(30);
                toast.success('OTP sent! Use 123456 for demo');
            } else {
                toast.error(result.error || 'Failed to send OTP');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            toast.error('Please enter a 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const result = await verifyOtp(mobile, otp);
            if (result.success) {
                login(mobile, session.unitId);
                toast.success('Welcome back!');
                navigate('/home', { replace: true });
            } else {
                toast.error(result.error || 'Invalid OTP');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        setLoading(true);
        try {
            const result = await sendOtp(mobile);
            if (result.success) {
                setResendTimer(30);
                toast.success('OTP resent!');
            }
        } catch {
            toast.error('Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
            background: '#F8FAFC'
        }}>
            {/* Logo */}
            <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#22C55E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)'
            }}>
                <Recycle style={{ width: 32, height: 32, color: 'white' }} />
            </div>

            {/* Title */}
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
                Welcome Back
            </h1>
            <p style={{ fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 32, maxWidth: 280 }}>
                {step === 'mobile'
                    ? 'Enter your registered mobile number to continue'
                    : `Enter the OTP sent to +91 ${mobile}`}
            </p>

            {/* Form Card */}
            <div style={{
                width: '100%',
                maxWidth: 360,
                background: 'white',
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
                {step === 'mobile' ? (
                    <div>
                        <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#0F172A', marginBottom: 8 }}>
                            Mobile Number
                        </label>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '0 12px',
                                background: '#F1F5F9',
                                borderRadius: 12,
                                fontSize: 14,
                                color: '#64748B'
                            }}>
                                <Phone style={{ width: 16, height: 16 }} />
                                <span>+91</span>
                            </div>
                            <input
                                type="tel"
                                placeholder="Enter 10-digit number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                autoFocus
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    fontSize: 14,
                                    border: '1.5px solid #E2E8F0',
                                    borderRadius: 12,
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <button
                            onClick={handleSendOtp}
                            disabled={loading || mobile.length !== 10}
                            style={{
                                width: '100%',
                                padding: '14px 24px',
                                fontSize: 14,
                                fontWeight: 500,
                                color: 'white',
                                background: mobile.length === 10 ? '#22C55E' : '#94A3B8',
                                border: 'none',
                                borderRadius: 12,
                                cursor: mobile.length === 10 && !loading ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8
                            }}
                        >
                            {loading ? (
                                <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <>
                                    Get OTP
                                    <ArrowRight style={{ width: 20, height: 20 }} />
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    <div>
                        <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#0F172A', marginBottom: 8 }}>
                            Verification Code
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                fontSize: 20,
                                textAlign: 'center',
                                letterSpacing: '0.3em',
                                fontFamily: 'monospace',
                                border: '1.5px solid #E2E8F0',
                                borderRadius: 12,
                                outline: 'none',
                                marginBottom: 16
                            }}
                        />
                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading || otp.length !== 6}
                            style={{
                                width: '100%',
                                padding: '14px 24px',
                                fontSize: 14,
                                fontWeight: 500,
                                color: 'white',
                                background: otp.length === 6 ? '#22C55E' : '#94A3B8',
                                border: 'none',
                                borderRadius: 12,
                                cursor: otp.length === 6 && !loading ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                marginBottom: 16
                            }}
                        >
                            {loading ? (
                                <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} />
                            ) : (
                                'Verify & Continue'
                            )}
                        </button>
                        <div style={{ textAlign: 'center' }}>
                            <button
                                onClick={handleResendOtp}
                                disabled={resendTimer > 0 || loading}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: 14,
                                    color: resendTimer > 0 ? '#94A3B8' : '#22C55E',
                                    cursor: resendTimer > 0 ? 'default' : 'pointer',
                                    fontWeight: resendTimer > 0 ? 400 : 500
                                }}
                            >
                                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                            </button>
                        </div>
                        <button
                            onClick={() => { setStep('mobile'); setOtp(''); }}
                            style={{
                                width: '100%',
                                marginTop: 12,
                                background: 'none',
                                border: 'none',
                                fontSize: 14,
                                color: '#64748B',
                                cursor: 'pointer',
                                textAlign: 'center'
                            }}
                        >
                            ← Change number
                        </button>
                    </div>
                )}
            </div>

            {/* Demo hint */}
            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 24 }}>
                Demo OTP: <span style={{ fontFamily: 'monospace', fontWeight: 500, color: '#64748B' }}>123456</span>
            </p>
        </div>
    );
}
