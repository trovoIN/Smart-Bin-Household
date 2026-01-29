import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default:
                    "bg-[#F1F5F9] text-[#64748B]",
                secondary:
                    "bg-[#E2E8F0] text-[#475569]",
                success:
                    "bg-[#DCFCE7] text-[#15803D]",
                warning:
                    "bg-[#FEF3C7] text-[#D97706]",
                destructive:
                    "bg-[#FEE2E2] text-[#DC2626]",
                outline:
                    "border border-[#E2E8F0] text-[#64748B] bg-white",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
