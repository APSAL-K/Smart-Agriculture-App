import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function createCheckoutSession(data: {
  appointmentId: string
  doctorName: string
  amount: number
  userEmail: string
  appointmentDate: string
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Consultation with ${data.doctorName}`,
              description: `Appointment on ${data.appointmentDate}`,
            },
            unit_amount: data.amount * 100, // Convert to paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/appointments?payment=success&appointment=${data.appointmentId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/appointments?payment=cancelled`,
      customer_email: data.userEmail,
      metadata: {
        appointmentId: data.appointmentId,
      },
    })

    return session
  } catch (error) {
    console.error("[v0] Stripe error:", error)
    throw error
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return session
  } catch (error) {
    console.error("[v0] Stripe error:", error)
    throw error
  }
}
