import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, AlertCircle, Clock, CheckCircle, ChevronRight, ArrowLeft, X } from 'lucide-react';

import { listComplaints } from '@/mock/services';
import { useSessionStore } from '@/store/sessionStore';
import { useHouseholdStore } from '@/store/householdStore';
import { ComplaintStatus, ComplaintType } from '@/types/models';
import type { Complaint } from '@/types/models';

export function ComplaintsListPage() {
    const navigate = useNavigate();
    const { session } = useSessionStore();
    const { complaints, complaintsLoading, setComplaints, setComplaintsLoading } = useHouseholdStore();
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

    useEffect(() => {
        const fetchComplaints = async () => {
            if (!session.unitId) return;

            setComplaintsLoading(true);
            try {
                const result = await listComplaints(session.unitId);
                if (result.success && result.data) {
                    setComplaints(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch complaints:', error);
            } finally {
                setComplaintsLoading(false);
            }
        };

        fetchComplaints();
    }, [session.unitId]);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case ComplaintStatus.RESOLVED:
                return { icon: CheckCircle, bg: '#DCFCE7', color: '#16A34A', label: 'Resolved' };
            case ComplaintStatus.IN_PROGRESS:
                return { icon: Clock, bg: '#FEF3C7', color: '#D97706', label: 'In Progress' };
            default:
                return { icon: AlertCircle, bg: '#FEE2E2', color: '#DC2626', label: 'Open' };
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case ComplaintType.MISSED_COLLECTION: return 'Missed Collection';
            case ComplaintType.RUDE_BEHAVIOR: return 'Rude Behavior';
            case ComplaintType.BILLING_ISSUE: return 'Billing Issue';
            case ComplaintType.IMPROPER_DISPOSAL: return 'Improper Disposal';
            default: return 'Other';
        }
    };

    if (complaintsLoading) {
        return (
            <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 32, height: 32, border: '3px solid #E2E8F0', borderTopColor: '#22C55E', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: 100 }}>
            {/* Header */}
            <div style={{ background: 'white', padding: '16px', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ maxWidth: 448, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => navigate('/home')} style={{ width: 36, height: 36, borderRadius: 10, background: '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <ArrowLeft style={{ width: 18, height: 18, color: '#0F172A' }} />
                        </button>
                        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A' }}>My Complaints</h1>
                    </div>
                    <button
                        onClick={() => navigate('/complaints/new')}
                        style={{
                            padding: '8px 14px',
                            background: '#22C55E',
                            border: 'none',
                            borderRadius: 10,
                            color: 'white',
                            fontSize: 13,
                            fontWeight: 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}
                    >
                        <Plus style={{ width: 16, height: 16 }} />
                        New
                    </button>
                </div>
            </div>

            <div style={{ padding: 16 }}>
                <div style={{ maxWidth: 448, margin: '0 auto' }}>
                    {complaints.length === 0 ? (
                        <div style={{ background: 'white', borderRadius: 16, padding: 48, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                            <AlertCircle style={{ width: 40, height: 40, color: '#94A3B8', margin: '0 auto 12px' }} />
                            <p style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>No complaints</p>
                            <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>You haven't raised any complaints yet</p>
                            <button
                                onClick={() => navigate('/complaints/new')}
                                style={{
                                    marginTop: 16,
                                    padding: '10px 20px',
                                    background: '#22C55E',
                                    border: 'none',
                                    borderRadius: 10,
                                    color: 'white',
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 6
                                }}
                            >
                                <Plus style={{ width: 16, height: 16 }} />
                                Raise a Complaint
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {complaints.map((complaint) => {
                                const config = getStatusConfig(complaint.status);
                                const StatusIcon = config.icon;
                                return (
                                    <button
                                        key={complaint.id}
                                        onClick={() => setSelectedComplaint(complaint)}
                                        style={{
                                            width: '100%',
                                            background: 'white',
                                            borderRadius: 16,
                                            padding: 16,
                                            border: 'none',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                            cursor: 'pointer',
                                            textAlign: 'left'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <div style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 10,
                                                background: config.bg,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <StatusIcon style={{ width: 18, height: 18, color: config.color }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                                    <p style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>{getTypeLabel(complaint.type)}</p>
                                                    <span style={{
                                                        padding: '3px 8px',
                                                        borderRadius: 20,
                                                        fontSize: 10,
                                                        fontWeight: 500,
                                                        background: config.bg,
                                                        color: config.color,
                                                        flexShrink: 0
                                                    }}>
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: 12, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
                                                    {complaint.description}
                                                </p>
                                                <p style={{ fontSize: 10, color: '#94A3B8' }}>
                                                    {new Date(complaint.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                            <ChevronRight style={{ width: 18, height: 18, color: '#94A3B8', flexShrink: 0, alignSelf: 'center' }} />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedComplaint && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ width: '100%', maxWidth: 448, background: 'white', borderRadius: '20px 20px 0 0', padding: 24, maxHeight: '80vh', overflow: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A' }}>Complaint Details</h3>
                            <button onClick={() => setSelectedComplaint(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X style={{ width: 20, height: 20, color: '#94A3B8' }} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <p style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Type</p>
                                <p style={{ fontSize: 14, fontWeight: 500, color: '#0F172A' }}>{getTypeLabel(selectedComplaint.type)}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Status</p>
                                <span style={{
                                    display: 'inline-flex',
                                    padding: '4px 10px',
                                    borderRadius: 20,
                                    fontSize: 12,
                                    fontWeight: 500,
                                    background: getStatusConfig(selectedComplaint.status).bg,
                                    color: getStatusConfig(selectedComplaint.status).color
                                }}>
                                    {getStatusConfig(selectedComplaint.status).label}
                                </span>
                            </div>
                            <div>
                                <p style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Description</p>
                                <p style={{ fontSize: 14, color: '#0F172A', lineHeight: 1.5 }}>{selectedComplaint.description}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>Created</p>
                                <p style={{ fontSize: 14, color: '#0F172A' }}>
                                    {new Date(selectedComplaint.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
