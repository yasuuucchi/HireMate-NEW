import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/layouts/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HireMate",
  description: "採用支援サービス",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen bg-background flex flex-col">
          <Navigation />
          <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  )
}
