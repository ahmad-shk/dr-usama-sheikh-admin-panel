"use client"

import type React from "react"

import { useState } from "react"
import { useAppDispatch } from "@/store/hooks"
import { fetchAppointmentsAction } from "@/store/appointmentSlice"
import { createAppointment } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, User, Phone, MessageSquare, Building2, Stethoscope, Plus, DollarSign } from "lucide-react"

export default function CreateAppointment() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    clinic: "Smile Dental Clinic",
    service: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    message: "",
    amount: "",
  })

  const services = [
    "Root Canal",
    "Teeth Cleaning",
    "Tooth Extraction",
    "Dental Filling",
    "Teeth Whitening",
    "Dental Crown",
    "Dental Implant",
    "Orthodontics",
    "Gum Treatment",
    "Dental Checkup",
  ]

  const timeSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
  ]

  const amountOptions = Array.from({ length: 20 }, (_, i) => (i + 1) * 500)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const sendConfirmationMessage = (appointmentData: any) => {
    const formatPhoneNumber = (phone: string) => {
      // Remove any existing country code or special characters
      let cleanPhone = phone.replace(/[^\d]/g, "")

      // If phone starts with 0, replace with 92
      if (cleanPhone.startsWith("0")) {
        cleanPhone = "92" + cleanPhone.substring(1)
      }
      // If phone doesn't start with 92, add it
      else if (!cleanPhone.startsWith("92")) {
        cleanPhone = "92" + cleanPhone
      }

      return cleanPhone
    }

    const message = `Hello ${appointmentData.name}! Your appointment is confirmed:

📅 Date: ${appointmentData.date}
⏰ Time: ${appointmentData.time}
🏥 Service: ${appointmentData.service}
📍 Clinic: ${appointmentData.clinic}${
      appointmentData.amount
        ? `
💰 Amount: Rs. ${appointmentData.amount.toLocaleString()}`
        : ""
    }

Please arrive 15 minutes early. Thank you!`

    const encodedMessage = encodeURIComponent(message)
    const formattedPhone = formatPhoneNumber(appointmentData.phone)
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`

    window.open(whatsappUrl, "_blank")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const appointmentData = {
        ...formData,
        amount: formData.amount ? Number(formData.amount) : undefined,
      }
      await createAppointment(appointmentData)

      dispatch(fetchAppointmentsAction())

      sendConfirmationMessage(appointmentData)

      setFormData({
        clinic: "Smile Dental Clinic",
        service: "",
        date: "",
        time: "",
        name: "",
        phone: "",
        message: "",
        amount: "",
      })

      toast({
        title: "Success!",
        description: "Appointment created successfully. Confirmation message sent to patient.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error creating appointment:", error)
      toast({
        title: "Error",
        description: "Failed to create appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-gray-800">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
            <span className="hidden sm:inline">Create New Appointment</span>
            <span className="sm:hidden">New Appointment</span>
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">Fill in the details to schedule a new patient appointment</p>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                <User className="h-4 w-4 text-blue-600" />
                Patient Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    Patient Name *
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter patient full name"
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    Phone Number *
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="03001234567"
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                Clinic & Service
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    Clinic Name *
                  </label>
                  <Input
                    name="clinic"
                    value={formData.clinic}
                    onChange={handleInputChange}
                    placeholder="Enter clinic name"
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-gray-500" />
                    Service Type *
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    required
                  >
                    <option value="" className="text-gray-500">
                      Select a service
                    </option>
                    {services.map((service) => (
                      <option key={service} value={service} className="text-gray-900">
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Schedule
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Appointment Date *
                  </label>
                  <Input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    Appointment Time *
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    required
                  >
                    <option value="" className="text-gray-500">
                      Select time slot
                    </option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time} className="text-gray-900">
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                Payment Information
              </h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  Amount (Optional)
                </label>
                <select
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                >
                  <option value="" className="text-gray-500">
                    Select amount (optional)
                  </option>
                  {amountOptions.map((amount) => (
                    <option key={amount} value={amount} className="text-gray-900">
                      Rs. {amount.toLocaleString()}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500">Choose from predefined amounts or leave empty to set later</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2 border-b pb-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                Additional Notes
              </h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  Message (Optional)
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Any special requirements, symptoms, or additional information..."
                  rows={4}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Appointment...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Appointment
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
