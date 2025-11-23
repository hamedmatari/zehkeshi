import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "سرویس بستن راکت تنیس",
  description: "سرویس حرفه‌ای بستن راکت تنیس",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  )
}

