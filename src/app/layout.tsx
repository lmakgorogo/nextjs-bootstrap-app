import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Spelling Practice App",
  description: "An educational app for Grade 4 students to practice spelling and creative writing",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-[#F8FAFC] text-[#2D3748]`}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
