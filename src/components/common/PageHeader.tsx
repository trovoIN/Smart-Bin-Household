import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    backTo?: string;
    action?: React.ReactNode;
    showMenu?: boolean;
}

export function PageHeader({
    title,
    subtitle,
    showBack = false,
    backTo,
    action,
    showMenu = false,
}: PageHeaderProps) {
    const navigate = useNavigate();

    const handleBack = () => {
        if (backTo) {
            navigate(backTo);
        } else {
            navigate(-1);
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-[#F8FAFC]/80 backdrop-blur-md">
            <div className="max-w-md mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {showBack && (
                            <button
                                onClick={handleBack}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-xl font-semibold text-[#0F172A]">{title}</h1>
                            {subtitle && (
                                <p className="text-sm text-[#64748B]">{subtitle}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {action}
                        {showMenu && (
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl text-[#64748B] hover:bg-white hover:text-[#0F172A] transition-colors">
                                <MoreVertical className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
