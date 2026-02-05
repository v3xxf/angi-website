import { NextRequest, NextResponse } from "next/server";
import { createUser, verifyUser, getUserByEmail, getUsers, updateLastLoginIp } from "@/lib/storage";

// Helper to extract client IP from request
function getClientIp(request: NextRequest): string {
  // Check various headers for the real IP (when behind proxies like Vercel)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim();
  }
  
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  
  // Vercel-specific header
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) {
    return vercelIp.split(",")[0].trim();
  }
  
  // Fallback
  return "unknown";
}

// POST /api/users - Create user or login
export async function POST(request: NextRequest) {
  try {
    const { action, email, password, name, phone } = await request.json();
    const clientIp = getClientIp(request);

    if (action === "signup") {
      // Validate phone is provided
      if (!phone || phone.trim() === "") {
        return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
      }

      const result = await createUser(email, password, name, phone, clientIp);
      
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      // Return user without password hash
      const { passwordHash: _p1, ...safeUser } = result.user!;
      return NextResponse.json({ user: safeUser });
    }

    if (action === "login") {
      const result = await verifyUser(email, password);
      
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 401 });
      }

      // Update last login IP
      await updateLastLoginIp(result.user!.id, clientIp);

      // Return user without password hash
      const { passwordHash: _p2, ...safeUser } = result.user!;
      // Include the updated IP in the response
      return NextResponse.json({ user: { ...safeUser, lastLoginIp: clientIp } });
    }

    if (action === "check") {
      const user = await getUserByEmail(email);
      if (!user) {
        return NextResponse.json({ exists: false });
      }
      const { passwordHash: _p3, ...safeUser } = user;
      return NextResponse.json({ exists: true, user: safeUser });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET /api/users - Get all users (admin only - for debugging)
export async function GET() {
  try {
    const users = await getUsers();
    // Return users without password hashes
    const safeUsers = users.map(({ passwordHash: _, ...user }) => user);
    return NextResponse.json({ users: safeUsers, count: safeUsers.length });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
