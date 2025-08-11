"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Phone, Building, MessageSquare, Search, CheckCircle, XCircle, DollarSign } from "lucide-react"

interface Appointment {
  id: string
  clinic: string
  service: string
  date: string
  time: string
  name: string
  phone: string
  message: string
  status: "pending" | "confirmed" | "rejected"
  amount: number
  createdAt: string
  updatedAt: string
}

const sampleAppointments: Appointment[] = [
  {
    id: "689715ed04d0a5d18df7b036",
    clinic: "Smile Dental Clinic",
    service: "Root Canal",
    date: "2025-08-08",
    time: "11:30 AM",
    name: "Usama Sheikh",
    phone: "03001234567",
    message: "Need quick appointment please",
    status: "confirmed",
    amount: 15000,
    createdAt: "2025-08-09T09:33:33.704+00:00",
    updatedAt: "2025-08-09T09:33:33.704+00:00",
  },
  {
    id: "689715ed04d0a5d18df7b037",
    clinic: "Smile Dental Clinic",
    service: "Teeth Cleaning",
    date: "2025-08-10",
    time: "2:00 PM",
    name: "Ahmed Ali",
    phone: "03009876543",
    message: "Regular checkup and cleaning",
    status: "confirmed",
    amount: 3000,
    createdAt: "2025-08-09T10:15:22.704+00:00",
    updatedAt: "2025-08-09T10:15:22.704+00:00",
  },
  {
    id: "689715ed04d0a5d18df7b038",
    clinic: "Smile Dental Clinic",
    service: "Tooth Extraction",
    date: "2025-08-12",
    time: "9:00 AM",
    name: "Fatima Khan",
    phone: "03001122334",
    message: "Wisdom tooth removal",
    status: "rejected",
    amount: 8000,
    createdAt: "2025-08-09T11:20:15.704+00:00",
    updatedAt: "2025-08-09T11:20:15.704+00:00",
  },
  {
    id: "689715ed04d0a5d18df7b039",
    clinic: "Smile Dental Clinic",
    service: "Dental Filling",
    date: "2025-08-15",
    time: "3:30 PM",
    name: "Hassan Malik",
    phone: "03007788990",
    message: "Cavity filling needed",
    status: "pending",
    amount: 5000,
    createdAt: "2025-08-09T12:45:10.704+00:00",
    updatedAt: "2025-08-09T12:45:10.704+00:00",
  },
]

const getServiceColor = (service: string) => {
  const colors: { [key: string]: string } = {
    "Root Canal": "bg-red-100 text-red-800",
    "Teeth Cleaning": "bg-green-100 text-green-800",
    "Tooth Extraction": "bg-orange-100 text-orange-800",
    "Dental Filling": "bg-purple-100 text-purple-800",
    Checkup: "bg-blue-100 text-blue-800",
  }
  return colors[service] || "bg-gray-100 text-gray-800"
}

const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterService, setFilterService] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const handleConfirmAppointment = (id: string) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, status: "confirmed" as const } : apt)))
  }

  const handleRejectAppointment = (id: string) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, status: "rejected" as const } : apt)))
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesServiceFilter = filterService === "all" || appointment.service === filterService
    const matchesStatusFilter = filterStatus === "all" || appointment.status === filterStatus

    return matchesSearch && matchesServiceFilter && matchesStatusFilter
  })

  const uniqueServices = Array.from(new Set(appointments.map((apt) => apt.service)))

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, phone, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="md:w-48">
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Services</option>
                {uniqueServices.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Count */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Appointments ({filteredAppointments.length})</h2>
        <Badge variant="outline" className="text-sm">
          Total: {appointments.length}
        </Badge>
      </div>

      {/* Appointments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold text-gray-900">{appointment.name}</CardTitle>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getServiceColor(appointment.service)}>{appointment.service}</Badge>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Clinic Info */}
              <div className="flex items-center gap-2 text-gray-600">
                <Building className="h-4 w-4" />
                <span className="text-sm font-medium">{appointment.clinic}</span>
              </div>

              {/* Date and Time */}
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

              {/* Contact Info */}
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{appointment.phone}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm font-semibold">{formatCurrency(appointment.amount)}</span>
              </div>

              {/* Message */}
              {appointment.message && (
                <div className="flex items-start gap-2 text-gray-600">
                  <MessageSquare className="h-4 w-4 mt-0.5" />
                  <span className="text-sm italic">"{appointment.message}"</span>
                </div>
              )}

              {appointment.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleConfirmAppointment(appointment.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleRejectAppointment(appointment.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}

              {/* Action Buttons for confirmed/rejected */}
              {appointment.status !== "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Contact
                  </Button>
                </div>
              )}

              {/* Created Date */}
              <div className="text-xs text-gray-400 pt-2 border-t">
                Created: {new Date(appointment.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results Message */}
      {filteredAppointments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No appointments found</h3>
              <p className="text-sm">Try adjusting your search or filter criteria.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
