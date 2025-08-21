"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string // Changed from email to username
  name: string
  role: "admin"
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const HARDCODED_TOKEN = "dental_admin_token_2024_secure"

// Mock admin credentials - in real app, this would be handled by backend
const ADMIN_CREDENTIALS = {
  username: "Admin",
  password: "Admin123",
  user: {
    id: "1",
    username: "Admin", // Changed from email to username
    name: "Dr Usama Sheikh Admin",
    role: "admin" as const,
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("dental_admin_token")
    const savedUser = localStorage.getItem("dental_admin_user")

    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  // Updated login to support backend login and set user
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const res = await fetch("https://dr-usama-sheikh-backend.vercel.app/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data && data.token && data.admin) {
        localStorage.setItem("dental_admin_token", data.token)
        localStorage.setItem("dental_admin_user", JSON.stringify(data.admin))
        setUser(data.admin)
        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        return false
      }
    } catch (err) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("dental_admin_token")
    localStorage.removeItem("dental_admin_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
