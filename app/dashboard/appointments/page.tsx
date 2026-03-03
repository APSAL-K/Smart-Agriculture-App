"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, User, MapPin, AlertCircle, CreditCard, CheckCircle2, Loader2 } from "lucide-react"
import { toast } from "sonner"

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
    reason: "Follow-up for elevated liver enzymes",
    fee: 50
  },
  {
    id: "apt-2",
    doctorName: "Dr. Sarah Johnson",
    specialization: "Gastroenterology",
    date: "2026-02-28 10:00",
    status: "completed",
    reason: "Initial consultation",
    fee: 60
  }
]

interface PaymentStep {
  step: "details" | "payment" | "confirmation"
}

export default function AppointmentsPage() {
  const { user } = useAuth()
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [bookingReason, setBookingReason] = useState("")
  const [paymentStep, setPaymentStep] = useState<PaymentStep["step"]>("details")
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  const currentDoctor = mockDoctors.find(d => d.id === selectedDoctor)

  const handleInitiatePayment = () => {
    if (!selectedSlot || !bookingReason) {
      toast.error("Please select a slot and provide a reason for visit")
      return
    }
    setPaymentStep("payment")
  }

  const handleProcessPayment = async () => {
    setIsProcessing(true)
    try {
      // Simulate Stripe payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In real app, this would call your backend to create a Stripe Checkout session
      // await createCheckoutSession({ 
      //   doctorId: selectedDoctor, 
      //   slot: selectedSlot,
      //   amount: currentDoctor?.consultationFee 
      // })
      
      setPaymentStep("confirmation")
      setBookingConfirmed(true)
      toast.success("Appointment booked successfully! Confirmation sent to your email.")
    } catch (error) {
      toast.error("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleResetBooking = () => {
    setSelectedDoctor(null)
    setSelectedSlot(null)
    setBookingReason("")
    setPaymentStep("details")
    setBookingConfirmed(false)
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-card p-6 rounded-2xl border shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Book a Consultation</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Schedule appointments with specialist doctors for liver disease evaluation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Your Appointments</CardTitle>
              <CardDescription>Upcoming and past consultations</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {mockAppointments.filter(a => a.status === "scheduled").length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming appointments</p>
              ) : (
                mockAppointments.filter(a => a.status === "scheduled").map(apt => (
                  <div key={apt.id} className="border rounded-lg p-3 space-y-2 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{apt.doctorName}</p>
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary">{apt.specialization}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(apt.date).toLocaleString()}
                    </div>
                    <p className="text-xs leading-relaxed">{apt.reason}</p>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-xs font-medium">Consultation Fee</span>
                      <span className="font-semibold text-sm">₹{apt.fee}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Booking Summary */}
          {selectedDoctor && (
            <Card className="rounded-2xl border shadow-sm bg-gradient-to-b from-primary/5 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor</span>
                  <span className="font-medium">{currentDoctor?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialization</span>
                  <span className="font-medium">{currentDoctor?.specialization}</span>
                </div>
                {selectedSlot && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">{new Date(selectedSlot).toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Total Amount</span>
                  <span className="font-bold text-lg text-primary">₹{currentDoctor?.consultationFee}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Doctor Selection & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Process */}
          {!bookingConfirmed ? (
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {paymentStep === "details" && "Select Doctor & Time"}
                  {paymentStep === "payment" && "Payment Details"}
                  {paymentStep === "confirmation" && "Booking Confirmed"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {paymentStep === "details" && (
                  <div className="space-y-4">
                    {/* Available Doctors */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold">Select a Doctor</p>
                      {mockDoctors.map(doctor => (
                        <div
                          key={doctor.id}
                          className={`border rounded-xl p-4 cursor-pointer transition-all ${
                            selectedDoctor === doctor.id
                              ? "border-primary bg-primary/5 shadow-md"
                              : "hover:border-primary/50 hover:shadow-sm"
                          }`}
                          onClick={() => setSelectedDoctor(doctor.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-semibold">{doctor.name}</p>
                              <p className="text-sm text-muted-foreground">{doctor.specialization} • {doctor.experience} years exp</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs bg-yellow-500/10 text-yellow-700 px-2 py-1 rounded-full font-medium">
                                  ★ {doctor.rating}
                                </span>
                                <span className="text-xs text-muted-foreground">{doctor.hospital}</span>
                              </div>
                            </div>
                            <Badge className="bg-primary text-primary-foreground">₹{doctor.consultationFee}</Badge>
                          </div>

                          {selectedDoctor === doctor.id && (
                            <div className="space-y-4 mt-4 pt-4 border-t">
                              <div>
                                <label className="text-sm font-semibold block mb-3">Available Slots</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {doctor.availableSlots.map(slot => (
                                    <button
                                      key={slot}
                                      onClick={() => setSelectedSlot(slot)}
                                      className={`px-4 py-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                                        selectedSlot === slot
                                          ? "bg-primary text-primary-foreground shadow-md"
                                          : "bg-muted hover:bg-muted/80"
                                      }`}
                                    >
                                      <Clock className="h-4 w-4" />
                                      {new Date(slot).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <label className="text-sm font-semibold block mb-2">Reason for Visit</label>
                                <textarea
                                  value={bookingReason}
                                  onChange={(e) => setBookingReason(e.target.value)}
                                  placeholder="Describe your health concern (e.g., elevated liver enzymes, jaundice, abdominal pain)..."
                                  className="w-full px-4 py-3 rounded-lg border bg-background text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handleInitiatePayment}
                      disabled={!selectedSlot || !bookingReason}
                      className="w-full h-11 rounded-lg"
                      size="lg"
                    >
                      Continue to Payment
                    </Button>
                  </div>
                )}

                {paymentStep === "payment" && (
                  <div className="space-y-6">
                    {/* Order Summary */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Consultation Fee</span>
                        <span className="font-medium">₹{currentDoctor?.consultationFee}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Platform Fee</span>
                        <span className="font-medium">₹0</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-lg text-primary">₹{currentDoctor?.consultationFee}</span>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold">Select Payment Method</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="border-2 border-primary rounded-lg p-3 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition-all">
                          💳 Credit Card
                        </button>
                        <button className="border rounded-lg p-3 text-sm font-semibold hover:border-primary/50 transition-all">
                          📱 UPI
                        </button>
                      </div>
                    </div>

                    {/* Mock Card Form */}
                    <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full px-3 py-2 border rounded-lg text-sm bg-background"
                        defaultValue="4242 4242 4242 4242"
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="px-3 py-2 border rounded-lg text-sm bg-background"
                          defaultValue="12/25"
                        />
                        <input
                          type="text"
                          placeholder="CVC"
                          className="px-3 py-2 border rounded-lg text-sm bg-background"
                          defaultValue="123"
                        />
                        <input
                          type="text"
                          placeholder="Zip"
                          className="px-3 py-2 border rounded-lg text-sm bg-background"
                          defaultValue="10001"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setPaymentStep("details")}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleProcessPayment}
                        disabled={isProcessing}
                        className="flex-1"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Pay ₹{currentDoctor?.consultationFee}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {paymentStep === "confirmation" && bookingConfirmed && (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <CheckCircle2 className="h-16 w-16 text-green-500 animate-in zoom-in" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">Appointment Confirmed!</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your consultation has been successfully booked
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left space-y-2">
                      <p className="text-sm"><span className="font-semibold">Doctor:</span> {currentDoctor?.name}</p>
                      <p className="text-sm"><span className="font-semibold">Date & Time:</span> {new Date(selectedSlot!).toLocaleString()}</p>
                      <p className="text-sm"><span className="font-semibold">Confirmation:</span> Sent to your email</p>
                      <p className="text-sm"><span className="font-semibold">Join Link:</span> You'll receive it 15 mins before</p>
                    </div>
                    <Button onClick={handleResetBooking} className="w-full">
                      Book Another Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          {/* Info Card */}
          <Alert className="border-blue-200 bg-blue-50/50 rounded-lg">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm space-y-1">
              <p>✓ Payment is secure and encrypted with Stripe</p>
              <p>✓ Confirmation email with video call link sent immediately</p>
              <p>✓ Consultations are conducted via secure video call</p>
              <p>✓ Share your lab reports during the consultation</p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
