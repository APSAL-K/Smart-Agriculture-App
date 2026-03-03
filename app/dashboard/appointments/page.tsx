"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/store/redux-store"
import { cancelAppointment } from "@/lib/store/appointments-slice"
import { usePersistAppointments } from "@/lib/use-persist-appointments"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AppointmentBookingModal } from "@/components/appointment-booking-modal"
import { Calendar, Clock, User, MapPin, Trash2, Eye, Plus, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function AppointmentsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const dispatch = useDispatch()
  const appointments = useSelector(
    (state: RootState) => state.appointments.appointments
  )
  const [mounted, setMounted] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)

  usePersistAppointments()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !user && mounted) {
      router.push("/login")
    }
  }, [user, loading, router, mounted])

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-primary mx-auto animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading appointments...</p>
        </div>
      </div>
    )
  }

  const userAppointments = appointments.filter(
    (apt) => apt.userEmail === user?.email
  )

  const upcomingAppointments = userAppointments.filter(
    (apt) => apt.status !== "completed" && apt.status !== "cancelled"
  )

  const completedAppointments = userAppointments.filter(
    (apt) => apt.status === "completed"
  )

  const cancelledAppointments = userAppointments.filter(
    (apt) => apt.status === "cancelled"
  )

  const handleCancelAppointment = (appointmentId: string) => {
    if (
      confirm(
        "Are you sure you want to cancel this appointment?"
      )
    ) {
      dispatch(cancelAppointment(appointmentId))
      toast.success("Appointment cancelled successfully")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Your Appointments
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Manage and track your healthcare consultations
          </p>
        </div>
        <Button onClick={() => setShowBookingModal(true)} className="w-full md:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Book New Appointment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-semibold">Upcoming</p>
            <p className="text-2xl font-bold text-primary">{upcomingAppointments.length}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-semibold">Completed</p>
            <p className="text-2xl font-bold text-primary">{completedAppointments.length}</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-semibold">Total</p>
            <p className="text-2xl font-bold text-primary">{userAppointments.length}</p>
          </div>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <div className="space-y-4">
        <h2 className="text-lg md:text-xl font-semibold">Upcoming Appointments</h2>
        {upcomingAppointments.length === 0 ? (
          <Card className="p-8">
            <div className="text-center space-y-3">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">No upcoming appointments</p>
              <Button onClick={() => setShowBookingModal(true)} variant="outline">
                Book Your First Appointment
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {upcomingAppointments.map((apt) => (
              <Card key={apt.id} className="p-4 md:p-6 border-l-4 border-l-primary">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-base md:text-lg">{apt.doctorName}</h3>
                      <p className="text-sm text-muted-foreground">{apt.doctorSpecialty}</p>
                    </div>

                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(apt.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{apt.time}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground italic">
                      {apt.reason}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(apt.status)}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </Badge>
                      <Badge className={getPaymentStatusColor(apt.paymentStatus)}>
                        Payment: {apt.paymentStatus.charAt(0).toUpperCase() + apt.paymentStatus.slice(1)}
                      </Badge>
                    </div>

                    <div className="bg-primary/5 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Consultation Fee</p>
                      <p className="text-lg font-bold text-primary">₹{apt.consultationFee}</p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {apt.paymentStatus === "pending" && (
                        <Link href={`/dashboard/appointments/${apt.id}/payment`}>
                          <Button size="sm" variant="default">
                            Complete Payment
                          </Button>
                        </Link>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelAppointment(apt.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Appointments */}
      {completedAppointments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold">Completed Appointments</h2>
          <div className="grid gap-4">
            {completedAppointments.map((apt) => (
              <Card key={apt.id} className="p-4 md:p-6 opacity-75">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{apt.doctorName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(apt.date).toLocaleDateString()} at {apt.time}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
                    <span className="text-sm font-semibold text-primary">₹{apt.consultationFee}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <AppointmentBookingModal
        open={showBookingModal}
        onOpenChange={setShowBookingModal}
      />
    </div>
  )
}
