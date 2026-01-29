import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <Card className="border-dashed">
            <CardContent className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto mb-4 text-[#94A3B8]">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-1">{title}</h3>
                {description && (
                    <p className="text-sm text-[#64748B] mb-4 max-w-xs mx-auto">{description}</p>
                )}
                {action}
            </CardContent>
        </Card>
    );
}
