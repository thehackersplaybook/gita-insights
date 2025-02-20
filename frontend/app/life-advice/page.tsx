"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Mock data for demonstration
const adviceDatabase = [
  {
    situation: "stress",
    advice:
      "The Bhagavad Gita teaches us to remain calm and composed in stressful situations. Practice detachment from the outcomes and focus on your duty with a steady mind.",
  },
  {
    situation: "decision",
    advice:
      "When faced with difficult decisions, the Gita advises us to act according to our dharma (duty) and with a sense of detachment. Consider the greater good and act without selfish motives.",
  },
  {
    situation: "failure",
    advice:
      "The Gita reminds us that we have control over our actions, not the results. Learn from your failures, but don't be attached to them. Keep performing your duties with dedication and without expectation.",
  },
]

export default function LifeAdvice() {
  const [situation, setSituation] = useState("")
  const [advice, setAdvice] = useState("")

  const getAdvice = () => {
    const lowercaseSituation = situation.toLowerCase()
    const matchingAdvice = adviceDatabase.find((item) => lowercaseSituation.includes(item.situation))

    if (matchingAdvice) {
      setAdvice(matchingAdvice.advice)
    } else {
      setAdvice(
        "I'm sorry, I couldn't find specific advice for your situation. Remember that the Gita teaches us to act with detachment, focus on our duties, and maintain equanimity in all situations.",
      )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
      <h1 className="text-3xl font-bold mb-8">Gita Life Advice</h1>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Seek Guidance</CardTitle>
          <CardDescription>Describe your situation to receive advice from the Bhagavad Gita</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter your life situation..."
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
            />
            <Button onClick={getAdvice} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Send className="mr-2 h-4 w-4" /> Get Advice
            </Button>
          </div>
          {advice && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Gita's Wisdom:</h3>
              <p>{advice}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

