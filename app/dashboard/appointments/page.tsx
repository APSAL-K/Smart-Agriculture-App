"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, MapPin, AlertCircle } from "lucide-react"

const mockDoctors = [
  {
    id: "doc-1",
    name: "Dr. Raj Patel",
    specialization: "Hepatology",
    experience: 15,
    rating: 4.8,
    hospital: "City Medical Center",
    consultationFee: 50,
    availableSlots: ["2026-03-05 10:00", "2026-03-05 14:00", "2026-03-06 11:00"]
  },
  {
    id: "doc-2",
    name: "Dr. Sarah Johnson",
    specialization: "Gastroenterology",
    experience: 12,
    rating: 4.9,
    hospital: "Metro Hospital",
    consultationFee: 60,
    availableSlots: ["2026-03-05 15:00", "2026-03-07 09:00", "2026-03-07 16:00"]
  },
  {
    id: "doc-3",
    name: "Dr. Amit Singh",
    specialization: "Hepatology",
    experience: 20,
    rating: 4.7,
    hospital: "Premier Health",
    consultationFee: 75,
    availableSlots: ["2026-03-06 13:00", "2026-03-08 10:00", "2026-03-08 15:00"]
  }
]

const mockAppointments = [
  {
    id: "apt-1",
    doctorName: "Dr. Raj Patel",
    specialization: "Hepatology",
    date: "2026-03-10 14:00",
    status: "scheduled",
    reason: "Follow-up for elevated liver enzymes"
  },
  {
    id: "apt-2",
    doctorName: "Dr. Sarah Johnson",
    specialization: "Gastroenterology",
    date: "2026-02-28 10:00",
    status: "completed",
    reason: "Initial consultation"
  }
]

export default function AppointmentsPage() {
  const { user } = useAuth()
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [bookingReason, setBookingReason] = useState("")

  const handleBooking = () => {
    if (selectedDoctor && selectedSlot) {
      alert(`Appointment booked! Doctor: ${mockDoctors.find(d => d.id === selectedDoctor)?.name}, Slot: ${selectedSlot}`)
      setSelectedDoctor(null)
      setSelectedSlot(null)
      setBookingReason("")
    }
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-card p-6 rounded-2xl border shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Doctor Appointments</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Schedule consultations with hepatologists and gastroenterologists
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="rounded-2xl">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled consultations</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {mockAppointments.filter(a => a.status === "scheduled").length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming appointments</p>
              ) : (
                mockAppointments.filter(a => a.status === "scheduled").map(apt => (
                  <div key={apt.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{apt.doctorName}</p>
                      <Badge variant="outline" className="text-xs">{apt.specialization}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {apt.date}
                    </div>
                    <p className="text-xs">{apt.reason}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Doctor Selection & Booking */}
        <div className="lg:col-span-2 space-y-6">
          {/* Available Doctors */}
          <Card className="rounded-2xl">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Available Specialists</CardTitle>
              <CardDescription>Select a doctor and available time slot</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {mockDoctors.map(doctor => (
                <div
                  key={doctor.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedDoctor === doctor.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedDoctor(doctor.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">{doctor.name}</p>
                      <p className="text-sm text-muted-foreground">{doctor.specialization} • {doctor.experience} years</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-yellow-500/10 text-yellow-700 px-2 py-1 rounded">
                          ★ {doctor.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">{doctor.hospital}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">₹{doctor.consultationFee}</Badge>
                  </div>

                  {selectedDoctor === doctor.id && (
                    <div className="space-y-3 mt-4 pt-4 border-t">
                      <div>
                        <p className="text-sm font-medium mb-2">Available Slots</p>
                        <div className="grid grid-cols-2 gap-2">
                          {doctor.availableSlots.map(slot => (
                            <button
                              key={slot}
                              onClick={() => setSelectedSlot(slot)}
                              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                selectedSlot === slot
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted hover:bg-muted/80"
                              }`}
                            >
                              <Clock className="h-3 w-3 inline mr-1" />
                              {new Date(slot).toLocaleString()}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium block mb-2">Reason for Visit</label>
                        <textarea
                          value={bookingReason}
                          onChange={(e) => setBookingReason(e.target.value)}
                          placeholder="Describe your health concern or reason for appointment..."
                          className="w-full px-3 py-2 rounded-lg border bg-background text-sm resize-none h-20"
                        />
                      </div>

                      <Button
                        onClick={handleBooking}
                        disabled={!selectedSlot}
                        className="w-full"
                      >
                        Book Appointment
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Booking Info */}
          <Card className="border-blue-200 bg-blue-50/50 rounded-2xl">
            <CardHeader className="pb-2">
              <div className="flex gap-2 items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <CardTitle className="text-base text-blue-900">Important Information</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-blue-800 space-y-2">
              <p>• Payment is processed during checkout</p>
              <p>• You will receive a confirmation email with join details</p>
              <p>• Consultations are conducted via secure video call</p>
              <p>• Share your recent lab reports for better diagnosis</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
