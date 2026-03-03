import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/store/redux-store"
import { setAppointments } from "@/lib/store/appointments-slice"
import type { Appointment } from "@/lib/store/appointments-slice"

const APPOINTMENTS_STORAGE_KEY = "liver_disease_app_appointments"

export function usePersistAppointments() {
  const dispatch = useDispatch()
  const appointments = useSelector(
    (state: RootState) => state.appointments.appointments
  )

  // Load appointments from localStorage on mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY)
    if (savedAppointments) {
      try {
        const parsed = JSON.parse(savedAppointments)
        dispatch(setAppointments(parsed))
      } catch (error) {
        console.error("[v0] Error loading appointments:", error)
      }
    }
  }, [dispatch])

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments))
  }, [appointments])
}
