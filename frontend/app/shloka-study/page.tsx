"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function ShlokaStudy() {
  const [currentShloka, setCurrentShloka] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateRandomShloka = async () => {
    try {
      setLoading(true);

      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/get_random_shloka`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      const shloka = response?.shloka;
      setCurrentShloka(shloka);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching advice:", error);
      setCurrentShloka("Sorry, an error occurred. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
      <h1 className="text-3xl font-bold mb-8">Random Shloka Study</h1>
      <Button
        onClick={generateRandomShloka}
        className="mb-8 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Sparkles className="mr-2 h-4 w-4" /> Generate Random Shloka
      </Button>
      <Spinner show={loading} className="mt-4" size="large">
        Fetching shloka...
      </Spinner>
      {!loading && currentShloka && (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Shloka</CardTitle>
            <CardDescription>Original Sanskrit Text</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">{currentShloka}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
