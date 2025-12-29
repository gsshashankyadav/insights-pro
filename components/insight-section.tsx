"use client"

interface InsightSectionProps {
  title: string
  items: string[]
  description?: string
  index: number
}

export default function InsightSection({ title, items, description, index }: InsightSectionProps) {
  return (
    <div>
      <div className="mb-8">
        <h2
          className="text-4xl font-serif font-bold mb-2 animate-slide-in-up"
          style={{ animationDelay: `${index * 0.15}s` }}
        >
          {title}
        </h2>
        {description && (
          <p
            className="text-muted-foreground animate-slide-in-up"
            style={{ animationDelay: `${index * 0.15 + 0.05}s` }}
          >
            {description}
          </p>
        )}
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="group p-5 bg-card/40 border border-border/30 hover:border-primary/50 backdrop-blur-sm transition-all duration-300 animate-slide-in-up hover:bg-card/60 cursor-default"
            style={{ animationDelay: `${index * 0.15 + 0.1 + idx * 0.06}s` }}
          >
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-b from-primary to-accent mt-2 flex-shrink-0" />
              <p className="text-foreground/90 leading-relaxed text-sm font-sans">{item}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
