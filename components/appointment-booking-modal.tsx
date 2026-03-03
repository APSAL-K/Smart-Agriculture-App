"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/store/redux-store"
import { addAppointment, setSelectedAppointment } from "@/lib/store/appointments-slice"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Calendar, Clock, User, FileText, DollarSign, Loader2 } from "lucide-react"
import { mockDoctors } from "@/lib/mock-data"

interface AppointmentBookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBookingComplete?: () => void
}

export function AppointmentBookingModal({
  open,
  onOpenChange,
  onBookingComplete,
}: AppointmentBookingModalProps) {
  const { user } = useAuth()
  const router = useRouter()
  const dispatch = useDispatch()
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [time, setTime] = useState<string>("")
  const [reason, setReason] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ]

  const selectedDoctorData = mockDoctors.find((doc) => doc.id === selectedDoctor)

  const handleBook = async () => {
    if (!selectedDoctor || !date || !time || !reason.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const appointmentId = `APT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const newAppointment = {
        id: appointmentId,
        userEmail: user?.email || "user@example.com",
        doctorName: selectedDoctorData?.name || "",
        doctorSpecialty: selectedDoctorData?.specialty || "",
        date,
        time,
        reason,
        status: "pending" as const,
        consultationFee: selectedDoctorData?.fee || 500,
        paymentStatus: "pending" as const,
        createdAt: Date.now(),
      }

      // Add to Redux
      dispatch(addAppointment(newAppointment))
      // Set as selected for payment
      dispatch(setSelectedAppointment(newAppointment))
      
      // Save to localStorage
      const allAppointments = JSON.parse(
        localStorage.getItem("liver_disease_app_appointments") || "[]"
      )
      allAppointments.push(newAppointment)
      localStorage.setItem(
        "liver_disease_app_appointments",
        JSON.stringify(allAppointments)
      )

      console.log("[v0] Appointment booked:", appointmentId)
      toast.success("Appointment booked! Redirecting to payment...")
      
      // Reset form
      setSelectedDoctor("")
      setDate("")
      setTime("")
      setReason("")
      onOpenChange(false)
      
      // Navigate to payment page after a short delay
      setTimeout(() => {
        console.log("[v0] Navigating to payment:", appointmentId)
        router.push(`/dashboard/appointments/${appointmentId}/payment`)
      }, 600)
      
      onBookingComplete?.()
    } catch (error) {
      toast.error("Failed to book appointment")
      console.error("[v0] Booking error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book an Appointment</DialogTitle>
          <DialogDescription>
            Schedule a consultation with a healthcare specialist
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Doctor Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Select a Doctor
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mockDoctors.map((doctor) => (
                <Card
                  key={doctor.id}
                  className={`p-4 cursor-pointer transition-all border-2 ${
                    selectedDoctor === doctor.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedDoctor(doctor.id)}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{doctor.name}</p>
                        <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-primary">
                          ₹{doctor.fee}
                        </p>
                        <p className="text-xs text-muted-foreground">per session</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Rating: {doctor.rating}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Select Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="bg-background"
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Select Time
            </Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Choose time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reason for Visit */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Reason for Visit
            </Label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe your health concern (e.g., elevated liver enzymes, jaundice...)"
              className="w-full px-3 py-2 border rounded-lg bg-background text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Summary */}
          {selectedDoctorData && date && time && (
            <Card className="bg-primary/5 border-primary/20 p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor</span>
                  <span className="font-semibold">{selectedDoctorData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-semibold">{date} at {time}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Consultation Fee</span>
                  <span className="text-primary">₹{selectedDoctorData.fee}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBook}
              disabled={!selectedDoctor || !date || !time || !reason.trim() || loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Book & Pay
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
