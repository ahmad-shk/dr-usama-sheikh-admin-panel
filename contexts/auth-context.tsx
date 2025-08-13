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

    if (token === HARDCODED_TOKEN && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setUser(ADMIN_CREDENTIALS.user)
      localStorage.setItem("dental_admin_token", HARDCODED_TOKEN)
      localStorage.setItem("dental_admin_user", JSON.stringify(ADMIN_CREDENTIALS.user))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
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
