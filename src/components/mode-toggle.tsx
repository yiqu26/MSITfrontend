import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { ComponentProps } from "react"

export function ModeToggle({ buttonProps }: { buttonProps?: ComponentProps<typeof Button> }) {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light")
    }

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full w-9 h-9 hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0" 
            onClick={toggleTheme}
            {...buttonProps}
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-500" />
            <span className="sr-only">切換主題</span>
        </Button>
    )
}
