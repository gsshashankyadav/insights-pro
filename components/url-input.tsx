"use client"

interface UrlInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

export default function UrlInput({ value, onChange, onSubmit }: UrlInputProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        placeholder="https://reddit.com/r/..."
        className="w-full px-6 py-4 bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
      />
    </div>
  )
}
