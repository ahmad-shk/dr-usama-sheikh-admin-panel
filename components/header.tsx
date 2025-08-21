"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Stethoscope, User, Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchAppointments } from "@/store/appointmentSlice"
import { fetchQueriesAction } from "@/store/querySlice"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { appointments } = useAppSelector((state) => state.appointments)
  const { queries, chatQueries = [] } = useAppSelector((state: any) => state.queries || {})
  const [seenAppointments, setSeenAppointments] = useState<string[]>([])
  const [seenQueries, setSeenQueries] = useState<string[]>([])

  useEffect(() => {
    const seen = localStorage.getItem("seenAppointments")
    if (seen) {
      setSeenAppointments(JSON.parse(seen))
    }
    const seenQueriesData = localStorage.getItem("seenQueries")
    if (seenQueriesData) {
      setSeenQueries(JSON.parse(seenQueriesData))
    }
  }, [])

  useEffect(() => {
    dispatch(fetchAppointments())
    dispatch(fetchQueriesAction())
  }, [dispatch])

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchQueriesAction())
    }, 5000)

    return () => clearInterval(interval)
  }, [dispatch])

  const pendingAppointments = appointments.filter(
    (apt) => apt.status === "pending" || !apt.status || apt.status === undefined || apt.status === null,
  )

  const pendingQueries = queries.filter((query: any) => query.status === "pending" || !query.status)
  const pendingChatQueries = chatQueries.filter((c: any) => c.status === "pending")

  const unseenNotifications = pendingAppointments.filter((apt) => {
    const appointmentId = apt._id || apt.id
    return appointmentId && !seenAppointments.includes(appointmentId)
  })

  const unseenQueries = pendingQueries.filter((query) => {
    const queryId = query._id || query.id
    return queryId && !seenQueries.includes(queryId)
  })

  const unseenChatQueries = pendingChatQueries // For now, all pending chat queries are unseen
  const totalUnseenCount = unseenNotifications.length + unseenQueries.length + unseenChatQueries.length

  const markAsSeen = (appointmentId: string) => {
    const updatedSeen = [...seenAppointments, appointmentId]
    setSeenAppointments(updatedSeen)
    localStorage.setItem("seenAppointments", JSON.stringify(updatedSeen))
  }

  const markQueryAsSeen = (queryId: string) => {
    const updatedSeen = [...seenQueries, queryId]
    setSeenQueries(updatedSeen)
    localStorage.setItem("seenQueries", JSON.stringify(updatedSeen))
  }

  const markAllAsSeen = () => {
    const allIds = pendingAppointments.map((apt) => apt._id || apt.id).filter(Boolean)
    const updatedSeen = [...new Set([...seenAppointments, ...allIds])]
    setSeenAppointments(updatedSeen)
    localStorage.setItem("seenAppointments", JSON.stringify(updatedSeen))

    const allQueryIds = pendingQueries.map((query) => query._id || query.id).filter(Boolean)
    const updatedSeenQueries = [...new Set([...seenQueries, ...allQueryIds])]
    setSeenQueries(updatedSeenQueries)
    localStorage.setItem("seenQueries", JSON.stringify(updatedSeenQueries))
  }

  const handleLogout = () => {
    logout()
    localStorage.removeItem("dental_admin_token")
    router.push("/login")
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRelativeTime = (dateString: string) => {
    const now = new Date()
    const appointmentDate = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - appointmentDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} day${days > 1 ? "s" : ""} ago`
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 mb-4 sm:mb-8">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
              <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-extrabold tracking-tight">Al Sheikh Clinic</h1>
              <p className="text-xs sm:text-sm text-blue-600 hidden sm:block font-medium">Appointment System Admin Panel</p>
            </div>
          </div>

          {/* User Menu */}
          {user && (
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Welcome text - hidden on mobile */}
              <div className="hidden lg:block text-right">
                <p className="text-sm font-medium text-gray-900">Welcome back,</p>
                <p className="text-sm text-gray-600">{user.name}</p>
              </div>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative p-2">
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                    {totalUnseenCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
                        {totalUnseenCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 sm:w-80" align="end">
                  <DropdownMenuLabel className="text-sm">Notifications ({totalUnseenCount})</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {unseenNotifications.length > 0 && (
                    <>
                      <DropdownMenuLabel className="text-xs text-gray-500 px-2">
                        New Appointments ({unseenNotifications.length})
                      </DropdownMenuLabel>
                      {unseenNotifications.map((notification) => {
                        const appointmentId = notification._id || notification.id
                        return (
                          <DropdownMenuItem
                            key={appointmentId}
                            className="cursor-pointer p-2 sm:p-3"
                            onClick={() => appointmentId && markAsSeen(appointmentId)}
                          >
                            <div className="flex flex-col gap-1 w-full">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-xs sm:text-sm truncate pr-2">{notification.name}</p>
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                  {getRelativeTime(notification.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">{notification.service}</p>
                              <p className="text-xs text-gray-500">{notification.phone}</p>
                            </div>
                          </DropdownMenuItem>
                        )
                      })}
                      {unseenQueries.length > 0 && <DropdownMenuSeparator />}
                    </>
                  )}
                  {unseenQueries.length > 0 && (
                    <>
                      <DropdownMenuLabel className="text-xs text-gray-500 px-2">
                        New Queries ({unseenQueries.length})
                      </DropdownMenuLabel>
                      {unseenQueries.map((query) => {
                        const queryId = query._id || query.id
                        return (
                          <DropdownMenuItem
                            key={queryId}
                            className="cursor-pointer p-2 sm:p-3"
                            onClick={() => queryId && markQueryAsSeen(queryId)}
                          >
                            <div className="flex flex-col gap-1 w-full">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-xs sm:text-sm truncate pr-2">{query.name}</p>
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                  {getRelativeTime(query.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">{query.department}</p>
                              <p className="text-xs text-gray-500">{query.phone}</p>
                            </div>
                          </DropdownMenuItem>
                        )
                      })}
                    </>
                  )}
                  {unseenChatQueries.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-green-700 px-2">
                        New Chat Queries ({unseenChatQueries.length})
                      </DropdownMenuLabel>
                      {unseenChatQueries.map((chat: any) => {
                        const chatId = chat._id || chat.id
                        return (
                          <DropdownMenuItem
                            key={chatId}
                            className="cursor-pointer p-2 sm:p-3"
                          >
                            <div className="flex flex-col gap-1 w-full">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-xs sm:text-sm truncate pr-2">{chat.name}</p>
                                <span className="text-xs text-gray-500 flex-shrink-0">
                                  {getRelativeTime(chat.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">{chat.phone}</p>
                            </div>
                          </DropdownMenuItem>
                        )
                      })}
                    </>
                  )}
                  {totalUnseenCount === 0 && (
                    <DropdownMenuItem className="text-center text-gray-500 p-2 sm:p-3 text-sm">
                      No new notifications
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-center text-blue-600 cursor-pointer text-sm"
                    onClick={() => {
                      markAllAsSeen()
                      router.push("/profile")
                    }}
                  >
                    View All Notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 sm:gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent px-2 sm:px-3 text-xs sm:text-sm"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>

              {/* User Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xs sm:text-sm">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 sm:w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs sm:text-sm font-medium leading-none truncate">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer text-sm">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
