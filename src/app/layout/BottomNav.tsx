import { NavLink } from 'react-router-dom';
import { Home, History, MessageSquare, User, Recycle } from 'lucide-react';

const navItems = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/payment', icon: Recycle, label: 'Pay', center: true },
    { to: '/complaints', icon: MessageSquare, label: 'Support' },
    { to: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'white',
            borderTop: '1px solid #E2E8F0',
            padding: '8px 16px',
            paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
            zIndex: 50
        }}>
            <div style={{
                maxWidth: 448,
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around'
            }}>
                {navItems.map((item) => {
                    const Icon = item.icon;

                    if (item.center) {
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: '50%',
                                    background: '#22C55E',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: -24,
                                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                                    textDecoration: 'none'
                                }}
                            >
                                <Icon style={{ width: 24, height: 24, color: 'white' }} />
                            </NavLink>
                        );
                    }

                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            style={({ isActive }) => ({
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 4,
                                padding: '4px 8px',
                                textDecoration: 'none',
                                color: isActive ? '#22C55E' : '#94A3B8',
                                transition: 'color 0.15s'
                            })}
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon style={{ width: 22, height: 22, color: isActive ? '#22C55E' : '#94A3B8' }} />
                                    <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
}
