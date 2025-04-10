import { ModeToggle } from "../mode-toggle"

export function ThemeToggle() {
  return (
    <div className="fixed bottom-16 right-6 z-50 transition-transform hover:scale-105">
      <div className="relative group">
        {/* 發光效果 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/50 to-primary-foreground/50 blur-xl group-hover:blur-2xl transition-all duration-300 opacity-75" />
        
        {/* 主要背景 */}
        <div className="relative backdrop-blur-md bg-background/30 dark:bg-background/20 rounded-full p-1.5 shadow-lg ring-1 ring-black/10 dark:ring-white/20 transition-all duration-300 group-hover:ring-primary/50">
          <ModeToggle />
        </div>
      </div>
    </div>
  )
} 