export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://dr-usama-sheikh-backend.vercel.app"

console.log("API_BASE_URL:", API_BASE_URL)

export interface Appointment {
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
  status: "pending" | "completed" | "rejected"
  amount: number
}

export const appointmentAPI = {
  // Fetch all appointments
  async getAppointments(): Promise<Appointment[]> {
    try {
      console.log("Fetching appointments from:", `${API_BASE_URL}/api/appointmentRoutes`)

      const response = await fetch(`${API_BASE_URL}/api/appointmentRoutes`)

      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Fetched appointments data:", data)

      return data
    } catch (error) {
      console.error("Error fetching appointments:", error)
      throw error
    }
  },

  // Update appointment status with optional amount
  async updateAppointmentStatus(
    id: string,
    status: "pending" | "completed" | "rejected",
    amount?: number,
  ): Promise<Appointment> {
    try {
      const requestBody: { status: string; amount?: number } = { status }

      // Add amount to request body if provided
      if (amount !== undefined) {
        requestBody.amount = amount
      }

      const response = await fetch(`${API_BASE_URL}/api/appointmentRoutes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error updating appointment status:", error)
      throw error
    }
  },

  async createAppointment(appointmentData: {
    clinic: string
    service: string
    date: string
    time: string
    name: string
    phone: string
    message: string
  }): Promise<Appointment> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointmentRoutes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...appointmentData,
          status: "pending", // Default status for new appointments
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error creating appointment:", error)
      throw error
    }
  },

  async deleteAppointment(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointmentRoutes/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error deleting appointment:", error)
      throw error
    }
  },
}

// Export convenience function for fetching appointments
export const fetchAppointments = appointmentAPI.getAppointments

// Export convenience function for updating appointment status
export const updateAppointmentStatus = appointmentAPI.updateAppointmentStatus

export const createAppointment = appointmentAPI.createAppointment

export const deleteAppointment = appointmentAPI.deleteAppointment

export interface Query {
  _id: string
  name: string
  phone: string
  department: string
  message: string
  status: "pending" | "answered" | "closed"
  createdAt: string
  updatedAt: string
}

export const queryAPI = {
  // Fetch all queries
  async getQueries(): Promise<Query[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/queries`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching queries:", error)
      throw error
    }
  },

  // Update query status
  async updateQueryStatus(id: string, status: "pending" | "answered" | "closed"): Promise<Query> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/queries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error updating query status:", error)
      throw error
    }
  },

  // Delete query
  async deleteQuery(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/queries/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error deleting query:", error)
      throw error
    }
  },
}

// Export convenience functions for queries
export const fetchQueries = queryAPI.getQueries
export const updateQueryStatus = queryAPI.updateQueryStatus
export const deleteQuery = queryAPI.deleteQuery
