import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth-slice'
import settingsReducer from './settings-slice'
import communityReducer from './community-slice'
import appointmentsReducer from './appointments-slice'
import { setAppointments } from './appointments-slice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        settings: settingsReducer,
        community: communityReducer,
        appointments: appointmentsReducer,
    },
})

// Hydrate appointments from localStorage on store creation
if (typeof window !== 'undefined') {
    const savedAppointments = localStorage.getItem('liver_disease_app_appointments')
    if (savedAppointments) {
        try {
            const parsed = JSON.parse(savedAppointments)
            store.dispatch(setAppointments(parsed))
            console.log("[v0] Appointments hydrated from localStorage:", parsed.length, "appointments")
        } catch (error) {
            console.error("[v0] Error hydrating appointments:", error)
        }
    }
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
