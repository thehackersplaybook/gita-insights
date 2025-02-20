import Link from "next/link"
import { Book, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Gita Insights</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="w-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              Life Advice
            </CardTitle>
            <CardDescription>Get guidance from the Bhagavad Gita</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/life-advice">Seek Advice</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="w-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-6 w-6 text-secondary" />
              Shloka Study
            </CardTitle>
            <CardDescription>Explore random shlokas and their meanings</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="secondary"
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Link href="/shloka-study">Study Shlokas</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

