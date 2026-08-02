import { Card } from "@/components/ui/card"

export function SkeletonCard() {
  return (
    <Card className="rounded-lg overflow-hidden">
      <div className="relative aspect-square bg-muted animate-pulse" />
      <div className="p-2 space-y-2">
        <div className="h-4 bg-muted-foreground/20 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-muted-foreground/20 rounded w-1/2 animate-pulse" />
      </div>
    </Card>
  )
}

export function SkeletonMessage() {
  return (
    <div className="p-8 w-full flex items-start gap-x-8 rounded-lg bg-muted">
      <div className="h-8 w-8 rounded-full bg-muted-foreground/20 animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted-foreground/20 rounded w-full animate-pulse" />
        <div className="h-4 bg-muted-foreground/20 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-muted-foreground/20 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  )
}

export function SkeletonCode() {
  return (
    <div className="p-4 w-full rounded-lg bg-muted space-y-2">
      <div className="h-4 bg-muted-foreground/20 rounded w-full animate-pulse" />
      <div className="h-4 bg-muted-foreground/20 rounded w-5/6 animate-pulse" />
      <div className="h-4 bg-muted-foreground/20 rounded w-4/6 animate-pulse" />
      <div className="h-4 bg-muted-foreground/20 rounded w-3/4 animate-pulse" />
    </div>
  )
}
