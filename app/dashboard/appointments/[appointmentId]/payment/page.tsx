"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/lib/store/redux-store"
import { updatePaymentStatus } from "@/lib/store/appointments-slice"
import { useAuth } from "@/lib/auth-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import {
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function AppointmentPaymentPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useDispatch()
  const { user, loading: authLoading } = useAuth()
  const appointments = useSelector(
    (state: RootState) => state.appointments.appointments
  )

  const appointmentId = params?.appointmentId as string
  const [loading, setLoading] = useState(false)
  const [cardNumber, setCardNumber] = useState("4242424242424242")
  const [expiryDate, setExpiryDate] = useState("12/25")
  const [cvc, setCvc] = useState("123")
  const [zipCode, setZipCode] = useState("10001")
  const [mounted, setMounted] = useState(false)
  const [appointmentFromStorage, setAppointmentFromStorage] = useState<any>(null)

  let appointment = appointments.find((apt) => apt.id === appointmentId)
  // Fallback to localStorage if Redux doesn't have it
  if (!appointment && appointmentFromStorage) {
    appointment = appointmentFromStorage
  }

  useEffect(() => {
    setMounted(true)
    // Try to load from localStorage if Redux is empty
    if (appointmentId && appointments.length === 0) {
      const savedAppointments = localStorage.getItem(
        "liver_disease_app_appointments"
      )
      if (savedAppointments) {
        try {
          const parsed = JSON.parse(savedAppointments)
          // Find the appointment
          const foundAppointment = parsed.find((apt: any) => apt.id === appointmentId)
          if (foundAppointment) {
            setAppointmentFromStorage(foundAppointment)
          }
        } catch (error) {
          console.error("[v0] Error loading from localStorage:", error)
        }
      }
    }
  }, [appointmentId, appointments.length])

  useEffect(() => {
    if (!authLoading && !user && mounted) {
      router.push("/login")
    }
  }, [authLoading, user, router, mounted])

  // Check if appointment exists after hydration
  useEffect(() => {
    if (mounted && appointmentId && !appointment) {
      console.log("[v0] Payment page - Could not find appointment:", appointmentId)
    }
  }, [appointment, appointmentId, mounted])

  useEffect(() => {
    // Check if payment was successful
    const paymentStatus = searchParams.get("payment")
    if (paymentStatus === "success") {
      dispatch(
        updatePaymentStatus({
          appointmentId: appointmentId,
          paymentStatus: "completed",
        })
      )
      toast.success("Payment successful! Your appointment is confirmed.")
      setTimeout(() => {
        router.push("/dashboard/appointments")
      }, 2000)
    }
  }, [searchParams, appointmentId, dispatch, router])

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <CardTitle>Appointment Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              We couldn't find the appointment you're trying to pay for.
            </p>
            <Link href="/dashboard/appointments">
              <Button className="w-full">Back to Appointments</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvc || !zipCode) {
      toast.error("Please fill in all payment details")
      return
    }

    setLoading(true)
    try {
      // Simulate Stripe payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In production, this would call your backend API
      // const session = await createCheckoutSession({
      //   appointmentId: appointment.id,
      //   doctorName: appointment.doctorName,
      //   amount: appointment.consultationFee,
      //   userEmail: user?.email || "",
      //   appointmentDate: appointment.date,
      // })
      // Redirect to Stripe checkout or process payment

      dispatch(
        updatePaymentStatus({
          appointmentId: appointment.id,
          paymentStatus: "completed",
        })
      )

      // Update localStorage with payment status
      const allAppointments = JSON.parse(
        localStorage.getItem("liver_disease_app_appointments") || "[]"
      )
      const updatedAppointments = allAppointments.map((apt: any) =>
        apt.id === appointment.id
          ? {
              ...apt,
              paymentStatus: "completed",
              status: "confirmed",
            }
          : apt
      )
      localStorage.setItem(
        "liver_disease_app_appointments",
        JSON.stringify(updatedAppointments)
      )

      toast.success("Payment successful!")
      setTimeout(() => {
        router.push("/dashboard/appointments")
      }, 1500)
    } catch (error) {
      toast.error("Payment failed. Please try again.")
      console.error("[v0] Payment error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {!mounted || authLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin mb-4" />
            <p className="text-muted-foreground">Loading payment details...</p>
          </div>
        </div>
      ) : !appointment ? (
        <Card className="border-red-200 bg-red-50/30">
          <CardHeader>
            <CardTitle className="text-red-700">Appointment Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 mb-4">
              The appointment could not be found. Please go back and try booking again.
            </p>
            <Link href="/dashboard/appointments">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Appointments
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
      {/* Header */}
      <div>
        <Link href="/dashboard/appointments">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Complete Payment</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2">
          Secure payment for your doctor consultation
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Payment Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Information
            </CardTitle>
            <CardDescription>
              Enter your credit card details securely
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Summary */}
            <Alert className="border-blue-200 bg-blue-50/50">
              <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <AlertDescription className="text-blue-800 text-xs md:text-sm">
                <p className="font-semibold">
                  Doctor: {appointment.doctorName}
                </p>
                <p className="text-xs md:text-sm">
                  {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                </p>
              </AlertDescription>
            </Alert>

            {/* Card Details */}
            <div className="space-y-4 p-3 md:p-4 bg-muted/30 rounded-lg border">
              <div>
                <Label htmlFor="cardNumber" className="text-xs md:text-sm font-semibold">
                  Card Number
                </Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  className="mt-2 bg-background text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Test: 4242 4242 4242 4242
                </p>
              </div>

              <div>
                <Label htmlFor="expiryDate" className="text-xs md:text-sm font-semibold">
                  Expiry Date
                </Label>
                <Input
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  className="mt-2 bg-background text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div>
                  <Label htmlFor="cvc" className="text-xs md:text-sm font-semibold">
                    CVC
                  </Label>
                  <Input
                    id="cvc"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    maxLength={3}
                    className="mt-2 bg-background text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode" className="text-xs md:text-sm font-semibold">
                    Zip Code
                  </Label>
                  <Input
                    id="zipCode"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="10001"
                    className="mt-2 bg-background text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Security Info */}
            <Alert className="border-green-200 bg-green-50/50">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
              <AlertDescription className="text-green-800 text-xs md:text-sm">
                Payment is secure with Stripe. Card details are encrypted and never stored on our servers.
              </AlertDescription>
            </Alert>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={loading}
              className="w-full h-10 md:h-11 text-sm md:text-base"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ₹{appointment.consultationFee}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="h-fit lg:sticky lg:top-4">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Doctor</span>
                <span className="font-semibold text-right">
                  {appointment.doctorName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Specialty</span>
                <span className="font-semibold text-right">
                  {appointment.doctorSpecialty}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date</span>
                <span className="font-semibold text-right">
                  {new Date(appointment.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time</span>
                <span className="font-semibold text-right">{appointment.time}</span>
              </div>

              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-semibold">Consultation Fee</span>
                <span className="text-base md:text-lg font-bold text-primary">
                  ₹{appointment.consultationFee}
                </span>
              </div>

              <div className="bg-primary/10 p-3 md:p-4 rounded-lg text-center space-y-1">
                <p className="text-xs text-muted-foreground">Total Amount</p>
                <p className="text-xl md:text-2xl font-bold text-primary">
                  ₹{appointment.consultationFee}
                </p>
              </div>
            </div>

            {/* Status */}
            {appointment.paymentStatus === "completed" && (
              <Alert className="border-green-200 bg-green-50/50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 text-sm">
                  Payment completed successfully!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
        </>
      )}
    </div>
  )
}
