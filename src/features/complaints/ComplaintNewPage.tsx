import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Send, Upload, AlertTriangle, Trash2, Clock, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

import { createComplaint } from '@/mock/services';
import { useSessionStore } from '@/store/sessionStore';
import { useHouseholdStore } from '@/store/householdStore';
import { ComplaintType } from '@/types/models';

const complaintTypes = [
    { value: ComplaintType.MISSED_COLLECTION, label: 'Missed Collection', icon: Clock, desc: 'Collector did not come' },
    { value: ComplaintType.RUDE_BEHAVIOR, label: 'Rude Behavior', icon: AlertTriangle, desc: 'Bad attitude or behavior' },
    { value: ComplaintType.BILLING_ISSUE, label: 'Billing Issue', icon: CreditCard, desc: 'Incorrect billing amount' },
    { value: ComplaintType.OTHER, label: 'Other', icon: Trash2, desc: 'Any other issue' },
];

export function ComplaintNewPage() {
    const navigate = useNavigate();
    const { session } = useSessionStore();
    const { complaints, setComplaints } = useHouseholdStore();

    const [type, setType] = useState<string>('');
    const [description, setDescription] = useState('');
    const [photoName, setPhotoName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoName(file.name);
        }
    };

    const handleSubmit = async () => {
        if (!session.unitId) return;
        if (!type) {
            toast.error('Please select a complaint type');
            return;
        }
        if (!description.trim()) {
            toast.error('Please describe your issue');
            return;
        }

        setSubmitting(true);
        try {
            const result = await createComplaint(session.unitId, {
                type: type as typeof ComplaintType[keyof typeof ComplaintType],
                description: description.trim(),
                photoUrl: photoName ? `mock://photos/${photoName}` : undefined,
            });

            if (result.success && result.data) {
                setComplaints([result.data, ...complaints]);
                toast.success('Complaint submitted successfully!');
                navigate('/complaints');
            } else {
                toast.error(result.error || 'Failed to submit');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: 32 }}>
            {/* Header */}
            <div style={{ background: 'white', padding: '16px', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ maxWidth: 448, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 10, background: '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <ArrowLeft style={{ width: 18, height: 18, color: '#0F172A' }} />
                    </button>
                    <h1 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A' }}>Raise Complaint</h1>
                </div>
            </div>

            <div style={{ padding: 16 }}>
                <div style={{ maxWidth: 448, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Type Selection */}
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginBottom: 8, paddingLeft: 4 }}>What's the issue?</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            {complaintTypes.map((t) => {
                                const Icon = t.icon;
                                const isSelected = type === t.value;
                                return (
                                    <button
                                        key={t.value}
                                        onClick={() => setType(t.value)}
                                        style={{
                                            padding: 14,
                                            background: isSelected ? '#22C55E' : 'white',
                                            border: isSelected ? 'none' : '1px solid #E2E8F0',
                                            borderRadius: 14,
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            boxShadow: isSelected ? '0 4px 12px rgba(34, 197, 94, 0.2)' : '0 1px 3px rgba(0,0,0,0.05)'
                                        }}
                                    >
                                        <div style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 10,
                                            background: isSelected ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: 10
                                        }}>
                                            <Icon style={{ width: 18, height: 18, color: isSelected ? 'white' : '#64748B' }} />
                                        </div>
                                        <p style={{ fontSize: 13, fontWeight: 500, color: isSelected ? 'white' : '#0F172A', marginBottom: 2 }}>{t.label}</p>
                                        <p style={{ fontSize: 10, color: isSelected ? 'rgba(255,255,255,0.7)' : '#94A3B8' }}>{t.desc}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginBottom: 8, paddingLeft: 4 }}>Describe your issue</p>
                        <div style={{ background: 'white', borderRadius: 16, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                            <textarea
                                placeholder="Tell us more about the issue..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: 0,
                                    fontSize: 14,
                                    border: 'none',
                                    outline: 'none',
                                    resize: 'none',
                                    color: '#0F172A',
                                    lineHeight: 1.5,
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginBottom: 8, paddingLeft: 4 }}>Add photo (optional)</p>
                        <input type="file" accept="image/*" id="photo-upload" style={{ display: 'none' }} onChange={handleFileChange} />
                        <button
                            onClick={() => document.getElementById('photo-upload')?.click()}
                            style={{
                                width: '100%',
                                padding: 14,
                                background: 'white',
                                border: '1.5px dashed #E2E8F0',
                                borderRadius: 14,
                                color: '#64748B',
                                fontSize: 14,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8
                            }}
                        >
                            <Upload style={{ width: 18, height: 18 }} />
                            {photoName || 'Upload Photo'}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !type || !description.trim()}
                        style={{
                            width: '100%',
                            padding: 16,
                            background: (!type || !description.trim()) ? '#94A3B8' : '#22C55E',
                            border: 'none',
                            borderRadius: 14,
                            color: 'white',
                            fontSize: 15,
                            fontWeight: 500,
                            cursor: (!type || !description.trim()) || submitting ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            marginTop: 8
                        }}
                    >
                        {submitting ? (
                            <Loader2 style={{ width: 20, height: 20, animation: 'spin 1s linear infinite' }} />
                        ) : (
                            <>
                                <Send style={{ width: 18, height: 18 }} />
                                Submit Complaint
                            </>
                        )}
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
