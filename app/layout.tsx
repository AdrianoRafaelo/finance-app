import "./globals.css"
import Navbar from "@/components/navbar"

export const metadata = {
  title: "Finance App",
  description: "Aplikasi keuangan",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#3b82f6" />
        <link rel="icon" href="/icon-192.png" />
      </head>
      <body>
        <div className="pb-24">
          {children}
        </div>
        <Navbar />
      </body>
    </html>
  )
}
