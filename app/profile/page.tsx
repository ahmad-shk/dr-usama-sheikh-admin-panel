"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import {
  User,
  Settings,
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Building,
  MessageSquare,
  Eye,
  EyeOff,
  Lock,
  Mail,
  TrendingDown,
  MessageCircle,
} from "lucide-react"

interface Appointment {
  id: string
  clinic: string
  service: string
  date: string
  time: string
  name: string
  phone: string
  message: string
  createdAt: string
  updatedAt: string
  status: "pending" | "confirmed" | "rejected"
  amount: number
}

export default function ProfilePage() {
  const { user } = useAuth()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("")
  const [newEmail, setNewEmail] = useState(user?.email || "")
  const [newName, setNewName] = useState(user?.name || "")

  // Sample appointment data with enhanced structure
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "689715ed04d0a5d18df7b036",
      clinic: "Smile Dental Clinic",
      service: "Root Canal",
      date: "2025-08-08",
      time: "11:30 AM",
      name: "Usama Sheikh",
      phone: "03001234567",
      message: "Need quick appointment please",
      createdAt: "2025-08-09T09:33:33.704+00:00",
      updatedAt: "2025-08-09T09:33:33.704+00:00",
      status: "confirmed",
      amount: 15000,
    },
    {
      id: "689715ed04d0a5d18df7b037",
      clinic: "Smile Dental Clinic",
      service: "Teeth Cleaning",
      date: "2025-08-10",
      time: "2:00 PM",
      name: "Ahmed Ali",
      phone: "03009876543",
      message: "Regular checkup needed",
      createdAt: "2025-08-09T10:15:22.704+00:00",
      updatedAt: "2025-08-09T10:15:22.704+00:00",
      status: "confirmed",
      amount: 5000,
    },
    {
      id: "689715ed04d0a5d18df7b038",
      clinic: "Smile Dental Clinic",
      service: "Tooth Extraction",
      date: "2025-08-12",
      time: "9:00 AM",
      name: "Sara Khan",
      phone: "03001122334",
      message: "Wisdom tooth removal",
      createdAt: "2025-08-09T11:20:15.704+00:00",
      updatedAt: "2025-08-09T11:20:15.704+00:00",
      status: "rejected",
      amount: 8000,
    },
    {
      id: "689715ed04d0a5d18df7b039",
      clinic: "Smile Dental Clinic",
      service: "Dental Implant",
      date: "2025-08-15",
      time: "3:30 PM",
      name: "Hassan Malik",
      phone: "03005544332",
      message: "Single tooth implant consultation",
      createdAt: "2025-08-09T12:45:30.704+00:00",
      updatedAt: "2025-08-09T12:45:30.704+00:00",
      status: "confirmed",
      amount: 50000,
    },
    {
      id: "689715ed04d0a5d18df7b040",
      clinic: "Smile Dental Clinic",
      service: "Orthodontics",
      date: "2025-08-18",
      time: "1:15 PM",
      name: "Fatima Noor",
      phone: "03007788990",
      message: "Braces consultation",
      createdAt: "2025-08-09T13:30:45.704+00:00",
      updatedAt: "2025-08-09T13:30:45.704+00:00",
      status: "rejected",
      amount: 25000,
    },
  ])

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordChangeMessage("")

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordChangeMessage("Please fill in all fields")
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordChangeMessage("New passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setPasswordChangeMessage("New password must be at least 6 characters")
      return
    }

    // Mock password change (in real app, this would call an API)
    setPasswordChangeMessage("Password changed successfully!")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleAdminDetailsUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock update (in real app, this would call an API)
    setPasswordChangeMessage("Admin details updated successfully!")
  }

  // Calculate statistics
  const confirmedAppointments = appointments.filter((apt) => apt.status === "confirmed")
  const rejectedAppointments = appointments.filter((apt) => apt.status === "rejected")
  const totalEarnings = confirmedAppointments.reduce((sum, apt) => sum + apt.amount, 0)
  const totalLosses = rejectedAppointments.reduce((sum, apt) => sum + apt.amount, 0)
  const totalAppointments = appointments.length
  const successRate = totalAppointments > 0 ? ((confirmedAppointments.length / totalAppointments) * 100).toFixed(1) : 0

  // Helper functions
  const formatCurrency = (amount: number) => `Rs. ${amount.toLocaleString()}`
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString()

  const getServiceColor = (service: string) => {
    const colors: Record<string, string> = {
      "Root Canal": "bg-red-100 text-red-800",
      "Teeth Cleaning": "bg-blue-100 text-blue-800",
      "Tooth Extraction": "bg-orange-100 text-orange-800",
      "Dental Implant": "bg-purple-100 text-purple-800",
      Orthodontics: "bg-green-100 text-green-800",
    }
    return colors[service] || "bg-gray-100 text-gray-800"
  }

  const openWhatsApp = (phone: string, name: string) => {
    const message = `Hello ${name}, this is regarding your dental appointment at our clinic.`
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  // Mock function to update appointment status
  const updateAppointmentStatus = (id: string, status: "confirmed" | "rejected") => {
    setAppointments((prevAppointments) => prevAppointments.map((apt) => (apt.id === id ? { ...apt, status } : apt)))
  }

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-900">{appointment.name}</CardTitle>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getServiceColor(appointment.service)}>{appointment.service}</Badge>
            <Badge variant="outline" className="text-sm font-semibold">
              {formatCurrency(appointment.amount)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-gray-600">
          <Building className="h-4 w-4" />
          <span className="text-sm font-medium">{appointment.clinic}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{formatDate(appointment.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">{appointment.time}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="h-4 w-4" />
          <span className="text-sm">{appointment.phone}</span>
        </div>

        {appointment.message && (
          <div className="flex items-start gap-2 text-gray-600">
            <MessageSquare className="h-4 w-4 mt-0.5" />
            <span className="text-sm italic">"{appointment.message}"</span>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex justify-center">
            <Badge
              variant={
                appointment.status === "confirmed"
                  ? "default"
                  : appointment.status === "rejected"
                    ? "destructive"
                    : "secondary"
              }
              className="capitalize"
            >
              {appointment.status}
            </Badge>
          </div>

          {/* Status Update Buttons for Pending Appointments */}
          {appointment.status === "pending" && (
            <div className="flex gap-2 justify-center">
              <Button
                size="sm"
                onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Confirm
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => updateAppointmentStatus(appointment.id, "rejected")}
              >
                Reject
              </Button>
            </div>
          )}

          {/* WhatsApp Button */}
          <div className="flex justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => openWhatsApp(appointment.phone, appointment.name)}
              className="flex items-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">Manage your clinic and appointments</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="change-password" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Change Password
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Appointment Section
            </TabsTrigger>
          </TabsList>

          <TabsContent value="change-password">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Change Password Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-600" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Change Admin Details Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-green-600" />
                    Change Admin Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAdminDetailsUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-name">Admin Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="admin-name"
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Admin Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="admin-email"
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Update Details
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {passwordChangeMessage && (
              <Alert
                className={
                  passwordChangeMessage.includes("successfully")
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }
              >
                <AlertDescription
                  className={passwordChangeMessage.includes("successfully") ? "text-green-800" : "text-red-800"}
                >
                  {passwordChangeMessage}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="progress">
            <div className="space-y-6">
              {/* Overview Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-red-100 p-3 rounded-full">
                        <TrendingDown className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Losses</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(totalLosses)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                        <p className="text-2xl font-bold text-blue-600">{totalAppointments}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Success Rate</p>
                        <p className="text-2xl font-bold text-purple-600">{successRate}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Progress Analytics */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                        <span className="font-medium text-green-800">Confirmed Revenue</span>
                        <span className="text-lg font-bold text-green-600">{formatCurrency(totalEarnings)}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                        <span className="font-medium text-red-800">Lost Revenue</span>
                        <span className="text-lg font-bold text-red-600">{formatCurrency(totalLosses)}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                        <span className="font-medium text-blue-800">Total Potential</span>
                        <span className="text-lg font-bold text-blue-600">
                          {formatCurrency(totalEarnings + totalLosses)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                        <span className="font-medium text-green-800">Confirmed</span>
                        <span className="text-lg font-bold text-green-600">{confirmedAppointments.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                        <span className="font-medium text-red-800">Rejected</span>
                        <span className="text-lg font-bold text-red-600">{rejectedAppointments.length}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                        <span className="font-medium text-blue-800">Success Rate</span>
                        <span className="text-lg font-bold text-blue-600">{successRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appointments">
            <div className="space-y-6">
              {/* Appointment Statistics */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600">Confirmed</p>
                        <p className="text-2xl font-bold text-green-600">{confirmedAppointments.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-8 w-8 text-red-600" />
                      <div>
                        <p className="text-sm text-gray-600">Rejected</p>
                        <p className="text-2xl font-bold text-red-600">{rejectedAppointments.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-blue-600">{totalAppointments}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* All Appointments List */}
              <Card>
                <CardHeader>
                  <CardTitle>All Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {appointments.map((appointment) => (
                      <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
