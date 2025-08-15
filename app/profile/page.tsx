"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { ChangePassword } from "@/components/change-password"
import { Progress } from "@/components/progress"
import { AppointmentSection } from "@/components/appointment-section"
import CreateAppointment from "@/components/create-appointment"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchAppointmentsAction, clearError } from "@/store/appointmentSlice"
import { User, Settings, TrendingUp, Calendar, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const { appointments, loading, error } = useAppSelector((state) => state.appointments)

  useEffect(() => {
    dispatch(fetchAppointmentsAction())

    const refreshInterval = setInterval(() => {
      dispatch(fetchAppointmentsAction())
    }, 5000) // Refresh every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval)
  }, [dispatch])

  const handleRetry = () => {
    dispatch(clearError())
    dispatch(fetchAppointmentsAction())
  }

  if (loading && appointments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="flex items-center justify-center h-32 sm:h-64">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
              <span className="text-sm sm:text-base">Loading appointments...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {error && (
          <Alert className="mb-4 sm:mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800 text-sm">
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="ml-2 bg-transparent text-xs sm:text-sm"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Admin Profile</h1>
              <p className="text-sm sm:text-base text-gray-600 truncate">{user?.username}</p>
              <p className="text-xs sm:text-sm text-gray-500">Manage your clinic and appointments</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="progress" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1">
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

          <TabsContent value="create-appointment">
            <CreateAppointment />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
