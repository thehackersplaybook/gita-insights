"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for demonstration
const shlokas = [
  {
    text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    translation:
      "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results of your activities, nor be attached to inaction.",
    explanation:
      "This shloka teaches the importance of performing one's duties without attachment to the results. It emphasizes the philosophy of selfless action and detachment from outcomes.",
  },
  {
    text: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनंजय।\nसिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते॥",
    translation:
      "Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga.",
    explanation:
      "This verse emphasizes the importance of maintaining equanimity in both success and failure. It teaches that true yoga is the state of mental balance and detachment from outcomes while performing one's duties.",
  },
]

export default function ShlokaStudy() {
  const [currentShloka, setCurrentShloka] = useState<(typeof shlokas)[0] | null>(null)

  const generateRandomShloka = () => {
    const randomIndex = Math.floor(Math.random() * shlokas.length)
    setCurrentShloka(shlokas[randomIndex])
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
      <h1 className="text-3xl font-bold mb-8">Random Shloka Study</h1>
      <Button onClick={generateRandomShloka} className="mb-8 bg-primary text-primary-foreground hover:bg-primary/90">
        <Sparkles className="mr-2 h-4 w-4" /> Generate Random Shloka
      </Button>
      {currentShloka && (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Shloka</CardTitle>
            <CardDescription>Original Sanskrit Text</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold mb-4">{currentShloka.text}</p>
            <h3 className="text-xl font-semibold mt-4 mb-2">Translation</h3>
            <p className="mb-4">{currentShloka.translation}</p>
            <h3 className="text-xl font-semibold mt-4 mb-2">Explanation</h3>
            <p>{currentShloka.explanation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

