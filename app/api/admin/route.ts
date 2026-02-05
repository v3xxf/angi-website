import { NextRequest, NextResponse } from "next/server";
import { getUsers, getPayments, getUserById, makeUserAdmin, isUserAdmin } from "@/lib/storage";

export const dynamic = "force-dynamic";

// GET /api/admin - Get all users and payments (admin only)
export async function GET(request: NextRequest) {
  try {
    // Get user ID from header (set by client)
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - no user ID" }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = await isUserAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden - admin access required" }, { status: 403 });
    }

    // Get all data
    const users = await getUsers();
    const payments = await getPayments();

    // Return users without password hashes
    const safeUsers = users.map(({ passwordHash: _, ...user }) => user);

    // Calculate statistics
    const stats = {
      totalUsers: safeUsers.length,
      paidUsers: safeUsers.filter(u => u.plan !== "free").length,
      freeUsers: safeUsers.filter(u => u.plan === "free").length,
      totalPayments: payments.length,
      completedPayments: payments.filter(p => p.status === "completed").length,
      pendingPayments: payments.filter(p => p.status === "pending").length,
      totalRevenue: {
        USD: payments.filter(p => p.status === "completed" && p.currency === "USD")
          .reduce((sum, p) => sum + p.amount, 0),
        INR: payments.filter(p => p.status === "completed" && p.currency === "INR")
          .reduce((sum, p) => sum + p.amount, 0),
      },
      planBreakdown: {
        starter: safeUsers.filter(u => u.plan === "starter").length,
        pro: safeUsers.filter(u => u.plan === "pro").length,
        enterprise: safeUsers.filter(u => u.plan === "enterprise").length,
      },
    };

    return NextResponse.json({ 
      users: safeUsers, 
      payments, 
      stats,
    });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/admin - Admin actions
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - no user ID" }, { status: 401 });
    }

    const { action, targetUserId } = await request.json();

    // For making the first admin, allow if no admins exist
    if (action === "makeFirstAdmin") {
      const users = await getUsers();
      const existingAdmin = users.find(u => u.role === "admin");
      
      if (existingAdmin) {
        return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
      }

      const result = await makeUserAdmin(targetUserId);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ success: true, message: "User is now admin" });
    }

    // For other actions, require admin
    const isAdmin = await isUserAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden - admin access required" }, { status: 403 });
    }

    if (action === "makeAdmin") {
      const result = await makeUserAdmin(targetUserId);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: "User promoted to admin" });
    }

    if (action === "getUserDetails") {
      const user = await getUserById(targetUserId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      const { passwordHash: _, ...safeUser } = user;
      
      // Get user's payments
      const payments = await getPayments();
      const userPayments = payments.filter(p => p.userId === targetUserId);
      
      return NextResponse.json({ user: safeUser, payments: userPayments });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin action error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
