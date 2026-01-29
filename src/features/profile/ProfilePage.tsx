import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Home, LogOut, RotateCcw, ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';

import { mockDB } from '@/mock/db';
import { useSessionStore } from '@/store/sessionStore';
import { useHouseholdStore } from '@/store/householdStore';

export function ProfilePage() {
    const navigate = useNavigate();
    const { session, logout } = useSessionStore();
    const { dashboardData, reset } = useHouseholdStore();

    const handleLogout = () => {
        logout();
        reset();
        navigate('/qr/demo-token');
        toast.success('Logged out successfully');
    };

    const handleResetData = () => {
        mockDB.reset();
        reset();
        navigate('/qr/demo-token');
        toast.success('Demo data reset');
    };

    const unit = dashboardData?.unit;
    const collector = dashboardData?.collector;

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: 100 }}>
            {/* Header */}
            <div style={{ background: 'white', padding: '16px', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ maxWidth: 448, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 10, background: '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <ArrowLeft style={{ width: 18, height: 18, color: '#0F172A' }} />
                    </button>
                    <h1 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A' }}>Profile</h1>
                </div>
            </div>

            <div style={{ padding: 16 }}>
                <div style={{ maxWidth: 448, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* User Card */}
                    <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                        <div style={{ background: 'linear-gradient(135deg, #22C55E, #16A34A)', padding: 24, textAlign: 'center', color: 'white' }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                                <User style={{ width: 32, height: 32 }} />
                            </div>
                            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Unit {unit?.unitNo || '-'}</h2>
                            <p style={{ fontSize: 13, opacity: 0.8 }}>{session.mobile || 'Not logged in'}</p>
                        </div>
                    </div>

                    {/* Unit Details */}
                    {unit && (
                        <div>
                            <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginBottom: 8, paddingLeft: 4 }}>Unit Details</p>
                            <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Home style={{ width: 18, height: 18, color: '#22C55E' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 11, color: '#64748B' }}>Unit Number</p>
                                        <p style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>{unit.unitNo}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <MapPin style={{ width: 18, height: 18, color: '#22C55E' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 11, color: '#64748B' }}>Address</p>
                                        <p style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{unit.address}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <Phone style={{ width: 18, height: 18, color: '#22C55E' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 11, color: '#64748B' }}>Registered Mobile</p>
                                        <p style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>{unit.registeredMobile}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Collector Details */}
                    {collector && (
                        <div>
                            <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginBottom: 8, paddingLeft: 4 }}>Assigned Collector</p>
                            <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#F1F5F9', overflow: 'hidden', flexShrink: 0 }}>
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${collector.id}`} alt={collector.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{collector.name}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Phone style={{ width: 12, height: 12, color: '#64748B' }} />
                                                <span style={{ fontSize: 12, color: '#64748B' }}>{collector.mobile}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Mail style={{ width: 12, height: 12, color: '#64748B' }} />
                                                <span style={{ fontSize: 12, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{collector.upiId}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%',
                                padding: 14,
                                background: 'white',
                                border: '1px solid #E2E8F0',
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                cursor: 'pointer',
                                color: '#EF4444',
                                fontSize: 14,
                                fontWeight: 500
                            }}
                        >
                            <LogOut style={{ width: 18, height: 18 }} />
                            Logout
                        </button>
                        <button
                            onClick={handleResetData}
                            style={{
                                width: '100%',
                                padding: 14,
                                background: '#F1F5F9',
                                border: 'none',
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                cursor: 'pointer',
                                color: '#64748B',
                                fontSize: 14,
                                fontWeight: 500
                            }}
                        >
                            <RotateCcw style={{ width: 18, height: 18 }} />
                            Reset Demo Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
