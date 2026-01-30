import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, User, Home, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { registerHousehold } from '@/lib/api';

export function RegisterPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);

    const [formData, setFormData] = useState({
        residentName: '',
        unitNumber: '',
        householdPhone: '',
        latitude: 0,
        longitude: 0,
    });

    const handleGetLocation = () => {
        setLocationLoading(true);
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser');
            setLocationLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
                toast.success('Location captured!');
                setLocationLoading(false);
            },
            (error) => {
                console.error('Location error:', error);
                toast.error('Failed to get location. Please enable permissions.');
                setLocationLoading(false);
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.latitude || !formData.longitude) {
            toast.error('Please capture your location first');
            return;
        }

        setLoading(true);
        try {
            // Ensure phone number has +91 prefix
            const registrationData = {
                ...formData,
                householdPhone: formData.householdPhone.startsWith('+91')
                    ? formData.householdPhone
                    : `+91${formData.householdPhone}`
            };

            const result = await registerHousehold(registrationData);
            if (result.success) {
                toast.success('Registration and Login Successful!');
                navigate('/home', { replace: true });
            } else {
                toast.error(result.error || 'Registration failed');
            }
        } catch {
            toast.error('Something went wrong');
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
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
                New Household
            </h1>
            <p style={{ fontSize: 14, color: '#64748B', marginBottom: 24 }}>
                Join the Smart Bin network
            </p>

            <form onSubmit={handleSubmit} style={{
                width: '100%',
                maxWidth: 360,
                background: 'white',
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}>
                {/* Name */}
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#64748B', marginBottom: 6 }}>
                        Full Name
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                        <User size={18} color="#94A3B8" />
                        <input
                            type="text"
                            required
                            placeholder="Enter your name"
                            value={formData.residentName}
                            onChange={e => setFormData(prev => ({ ...prev, residentName: e.target.value }))}
                            style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14 }}
                        />
                    </div>
                </div>

                {/* Mobile */}
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#64748B', marginBottom: 6 }}>
                        Mobile Number
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                        <Phone size={18} color="#94A3B8" />
                        <span style={{ fontSize: 14, color: '#64748B' }}>+91</span>
                        <input
                            type="tel"
                            required
                            placeholder="10-digit number"
                            maxLength={10}
                            value={formData.householdPhone}
                            onChange={e => setFormData(prev => ({ ...prev, householdPhone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                            style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14 }}
                        />
                    </div>
                </div>

                {/* Unit Number */}
                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#64748B', marginBottom: 6 }}>
                        House/Flat Number
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                        <Home size={18} color="#94A3B8" />
                        <input
                            type="text"
                            required
                            placeholder="e.g. A-101"
                            value={formData.unitNumber}
                            onChange={e => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
                            style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14 }}
                        />
                    </div>
                </div>

                {/* Location */}
                <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#64748B', marginBottom: 6 }}>
                        Location
                    </label>
                    <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={locationLoading || (formData.latitude !== 0)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: 10,
                            border: '1px dashed #22C55E',
                            background: formData.latitude ? '#F0FDF4' : 'transparent',
                            color: formData.latitude ? '#15803D' : '#22C55E',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            fontSize: 14,
                            cursor: 'pointer'
                        }}
                    >
                        {locationLoading ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                        {formData.latitude ? 'Location Captured ✓' : 'Get Current Location'}
                    </button>
                    {formData.latitude !== 0 && (
                        <p style={{ fontSize: 11, color: '#64748B', marginTop: 4, textAlign: 'center' }}>
                            {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: '#22C55E',
                        color: 'white',
                        border: 'none',
                        borderRadius: 12,
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8
                    }}
                >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : 'Register & Login'}
                    {!loading && <ArrowRight size={20} />}
                </button>
            </form>

            <button
                onClick={() => navigate('/login')}
                style={{
                    marginTop: 24,
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: 14,
                    cursor: 'pointer'
                }}
            >
                Already have an account? <span style={{ color: '#22C55E', fontWeight: 600 }}>Login</span>
            </button>
        </div>
    );
}
