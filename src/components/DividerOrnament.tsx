export function DividerOrnament() {
  return (
    <div className="my-12 flex items-center gap-4" aria-hidden="true">
      <span className="h-px flex-1 bg-border/90" />
      <span className="inline-flex items-center gap-1.5 text-gold/70">
        <span className="h-1.5 w-1.5 rounded-full bg-gold/50" />
        <span className="h-2 w-2 rotate-45 border border-gold/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-gold/50" />
      </span>
      <span className="h-px flex-1 bg-border/90" />
    </div>
  )
}
