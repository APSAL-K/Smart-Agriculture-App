import { NextRequest, NextResponse } from "next/server"
import { createCheckoutSession } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      appointmentId,
      doctorName,
      amount,
      userEmail,
      appointmentDate,
    } = body

    if (!appointmentId || !doctorName || !amount || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate amount is a positive number
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      )
    }

    const session = await createCheckoutSession({
      appointmentId,
      doctorName,
      amount,
      userEmail,
      appointmentDate,
    })

    return NextResponse.json(
      {
        success: true,
        sessionId: session.id,
        url: session.url,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[v0] Checkout error:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create checkout session",
      },
      { status: 500 }
    )
  }
}
