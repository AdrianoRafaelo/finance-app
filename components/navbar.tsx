"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-inner">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-xs text-slate-500 transition hover:text-slate-900">
          <span className="text-xl">🏠</span>
          <span>home</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-xs text-slate-500 transition hover:text-slate-900">
          <span className="text-xl">📊</span>
          <span>stats</span>
        </Link>
        <Link
          href="/add-transaction"
          className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-600 text-white shadow-lg shadow-sky-200/30 transition hover:bg-sky-700"
        >
          <span className="text-2xl">＋</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-xs text-slate-500 transition hover:text-slate-900">
          <span className="text-xl">🧾</span>
          <span>list</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 text-xs text-slate-500 transition hover:text-slate-900">
          <span className="text-xl">👤</span>
          <span>profile</span>
        </Link>
      </div>
    </footer>
  )
}