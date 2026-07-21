import { Loader2 } from "lucide-react"

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-muted ${className}`}
      {...props}
    />
  )
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={`h-4 w-4 animate-spin ${className}`} />
}
