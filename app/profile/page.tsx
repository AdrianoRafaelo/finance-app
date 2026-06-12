"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"

const STORAGE_KEY = "financeAppUserName"

export default function ProfilePage() {
  const [name, setName] = useState("")
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const storedName = window.localStorage.getItem(STORAGE_KEY) || "Adriano"
    setName(storedName)
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.localStorage.setItem(STORAGE_KEY, name.trim() || "Adriano")
    setSaved(true)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-20">
      <div className="mx-auto w-full max-w-md rounded-[32px] bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Profile</h1>
        <p className="mt-2 text-sm text-slate-500">Ubah nama yang tampil pada dashboard.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Nama
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Masukkan nama"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-3xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Simpan
          </button>

          {saved && (
            <p className="text-sm text-emerald-600">Nama berhasil disimpan.</p>
          )}
        </form>
      </div>
    </div>
  )
}
