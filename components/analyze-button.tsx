"use client"

interface AnalyzeButtonProps {
  onClick: () => void
  disabled: boolean
}

export default function AnalyzeButton({ onClick, disabled }: AnalyzeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full px-8 py-4 bg-primary text-primary-foreground font-mono font-semibold uppercase tracking-wide hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
      {disabled ? "Analyzing..." : "Analyze"}
    </button>
  )
}
