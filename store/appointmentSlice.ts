import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { appointmentAPI } from "@/lib/api"

export interface Appointment {
  _id?: string
  id?: string
  clinic: string
  service: string
  date: string
  time: string
  name: string
  phone: string
  message: string
  status?: "pending" | "completed" | "rejected"
  amount?: number
  createdAt: string
  updatedAt: string
}

interface AppointmentState {
  appointments: Appointment[]
  loading: boolean
  error: string | null
  lastFetch: number
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
  error: null,
  lastFetch: 0,
}

export const fetchAppointments = createAsyncThunk("appointments/fetchAppointments", async () => {
  try {
    const response = await appointmentAPI.getAppointments()
    return response
  } catch (error) {
    throw error
  }
})

export const fetchAppointmentsAction = fetchAppointments

export const updateAppointmentStatus = createAsyncThunk(
  "appointments/updateAppointmentStatus",
  async ({ id, status, amount }: { id: string; status: string; amount?: number }) => {
    try {
      const response = await appointmentAPI.updateAppointmentStatus(id, status, amount)
      return { id, status, amount, ...response }
    } catch (error) {
      throw error
    }
  },
)

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setLastFetch: (state) => {
      state.lastFetch = Date.now()
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false
        state.appointments = action.payload || []
        state.lastFetch = Date.now()
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch appointments"
      })
      // Update appointment status
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const { id, status, amount } = action.payload
        const appointment = state.appointments.find((apt) => apt._id === id || apt.id === id)
        if (appointment) {
          appointment.status = status as "pending" | "completed" | "rejected"
          if (amount !== undefined) {
            appointment.amount = amount
          }
        }
      })
  },
})

export const { clearError, setLastFetch } = appointmentSlice.actions
export default appointmentSlice.reducer
