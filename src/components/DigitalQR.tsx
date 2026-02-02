import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { getQR } from '@/lib/api';

export const DigitalQR = () => {
    const [qrToken, setQrToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQR = async () => {
            try {
                const response = await getQR();
                if (response.success && response.data) {
                    setQrToken(response.data.secureToken);
                }
            } catch (error) {
                console.error("Failed to load QR", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQR();
    }, []);

    if (loading) return <div className="animate-pulse h-48 w-48 bg-gray-200 rounded-xl" />;

    if (!qrToken) return <div className="text-red-500">QR Code Unavailable</div>;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">My House QR</h3>
            <div className="p-4 bg-white rounded-xl shadow-inner border border-gray-100">
                <QRCode value={qrToken} size={180} />
            </div>
            <p className="text-xs text-gray-500 text-center">
                Show this to collector<br />to register or collect
            </p>
        </div>
    );
};
