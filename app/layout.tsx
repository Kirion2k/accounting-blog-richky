import type React from "react"
import type { Metadata } from "next"
import { Inter, League_Spartan } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import WavyBackground from "@/components/wavy-background"

const inter = Inter({ subsets: ["latin"] })
const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league-spartan",
  display: "swap",
})

export const metadata: Metadata = {
  title: "ACCADEMY - Accounting insights",
  description: "Expert accounting advice, tax strategies, and business financial guidance from certified professionals",
  icons: {
    icon: "/accademy-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${leagueSpartan.variable} min-h-screen bg-background antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <WavyBackground className="fixed inset-0 z-0" />
          <div className="relative z-10">
            <Navbar />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
