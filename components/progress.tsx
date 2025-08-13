"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/store/hooks"
import { DollarSign, TrendingDown, Calendar, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react"

export function Progress() {
  const { appointments } = useAppSelector((state) => state.appointments)

  // Calculate statistics
  const confirmedAppointments = appointments.filter((apt) => apt.status === "confirmed")
  const rejectedAppointments = appointments.filter((apt) => apt.status === "rejected")
  const pendingAppointments = appointments.filter((apt) => apt.status === "pending")
  const totalEarnings = confirmedAppointments.reduce((sum, apt) => sum + (apt.amount || 0), 0)
  const totalLosses = rejectedAppointments.reduce((sum, apt) => sum + (apt.amount || 0), 0)
  const totalAppointments = appointments.length
  const successRate = totalAppointments > 0 ? ((confirmedAppointments.length / totalAppointments) * 100).toFixed(1) : 0

  const formatCurrency = (amount: number | undefined) => `Rs. ${(amount || 0).toLocaleString()}`

  return (
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

      {/* Detailed Appointment Breakdowns */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Pending Appointments Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Pending Details ({pendingAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {pendingAppointments.map((appointment) => (
                <div
                  key={appointment._id || appointment.id}
                  className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{appointment.name}</p>
                      <p className="text-sm text-gray-600">{appointment.service}</p>
                      <p className="text-xs text-gray-500">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-blue-600">{formatCurrency(appointment.amount)}</span>
                  </div>
                </div>
              ))}
              {pendingAppointments.length === 0 && (
                <p className="text-gray-500 text-center py-4">No pending appointments</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Success/Confirmed Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Success Details ({confirmedAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {confirmedAppointments.map((appointment) => (
                <div
                  key={appointment._id || appointment.id}
                  className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{appointment.name}</p>
                      <p className="text-sm text-gray-600">{appointment.service}</p>
                      <p className="text-xs text-gray-500">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-green-600">+{formatCurrency(appointment.amount)}</span>
                  </div>
                </div>
              ))}
              {confirmedAppointments.length === 0 && (
                <p className="text-gray-500 text-center py-4">No confirmed appointments</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rejected Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Reject Details ({rejectedAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {rejectedAppointments.map((appointment) => (
                <div
                  key={appointment._id || appointment.id}
                  className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{appointment.name}</p>
                      <p className="text-sm text-gray-600">{appointment.service}</p>
                      <p className="text-xs text-gray-500">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-red-600">-{formatCurrency(appointment.amount)}</span>
                  </div>
                </div>
              ))}
              {rejectedAppointments.length === 0 && (
                <p className="text-gray-500 text-center py-4">No rejected appointments</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Summary */}
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
                <span className="text-lg font-bold text-blue-600">{formatCurrency(totalEarnings + totalLosses)}</span>
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
                <span className="font-medium text-blue-800">Pending</span>
                <span className="text-lg font-bold text-blue-600">{pendingAppointments.length}</span>
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
  )
}
