import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
    {
        variants: {
            variant: {
                default:
                    "bg-[#22C55E] text-white shadow-md shadow-green-500/20 hover:bg-[#16A34A] hover:shadow-lg hover:shadow-green-500/30",
                destructive:
                    "bg-[#EF4444] text-white shadow-md hover:bg-[#DC2626]",
                outline:
                    "border-2 border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-[#F1F5F9] hover:border-[#22C55E]",
                secondary:
                    "bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0]",
                ghost:
                    "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]",
                link:
                    "text-[#22C55E] underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-5 py-2",
                sm: "h-9 rounded-lg px-3 text-xs",
                lg: "h-12 rounded-xl px-8 text-base",
                icon: "h-10 w-10 rounded-xl",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
