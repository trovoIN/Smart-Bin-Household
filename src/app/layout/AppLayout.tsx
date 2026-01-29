import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { BottomNav } from './BottomNav';

export function AppLayout() {
    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
            <main>
                <Outlet />
            </main>
            <BottomNav />
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: 'white',
                        border: '1px solid #E2E8F0',
                        borderRadius: 12,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        fontSize: 14
                    }
                }}
            />
        </div>
    );
}
