import { NextRequest, NextResponse } from "next/server";
import { getPayments, getPaymentsByUser } from "@/lib/storage";

export const dynamic = 'force-dynamic';

// GET /api/payments - Get all payments or payments by user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
      const payments = await getPaymentsByUser(userId);
      return NextResponse.json({ payments, count: payments.length });
    }

    // Return all payments (for admin)
    const payments = await getPayments();
    return NextResponse.json({ payments, count: payments.length });
  } catch (error) {
    console.error("Get payments error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
