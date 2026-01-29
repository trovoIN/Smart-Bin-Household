import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getCollections } from '@/mock/services';
import { useSessionStore } from '@/store/sessionStore';
import { useHouseholdStore } from '@/store/householdStore';
import type { CollectionEntry } from '@/types/models';

type FilterType = 'all' | 'collected' | 'missed';

export function HistoryPage() {
    const navigate = useNavigate();
    const { session } = useSessionStore();
    const { collections, collectionsLoading, setCollections, setCollectionsLoading } = useHouseholdStore();

    const [filter, setFilter] = useState<FilterType>('all');

    useEffect(() => {
        const fetchCollections = async () => {
            if (!session.unitId) return;

            setCollectionsLoading(true);
            try {
                const result = await getCollections(session.unitId);
                if (result.success && result.data) {
                    setCollections(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch collections:', error);
            } finally {
                setCollectionsLoading(false);
            }
        };

        fetchCollections();
    }, [session.unitId]);

    const filteredCollections = collections.filter((c) => {
        if (filter === 'collected') return c.status === 'COLLECTED';
        if (filter === 'missed') return c.status === 'MISSED';
        return true;
    });

    const collectedCount = collections.filter(c => c.status === 'COLLECTED').length;
    const missedCount = collections.filter(c => c.status === 'MISSED').length;
    const successRate = collections.length > 0 ? Math.round((collectedCount / collections.length) * 100) : 0;

    const groupByMonth = (entries: CollectionEntry[]) => {
        const groups: { [key: string]: CollectionEntry[] } = {};
        entries.forEach((entry) => {
            const date = new Date(entry.date);
            const key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(entry);
        });
        return groups;
    };

    const groupedCollections = groupByMonth(filteredCollections);

    const filters = [
        { key: 'all' as FilterType, label: 'All', count: collections.length },
        { key: 'collected' as FilterType, label: 'Collected', count: collectedCount },
        { key: 'missed' as FilterType, label: 'Missed', count: missedCount },
    ];

    if (collectionsLoading) {
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
                <div style={{ maxWidth: 448, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 10, background: '#F1F5F9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <ArrowLeft style={{ width: 18, height: 18, color: '#0F172A' }} />
                    </button>
                    <h1 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A' }}>Collection History</h1>
                </div>
            </div>

            <div style={{ padding: 16 }}>
                <div style={{ maxWidth: 448, margin: '0 auto' }}>
                    {/* Filter Tabs */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto' }}>
                        {filters.map(({ key, label, count }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '8px 14px',
                                    borderRadius: 20,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    border: 'none',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    background: filter === key ? '#22C55E' : 'white',
                                    color: filter === key ? 'white' : '#64748B',
                                    boxShadow: filter === key ? 'none' : '0 0 0 1px #E2E8F0'
                                }}
                            >
                                {label}
                                <span style={{ opacity: 0.7 }}>{count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Stats Bar */}
                    <div style={{ background: 'white', borderRadius: 16, padding: 14, marginBottom: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <p style={{ fontSize: 20, fontWeight: 700, color: '#22C55E' }}>{collectedCount}</p>
                                <p style={{ fontSize: 10, color: '#64748B' }}>Collected</p>
                            </div>
                            <div style={{ width: 1, height: 32, background: '#E2E8F0' }} />
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <p style={{ fontSize: 20, fontWeight: 700, color: '#EF4444' }}>{missedCount}</p>
                                <p style={{ fontSize: 10, color: '#64748B' }}>Missed</p>
                            </div>
                            <div style={{ width: 1, height: 32, background: '#E2E8F0' }} />
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{successRate}%</p>
                                <p style={{ fontSize: 10, color: '#64748B' }}>Success</p>
                            </div>
                        </div>
                    </div>

                    {/* Collection List */}
                    {filteredCollections.length === 0 ? (
                        <div style={{ background: 'white', borderRadius: 16, padding: 48, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                            <Calendar style={{ width: 40, height: 40, color: '#94A3B8', margin: '0 auto 12px' }} />
                            <p style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>No collections found</p>
                            <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
                                {filter !== 'all' ? 'Try changing the filter' : 'No collection history yet'}
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {Object.entries(groupedCollections).map(([month, entries]) => (
                                <div key={month}>
                                    <p style={{ fontSize: 12, fontWeight: 500, color: '#64748B', marginBottom: 8, paddingLeft: 4 }}>{month}</p>
                                    <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                                        {entries.map((entry, i) => (
                                            <div
                                                key={entry.id}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 12,
                                                    padding: 14,
                                                    borderTop: i === 0 ? 'none' : '1px solid #E2E8F0'
                                                }}
                                            >
                                                <div style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: '50%',
                                                    background: entry.status === 'COLLECTED' ? '#DCFCE7' : '#FEE2E2',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    {entry.status === 'COLLECTED'
                                                        ? <CheckCircle style={{ width: 16, height: 16, color: '#22C55E' }} />
                                                        : <XCircle style={{ width: 16, height: 16, color: '#EF4444' }} />
                                                    }
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontSize: 13, fontWeight: 500, color: '#0F172A' }}>
                                                        {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                                                    </p>
                                                    {entry.notes && <p style={{ fontSize: 10, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.notes}</p>}
                                                </div>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: 20,
                                                    fontSize: 11,
                                                    fontWeight: 500,
                                                    background: entry.status === 'COLLECTED' ? '#DCFCE7' : '#FEE2E2',
                                                    color: entry.status === 'COLLECTED' ? '#16A34A' : '#DC2626',
                                                    flexShrink: 0
                                                }}>
                                                    {entry.status === 'COLLECTED' ? 'Collected' : 'Missed'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
