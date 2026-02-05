import { NextRequest, NextResponse } from "next/server";
import { getUserById, updateUserPlan } from "@/lib/storage";

// GET /api/users/[id] - Get user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserById(params.id);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user without password hash
    const { passwordHash, ...safeUser } = user;
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PATCH /api/users/[id] - Update user plan
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { plan, currency } = await request.json();
    
    if (!plan || !["free", "starter", "pro", "enterprise"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const result = await updateUserPlan(params.id, plan, currency);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    // Get updated user
    const user = await getUserById(params.id);
    if (user) {
      const { passwordHash, ...safeUser } = user;
      return NextResponse.json({ user: safeUser });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
