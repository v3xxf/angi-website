import { NextRequest, NextResponse } from "next/server";
import { createUser, verifyUser, getUserByEmail, getUsers } from "@/lib/storage";

// POST /api/users - Create user or login
export async function POST(request: NextRequest) {
  try {
    const { action, email, password, name } = await request.json();

    if (action === "signup") {
      const result = await createUser(email, password, name);
      
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

      // Return user without password hash
      const { passwordHash: _p2, ...safeUser } = result.user!;
      return NextResponse.json({ user: safeUser });
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
