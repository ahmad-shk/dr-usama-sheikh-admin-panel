"use client"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { ChangePassword } from "@/components/change-password"
import { Progress } from "@/components/progress"
import { AppointmentSection } from "@/components/appointment-section"
import CreateAppointment from "@/components/create-appointment"
import PatientQueries from "@/components/patient-queries"
import ChatQueries from "@/components/chat-queries"
import axios from "axios"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchAppointmentsAction, clearError } from "@/store/appointmentSlice"
import { fetchQueriesAction } from "@/store/querySlice"
import { User, Settings, TrendingUp, Calendar, Loader2, Plus, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const { appointments, loading, error } = useAppSelector((state) => state.appointments)
  const { queries } = useAppSelector((state) => state.queries)

  const pendingAppointments = appointments.filter((apt) => apt.status === "pending" || !apt.status)
  const pendingQueries = queries.filter((query) => query.status === "pending")


  // Chat Queries: fetch locally and use for badge and component
  const [chatQueries, setChatQueries] = useState<any[]>([])
  const [chatLoading, setChatLoading] = useState(false)
  const firstLoad = useRef(true)
  const [chatError, setChatError] = useState("")
  const pendingChatQueries = chatQueries.filter((c: any) => c.status === "pending")

  useEffect(() => {
    let isMounted = true
    let interval: NodeJS.Timeout | null = null
    const fetchChats = async () => {
      setChatError("")
      if (firstLoad.current) setChatLoading(true)
      try {
        const res = await axios.get("https://dr-usama-sheikh-backend.vercel.app/api/chats")
        if (isMounted) setChatQueries(res.data)
      } catch (err: any) {
        if (isMounted) setChatError(err.message || "Error fetching chat queries")
      } finally {
        if (firstLoad.current) {
          setChatLoading(false)
          firstLoad.current = false
        }
      }
    }
    fetchChats()
    interval = setInterval(fetchChats, 5000)
    return () => {
      isMounted = false
      if (interval) clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    dispatch(fetchAppointmentsAction())
    dispatch(fetchQueriesAction())
  }, [dispatch])

  if (loading && appointments.length === 0 && queries.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="flex items-center justify-center h-32 sm:h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
              <span className="text-sm sm:text-base">Loading appointments and queries...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

  <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-8">
        {error && (
          <Alert className="mb-4 sm:mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800 text-sm">
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  dispatch(clearError())
                  dispatch(fetchAppointmentsAction())
                  dispatch(fetchQueriesAction())
                }}
                className="ml-2 bg-transparent text-xs sm:text-sm"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mb-2 sm:mb-0">
              <User className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Admin Profile</h1>
              <p className="text-sm sm:text-base text-gray-600 truncate">{user?.username}</p>
              <p className="text-xs sm:text-sm text-gray-500">Manage your clinic and appointments</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="progress" className="space-y-3 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 h-auto p-1 gap-1">
            <TabsTrigger
              value="change-password"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
            >
              <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Change Password</span>
              <span className="sm:hidden">Password</span>
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
            >
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Progress</span>
            </TabsTrigger>
            <TabsTrigger
              value="appointments"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
            >
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Appointment Section</span>
              <span className="sm:hidden">Appointments</span>
              {pendingAppointments.length > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                  {pendingAppointments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="patient-queries"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
            >
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Patient Queries</span>
              <span className="sm:hidden">Queries</span>
              {pendingQueries.length > 0 && (
                <span className="bg-orange-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                  {pendingQueries.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="chat-queries"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
            >
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Chat Queries</span>
              <span className="sm:hidden">Chats</span>
              {pendingChatQueries.length > 0 && (
                <span className="bg-orange-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                  {pendingChatQueries.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="create-appointment"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 text-xs sm:text-sm"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Create Appointment</span>
              <span className="sm:hidden">Create</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="change-password">
            <ChangePassword />
          </TabsContent>

          <TabsContent value="progress">
            <Progress />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentSection />
          </TabsContent>

          <TabsContent value="patient-queries">
            <PatientQueries />
          </TabsContent>

          <TabsContent value="chat-queries">
            <ChatQueries chats={chatQueries} loading={chatLoading} error={chatError} />
          </TabsContent>
          <TabsContent value="create-appointment">
            <CreateAppointment />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
