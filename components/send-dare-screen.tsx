"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Users, Globe, UserPlus, Zap, Heart, Star, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SendDareScreenProps {
  onBack: () => void
}

const darePacks = [
  { id: 1, name: "Dance Moves", icon: "💃", count: 25, color: "bg-gradient-primary" },
  { id: 2, name: "Funny Faces", icon: "😂", count: 18, color: "bg-gradient-energy" },
  { id: 3, name: "Singing", icon: "🎤", count: 22, color: "bg-gradient-success" },
  { id: 4, name: "Sports", icon: "⚽", count: 15, color: "bg-secondary" },
  { id: 5, name: "Creative", icon: "🎨", count: 30, color: "bg-primary" },
  { id: 6, name: "Food", icon: "🍕", count: 12, color: "bg-energy" },
]

const quickDares = [
  "Do your best robot dance for 15 seconds",
  "Sing 'Happy Birthday' in an opera voice",
  "Do 10 jumping jacks while saying the alphabet",
  "Make the funniest face you can for 10 seconds",
  "Pretend to be a news reporter about your breakfast",
]

export function SendDareScreen({ onBack }: SendDareScreenProps) {
  const [selectedTab, setSelectedTab] = useState<"friends" | "random" | "global">("friends")
  const [customDare, setCustomDare] = useState("")
  const [selectedPack, setSelectedPack] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendCustomDare = async () => {
    if (!customDare.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Mock API call - simulate sending dare
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("[v0] Mock dare sent:", {
        dare_text: customDare.trim(),
        target_type: selectedTab,
      })

      setCustomDare("")
      onBack() // Return to home screen
    } catch (err) {
      console.error("[v0] Error sending dare:", err)
      setError("Failed to send dare")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendQuickDare = async (dareText: string) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Mock API call - simulate sending dare
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("[v0] Mock quick dare sent:", {
        dare_text: dareText,
        target_type: selectedTab,
      })

      onBack() // Return to home screen
    } catch (err) {
      console.error("[v0] Error sending quick dare:", err)
      setError("Failed to send dare")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="bg-gradient-primary p-4 pt-12">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-white text-2xl font-bold">Send a Dare</h1>
        </div>

        {/* Audience Selection */}
        <div className="flex gap-2">
          <Button
            variant={selectedTab === "friends" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedTab("friends")}
            className={`flex-1 ${selectedTab === "friends" ? "bg-white text-primary" : "text-white hover:bg-white/20"}`}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Friends
          </Button>
          <Button
            variant={selectedTab === "random" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedTab("random")}
            className={`flex-1 ${selectedTab === "random" ? "bg-white text-primary" : "text-white hover:bg-white/20"}`}
          >
            <Users className="w-4 h-4 mr-2" />
            Random
          </Button>
          <Button
            variant={selectedTab === "global" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedTab("global")}
            className={`flex-1 ${selectedTab === "global" ? "bg-white text-primary" : "text-white hover:bg-white/20"}`}
          >
            <Globe className="w-4 h-4 mr-2" />
            Global
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* Custom Dare Input */}
        <Card className="border-2 border-primary/20">
          <CardContent className="p-4">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Create Custom Dare
            </h3>
            <Textarea
              placeholder="Type your dare here... Be creative and fun!"
              value={customDare}
              onChange={(e) => setCustomDare(e.target.value)}
              className="min-h-[100px] text-base border-2 border-muted focus:border-primary rounded-xl"
              maxLength={200}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-muted-foreground">{customDare.length}/200 characters</span>
              <Button
                onClick={handleSendCustomDare}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white rounded-full px-6"
                disabled={!customDare.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Dare"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Dares */}
        <div>
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-energy" />
            Quick Dares
          </h3>
          <div className="space-y-2">
            {quickDares.map((dare, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow cursor-pointer border border-border hover:border-primary/50"
              >
                <CardContent className="p-3">
                  <p className="text-sm">{dare}</p>
                  <Button
                    size="sm"
                    onClick={() => handleSendQuickDare(dare)}
                    disabled={isSubmitting}
                    className="mt-2 bg-gradient-energy hover:bg-gradient-energy/90 text-white rounded-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send This"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dare Packs */}
        <div>
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-success" />
            Dare Packs
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {darePacks.map((pack) => (
              <Card
                key={pack.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedPack === pack.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedPack(pack.id)}
              >
                <CardContent className="p-4">
                  <div
                    className={`w-12 h-12 rounded-full ${pack.color} flex items-center justify-center text-2xl mb-3`}
                  >
                    {pack.icon}
                  </div>
                  <h4 className="font-semibold text-sm">{pack.name}</h4>
                  <p className="text-xs text-muted-foreground">{pack.count} dares</p>
                  <Button
                    size="sm"
                    className="w-full mt-3 bg-gradient-success hover:bg-gradient-success/90 text-white rounded-full"
                  >
                    Explore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
