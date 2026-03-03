"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/store/redux-store"
import { addAppointment } from "@/lib/store/appointments-slice"
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
import { Calendar, Clock, User, FileText, DollarSign } from "lucide-react"
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

      dispatch(addAppointment(newAppointment))
      toast.success("Appointment booked successfully! Proceed to payment.")
      setSelectedDoctor("")
      setDate("")
      setTime("")
      setReason("")
      onOpenChange(false)
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
              Reason for Consultation
            </Label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your health concern or reason for visit"
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Consultation Fee */}
          {selectedDoctorData && (
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">Consultation Fee</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedDoctorData.name}
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold text-primary">
                  ₹{selectedDoctorData.fee}
                </p>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBook}
              disabled={!selectedDoctor || !date || !time || loading}
              className="flex-1"
            >
              {loading ? "Booking..." : "Proceed to Payment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
