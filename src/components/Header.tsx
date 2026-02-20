import { BookOpenText } from 'lucide-react'

interface HeaderProps {
  subtitle: string
  title: string
  description: string
}

export function Header({ subtitle, title, description }: HeaderProps) {
  return (
    <header className="space-y-4 text-center sm:text-left">
      <div className="inline-flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark sm:mx-0">
        <BookOpenText className="h-3.5 w-3.5" aria-hidden="true" />
        {subtitle}
      </div>

      <h1 className="display-heading-rhythm font-display text-4xl text-graphite sm:text-5xl">{title}</h1>

      <p className="max-w-3xl text-base text-graphite/80 sm:text-lg">{description}</p>
    </header>
  )
}
