"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow p-4 flex justify-between z-50">
      <p className="font-bold">Finance</p>

      <div className="flex gap-4 text-sm">
        <Link href="/dashboard">🏠dashboard</Link>
        <Link href="/add-transaction">➕add transaction</Link>
      </div>
    </div>
  )
}