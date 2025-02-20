import Link from "next/link"
import { Book } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export default function Navbar() {
  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Book className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">Gita Insights</span>
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  )
}

