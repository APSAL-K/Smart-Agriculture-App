import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Appointment {
  id: string
  userEmail: string
  doctorName: string
  doctorSpecialty: string
  date: string
  time: string
  reason: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes?: string
  consultationFee: number
  paymentStatus: "pending" | "completed" | "failed"
  createdAt: number
}

interface AppointmentsState {
  appointments: Appointment[]
  selectedAppointment: Appointment | null
}

const initialState: AppointmentsState = {
  appointments: [],
  selectedAppointment: null,
}

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload)
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(
        (apt) => apt.id === action.payload.id
      )
      if (index !== -1) {
        state.appointments[index] = action.payload
      }
    },
    cancelAppointment: (state, action: PayloadAction<string>) => {
      const appointment = state.appointments.find((apt) => apt.id === action.payload)
      if (appointment) {
        appointment.status = "cancelled"
      }
    },
    setSelectedAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.selectedAppointment = action.payload
    },
    updatePaymentStatus: (
      state,
      action: PayloadAction<{
        appointmentId: string
        paymentStatus: "pending" | "completed" | "failed"
      }>
    ) => {
      const appointment = state.appointments.find(
        (apt) => apt.id === action.payload.appointmentId
      )
      if (appointment) {
        appointment.paymentStatus = action.payload.paymentStatus
        // Update appointment status to confirmed when payment is completed
        if (action.payload.paymentStatus === "completed") {
          appointment.status = "confirmed"
        }
      }
    },
    clearAppointments: (state) => {
      state.appointments = []
      state.selectedAppointment = null
    },
  },
})

export const {
  setAppointments,
  addAppointment,
  updateAppointment,
  cancelAppointment,
  setSelectedAppointment,
  updatePaymentStatus,
  clearAppointments,
} = appointmentsSlice.actions
export default appointmentsSlice.reducer
