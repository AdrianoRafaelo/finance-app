"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "financeAppUserName"

function getGreeting() {
  const now = new Date()
  const hour = now.getHours()
  if (hour >= 4 && hour < 12) {
    return "selamat pagi"
  }
  if (hour >= 12 && hour < 15) {
    return "selamat siang"
  }
  if (hour >= 15 && hour < 18) {
    return "selamat sore"
  }
  return "selamat malam"
}

export default function UserGreeting() {
  const [name, setName] = useState("Adriano")

  useEffect(() => {
    const storedName = window.localStorage.getItem(STORAGE_KEY)
    if (storedName) {
      setName(storedName)
    }
  }, [])

  return (
    <div>
      <p className="text-sm font-medium text-white/80">{getGreeting()},</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{name}</h1>
    </div>
  )
}
