export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div
            className="absolute inset-0 w-16 h-16 border-2 border-transparent border-r-accent rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          />
        </div>
        <div className="text-center">
          <p className="text-sm text-foreground font-serif mb-2">Analyzing insights</p>
          <p className="text-xs text-muted-foreground font-mono">Processing Reddit discussion...</p>
        </div>
      </div>
    </div>
  )
}
