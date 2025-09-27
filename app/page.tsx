"use client"

import { useState } from "react"
import { HomeFeed } from "@/components/home-feed"
import { SendDareScreen } from "@/components/send-dare-screen"
import { RecordDareScreen } from "@/components/record-dare-screen"
import { LeaderboardScreen } from "@/components/leaderboard-screen"
import { ProfileScreen } from "@/components/profile-screen"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function DareMeApp() {
  const [activeScreen, setActiveScreen] = useState<"home" | "send" | "record" | "leaderboard" | "profile">("home")
  const [currentDare, setCurrentDare] = useState<string>("")

  const renderScreen = () => {
    switch (activeScreen) {
      case "home":
        return <HomeFeed onSendDare={() => setActiveScreen("send")} onRecord={(dareText) => {
          setCurrentDare(dareText)
          setActiveScreen("record")
        }} />
      case "send":
        return <SendDareScreen onBack={() => setActiveScreen("home")} />
      case "record":
        return <RecordDareScreen onBack={() => setActiveScreen("home")} dareText={currentDare} />
      case "leaderboard":
        return <LeaderboardScreen />
      case "profile":
        return <ProfileScreen />
      default:
        return <HomeFeed onSendDare={() => setActiveScreen("send")} onRecord={(dareText) => {
          setCurrentDare(dareText)
          setActiveScreen("record")
        }} />
    }
  }

  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="h-full pb-20">{renderScreen()}</div>
      <BottomNavigation activeScreen={activeScreen} onScreenChange={setActiveScreen} />
    </div>
  )
}
