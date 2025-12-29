interface QuoteCardProps {
  quote: string
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  return (
    <div className="group relative p-6 bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-gradient-to-br hover:from-primary/15 hover:to-accent/10">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-6 left-6 text-primary/20 text-4xl font-serif select-none">"</div>
      <p className="text-foreground/95 italic font-serif text-base pl-6 leading-relaxed">{quote}</p>
      <div className="absolute bottom-0 right-0 text-primary/10 text-4xl font-serif select-none">"</div>
    </div>
  )
}
