import { cn } from "@/lib/utils"

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-xl bg-gradient-to-r from-[#F1F5F9] via-[#E2E8F0] to-[#F1F5F9] bg-[length:200%_100%]",
                className
            )}
            {...props}
        />
    )
}

export { Skeleton }
