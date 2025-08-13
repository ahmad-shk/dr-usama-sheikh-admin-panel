"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { updateAppointmentStatus as updateAppointmentStatusAction } from "@/store/appointmentSlice"
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Building,
  MessageSquare,
  MessageCircle,
  DollarSign,
  ChevronDown,
} from "lucide-react"

export function AppointmentSection() {
  const dispatch = useAppDispatch()
  const { appointments } = useAppSelector((state) => state.appointments)
  const [appointmentFilter, setAppointmentFilter] = useState<"all" | "pending" | "completed" | "rejected">("all")
  const [showPricePopup, setShowPricePopup] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Price options
  const priceOptions = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]

  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date).getTime()
    const dateB = new Date(b.createdAt || b.date).getTime()
    return dateB - dateA // Latest first
  })

  const completedAppointments = sortedAppointments.filter((apt) => apt.status === "completed")
  const rejectedAppointments = sortedAppointments.filter((apt) => apt.status === "rejected")
  const pendingAppointments = sortedAppointments.filter((apt) => apt.status === "pending" || !apt.status)
  const totalAppointments = sortedAppointments.length

  const filteredAppointments = sortedAppointments.filter((appointment) => {
    if (appointmentFilter === "all") return true
    if (appointmentFilter === "pending") return appointment.status === "pending" || !appointment.status
    return appointment.status === appointmentFilter
  })

  // Helper functions
  const formatCurrency = (amount: number | undefined) => `Rs. ${(amount || 0).toLocaleString()}`
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

  const handlecompletedAppointment = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId)
    setSelectedPrice(null)
    setShowPricePopup(true)
  }

  const handlePriceSelection = (price: number) => {
    setSelectedPrice(price)
  }

  const handleSubmitPrice = async () => {
    if (!selectedAppointmentId || !selectedPrice) return

    setIsSubmitting(true)
    try {
      await dispatch(
        updateAppointmentStatusAction({
          id: selectedAppointmentId,
          status: "completed",
          amount: selectedPrice,
        }),
      ).unwrap()

      setShowPricePopup(false)
      setSelectedAppointmentId(null)
      setSelectedPrice(null)
    } catch (error) {
      console.error("Error updating appointment status:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateAppointmentStatusHandler = async (id: string, action: "completed" | "reject") => {
    if (action === "completed") {
      handlecompletedAppointment(id)
      return
    }

    if (action === "reject") {
      try {
        await dispatch(updateAppointmentStatusAction({ id, status: "rejected" })).unwrap()
      } catch (error) {
        console.error("Error updating appointment status:", error)
      }
    }
  }

  const AppointmentCard = ({ appointment }: { appointment: any }) => {
    const appointmentStatus = appointment.status || "pending"

    return (
      <Card key={appointment._id || appointment.id} className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 break-words">
              {appointment.name}
            </CardTitle>
            <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
              <Badge className={`${getServiceColor(appointment.service)} text-xs`}>{appointment.service}</Badge>
              <Badge variant="outline" className="text-xs sm:text-sm font-semibold">
                {formatCurrency(appointment.amount)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Building className="h-4 w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium truncate">{appointment.clinic}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm">{formatDate(appointment.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">{appointment.time}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm break-all">{appointment.phone}</span>
          </div>

          {appointment.message && (
            <div className="flex items-start gap-2 text-gray-600">
              <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm italic break-words">"{appointment.message}"</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 pt-2">
            {appointmentStatus === "pending" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    Pending
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem
                    onClick={() => updateAppointmentStatusHandler(appointment._id || appointment.id, "completed")}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    completed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => updateAppointmentStatusHandler(appointment._id || appointment.id, "reject")}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant={appointmentStatus === "completed" ? "default" : "destructive"}
                size="sm"
                disabled
                className={`capitalize w-full sm:w-auto text-xs sm:text-sm ${
                  appointmentStatus === "completed" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                }`}
              >
                {appointmentStatus === "completed" ? (
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                )}
                {appointmentStatus}
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => openWhatsApp(appointment.phone, appointment.name)}
              className="flex items-center justify-center gap-2 text-green-600 border-green-200 hover:bg-green-50 w-full sm:w-auto text-xs sm:text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <Dialog open={showPricePopup} onOpenChange={setShowPricePopup}>
        <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
              Select Appointment Price
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 py-4">
            {priceOptions.map((price) => (
              <Button
                key={price}
                variant={selectedPrice === price ? "default" : "outline"}
                onClick={() => handlePriceSelection(price)}
                className={`h-10 sm:h-12 text-sm sm:text-lg font-semibold ${
                  selectedPrice === price
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                }`}
              >
                Rs. {price.toLocaleString()}
              </Button>
            ))}
          </div>
          <div className="flex justify-between gap-3">
            <Button variant="outline" onClick={() => setShowPricePopup(false)} className="text-sm">
              Cancel
            </Button>
            <Button
              onClick={handleSubmitPrice}
              disabled={!selectedPrice || isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Appointment Statistics */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600">completed</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">{completedAppointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Rejected</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600">{rejectedAppointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">{totalAppointments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <CardTitle className="text-base sm:text-lg">All Appointments</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={appointmentFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setAppointmentFilter("all")}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                All ({totalAppointments})
              </Button>
              <Button
                variant={appointmentFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setAppointmentFilter("pending")}
                className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 ${
                  appointmentFilter === "pending"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "text-blue-600 border-blue-200 hover:bg-blue-50"
                }`}
              >
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                Pending ({pendingAppointments.length})
              </Button>
              <Button
                variant={appointmentFilter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setAppointmentFilter("completed")}
                className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 ${
                  appointmentFilter === "completed"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "text-green-600 border-green-200 hover:bg-green-50"
                }`}
              >
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                completed ({completedAppointments.length})
              </Button>
              <Button
                variant={appointmentFilter === "rejected" ? "default" : "outline"}
                size="sm"
                onClick={() => setAppointmentFilter("rejected")}
                className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 ${
                  appointmentFilter === "rejected"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "text-red-600 border-red-200 hover:bg-red-50"
                }`}
              >
                <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                Rejected ({rejectedAppointments.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredAppointments.map((appointment) => (
              <AppointmentCard key={appointment._id || appointment.id} appointment={appointment} />
            ))}
          </div>
          {filteredAppointments.length === 0 && (
            <div className="text-center py-6 sm:py-8">
              <p className="text-gray-500 text-sm sm:text-base">No appointments found for the selected filter.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
