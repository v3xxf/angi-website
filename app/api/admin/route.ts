import { NextRequest, NextResponse } from "next/server";
import {
  getUsers,
  getPayments,
  getUserById,
  makeUserAdmin,
  removeAdmin,
  isUserAdmin,
  disableUser,
  enableUser,
  adminSetPlan,
  deleteUser,
  adminResetPassword,
} from "@/lib/storage";

export const dynamic = "force-dynamic";

const ADMIN_EMAILS = [
  "varunagarwl3169@gmail.com",
  "v1@gmail.com",
];

function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.some(
    (e) => e.toLowerCase() === email.toLowerCase()
  );
}

async function checkAdmin(request: NextRequest): Promise<{ authorized: boolean; userId?: string; email?: string }> {
  const userId = request.headers.get("x-user-id");
  const userEmail = request.headers.get("x-user-email");

  if (!userId && !userEmail) return { authorized: false };

  if (userEmail && isAdminEmail(userEmail)) {
    return { authorized: true, userId: userId || undefined, email: userEmail };
  }

  if (userId && (await isUserAdmin(userId))) {
    return { authorized: true, userId, email: userEmail || undefined };
  }

  return { authorized: false };
}

// GET /api/admin - Dashboard data
export async function GET(request: NextRequest) {
  try {
    const auth = await checkAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const users = await getUsers();
    const payments = await getPayments();

    const safeUsers = users.map(({ passwordHash: _pw, ...user }) => user);

    const stats = {
      totalUsers: safeUsers.length,
      paidUsers: safeUsers.filter((u) => u.plan !== "free").length,
      freeUsers: safeUsers.filter((u) => u.plan === "free").length,
      disabledUsers: safeUsers.filter((u) => u.disabled).length,
      adminUsers: safeUsers.filter((u) => u.role === "admin").length,
      totalPayments: payments.length,
      completedPayments: payments.filter((p) => p.status === "completed").length,
      pendingPayments: payments.filter((p) => p.status === "pending").length,
      totalRevenue: {
        USD: payments
          .filter((p) => p.status === "completed" && p.currency === "USD")
          .reduce((sum, p) => sum + p.amount, 0),
        INR: payments
          .filter((p) => p.status === "completed" && p.currency === "INR")
          .reduce((sum, p) => sum + p.amount, 0),
      },
      planBreakdown: {
        free: safeUsers.filter((u) => u.plan === "free").length,
        starter: safeUsers.filter((u) => u.plan === "starter").length,
        pro: safeUsers.filter((u) => u.plan === "pro").length,
        enterprise: safeUsers.filter((u) => u.plan === "enterprise").length,
      },
    };

    return NextResponse.json({ users: safeUsers, payments, stats });
  } catch (error) {
    console.error("Admin GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/admin - Admin actions
export async function POST(request: NextRequest) {
  try {
    const auth = await checkAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { action, targetUserId, plan, reason, newPassword } = body;

    if (!action) {
      return NextResponse.json({ error: "Missing action" }, { status: 400 });
    }

    switch (action) {
      case "makeAdmin": {
        if (!targetUserId) return NextResponse.json({ error: "Missing targetUserId" }, { status: 400 });
        const result = await makeUserAdmin(targetUserId);
        if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
        return NextResponse.json({ success: true, message: "User promoted to admin" });
      }

      case "removeAdmin": {
        if (!targetUserId) return NextResponse.json({ error: "Missing targetUserId" }, { status: 400 });
        const result = await removeAdmin(targetUserId);
        if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
        return NextResponse.json({ success: true, message: "Admin role removed" });
      }

      case "disableUser": {
        if (!targetUserId) return NextResponse.json({ error: "Missing targetUserId" }, { status: 400 });
        const result = await disableUser(targetUserId, reason);
        if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
        return NextResponse.json({ success: true, message: "User disabled" });
      }

      case "enableUser": {
        if (!targetUserId) return NextResponse.json({ error: "Missing targetUserId" }, { status: 400 });
        const result = await enableUser(targetUserId);
        if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
        return NextResponse.json({ success: true, message: "User enabled" });
      }

      case "changePlan": {
        if (!targetUserId || !plan) return NextResponse.json({ error: "Missing targetUserId or plan" }, { status: 400 });
        const validPlans = ["free", "starter", "pro", "enterprise"];
        if (!validPlans.includes(plan)) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        const result = await adminSetPlan(targetUserId, plan);
        if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
        return NextResponse.json({ success: true, message: `Plan changed to ${plan}` });
      }

      case "deleteUser": {
        if (!targetUserId) return NextResponse.json({ error: "Missing targetUserId" }, { status: 400 });
        const result = await deleteUser(targetUserId);
        if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
        return NextResponse.json({ success: true, message: "User deleted" });
      }

      case "resetPassword": {
        if (!targetUserId || !newPassword) return NextResponse.json({ error: "Missing targetUserId or newPassword" }, { status: 400 });
        const result = await adminResetPassword(targetUserId, newPassword);
        if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
        return NextResponse.json({ success: true, message: "Password reset" });
      }

      case "getUserDetails": {
        if (!targetUserId) return NextResponse.json({ error: "Missing targetUserId" }, { status: 400 });
        const user = await getUserById(targetUserId);
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
        const { passwordHash: _pw, ...safeUser } = user;
        const payments = await getPayments();
        const userPayments = payments.filter((p) => p.userId === targetUserId);
        return NextResponse.json({ user: safeUser, payments: userPayments });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Admin POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
