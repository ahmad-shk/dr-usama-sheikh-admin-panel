"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

const HARDCODED_TOKEN = "dental_admin_token_2024_secure"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("dental_admin_token")

    if (token === HARDCODED_TOKEN) {
      router.push("/profile")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
