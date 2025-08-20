import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ReduxProvider } from "@/components/redux-provider"
import { Toaster } from "@/components/ui/toaster"
import { RouteGuard } from "@/components/route-guard"

export const metadata: Metadata = {
  title: "Al Sheikh Clinic Admin Panel",
  description: "Al Sheikh Clinic Dental & Medical Appointment System",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/file.svg" type="image/svg+xml" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ReduxProvider>
          <AuthProvider>
            <RouteGuard>{children}</RouteGuard>
            <Toaster />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
