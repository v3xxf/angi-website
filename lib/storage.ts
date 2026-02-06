// Server-side storage using MongoDB for high-concurrency
import { MongoClient, Db } from "mongodb";
import crypto from "crypto";

// Admin emails - these users are automatically granted admin role
const ADMIN_EMAILS = [
  "varunagarwl3169@gmail.com",
  "v1@gmail.com",
];

// Types
export interface StoredUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  passwordHash: string;
  role: "user" | "admin";
  plan: "free" | "starter" | "pro" | "enterprise";
  currency?: "USD" | "INR";
  signupIp?: string;
  lastLoginIp?: string;
  disabled?: boolean;
  disabledReason?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export interface Payment {
  id: string;
  userId: string;
  email: string;
  amount: number;
  currency: "USD" | "INR";
  plan: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
}

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "";
let _cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;
  
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  _cachedClient = client;
  cachedDb = client.db("angideck");
  
  // Create indexes for fast lookups
  await cachedDb.collection("users").createIndex({ email: 1 }, { unique: true });
  await cachedDb.collection("users").createIndex({ id: 1 }, { unique: true });
  await cachedDb.collection("payments").createIndex({ id: 1 }, { unique: true });
  await cachedDb.collection("payments").createIndex({ razorpayOrderId: 1 });
  
  return cachedDb;
}

// Hash password
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;
}

// ==================== USERS ====================

// Get all users
export async function getUsers(): Promise<StoredUser[]> {
  try {
    const db = await getDb();
    const users = await db.collection<StoredUser>("users").find({}).toArray();
    return users;
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  try {
    const db = await getDb();
    const user = await db.collection<StoredUser>("users").findOne({ 
      email: email.toLowerCase() 
    });
    return user;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<StoredUser | null> {
  try {
    const db = await getDb();
    const user = await db.collection<StoredUser>("users").findOne({ id });
    return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
}

// Create user - ATOMIC with unique index
export async function createUser(
  email: string,
  password: string,
  name: string,
  phone: string,
  signupIp?: string,
  role: "user" | "admin" = "user"
): Promise<{ user: StoredUser | null; error: string | null }> {
  // Validate email
  if (!email.includes("@")) {
    return { user: null, error: "Please enter a valid email address" };
  }

  // Validate password
  if (password.length < 6) {
    return { user: null, error: "Password must be at least 6 characters" };
  }

  // Validate phone (must be at least 10 digits)
  const phoneDigits = phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    return { user: null, error: "Please enter a valid phone number (at least 10 digits)" };
  }

  const normalizedEmail = email.toLowerCase();

  // Auto-assign admin role for designated admin emails
  const isAdminEmail = ADMIN_EMAILS.some(
    (adminEmail) => adminEmail.toLowerCase() === normalizedEmail
  );
  const finalRole = isAdminEmail ? "admin" : role;

  const newUser: StoredUser = {
    id: generateId(),
    email: normalizedEmail,
    name: name || email.split("@")[0],
    phone: phone,
    passwordHash: hashPassword(password),
    role: finalRole,
    plan: "free",
    signupIp: signupIp,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await getDb();
    await db.collection<StoredUser>("users").insertOne(newUser);
    console.log("User created:", newUser.email, "ID:", newUser.id);
    return { user: newUser, error: null };
  } catch (error: unknown) {
    // MongoDB duplicate key error
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      return { user: null, error: "An account with this email already exists" };
    }
    console.error("Error creating user:", error);
    return { user: null, error: "Failed to create account. Please try again." };
  }
}

// Verify user credentials
export async function verifyUser(
  email: string,
  password: string
): Promise<{ user: StoredUser | null; error: string | null }> {
  try {
    const user = await getUserByEmail(email);
    console.log("Verifying user:", email, "Found:", !!user);

    if (!user) {
      return { user: null, error: "No account found with this email" };
    }

    if (user.disabled) {
      return { user: null, error: "Your account has been disabled. Contact support." };
    }

    if (user.passwordHash !== hashPassword(password)) {
      return { user: null, error: "Incorrect password" };
    }

    // Auto-promote to admin if email is in admin list
    const isAdminEmail = ADMIN_EMAILS.some(
      (adminEmail) => adminEmail.toLowerCase() === email.toLowerCase()
    );
    if (isAdminEmail && user.role !== "admin") {
      const db = await getDb();
      await db.collection<StoredUser>("users").updateOne(
        { id: user.id },
        { $set: { role: "admin", updatedAt: new Date().toISOString() } }
      );
      user.role = "admin";
    }

    return { user, error: null };
  } catch (error) {
    console.error("Error verifying user:", error);
    return { user: null, error: "Login failed. Please try again." };
  }
}

// Update user plan
export async function updateUserPlan(
  userId: string,
  plan: "free" | "starter" | "pro" | "enterprise",
  currency?: "USD" | "INR"
): Promise<{ success: boolean; error: string | null }> {
  try {
    const db = await getDb();
    const updateData: Record<string, unknown> = {
      plan,
      updatedAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
    };
    if (currency) updateData.currency = currency;

    const result = await db.collection<StoredUser>("users").updateOne(
      { id: userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found" };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating user plan:", error);
    return { success: false, error: "Failed to update plan" };
  }
}

// Update last login IP
export async function updateLastLoginIp(userId: string, ip: string): Promise<void> {
  try {
    const db = await getDb();
    await db.collection<StoredUser>("users").updateOne(
      { id: userId },
      { $set: { lastLoginIp: ip, updatedAt: new Date().toISOString() } }
    );
  } catch (error) {
    console.error("Error updating last login IP:", error);
  }
}

// Check if user is admin
export async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  return user?.role === "admin";
}

// Make user an admin
export async function makeUserAdmin(userId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const db = await getDb();
    const result = await db.collection<StoredUser>("users").updateOne(
      { id: userId },
      { $set: { role: "admin", updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found" };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Error making user admin:", error);
    return { success: false, error: "Failed to update user" };
  }
}

// ==================== PAYMENTS ====================

// Get all payments
export async function getPayments(): Promise<Payment[]> {
  try {
    const db = await getDb();
    const payments = await db.collection<Payment>("payments").find({}).toArray();
    return payments;
  } catch (error) {
    console.error("Error getting payments:", error);
    return [];
  }
}

// Create payment record
export async function createPayment(
  userId: string,
  email: string,
  amount: number,
  currency: "USD" | "INR",
  plan: string,
  razorpayOrderId: string
): Promise<Payment> {
  const payment: Payment = {
    id: generateId(),
    userId,
    email,
    amount,
    currency,
    plan,
    razorpayOrderId,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const db = await getDb();
  await db.collection<Payment>("payments").insertOne(payment);
  return payment;
}

// Complete payment
export async function completePayment(
  razorpayOrderId: string,
  razorpayPaymentId: string
): Promise<{ payment: Payment | null; error: string | null }> {
  try {
    const db = await getDb();
    const result = await db.collection<Payment>("payments").findOneAndUpdate(
      { razorpayOrderId },
      { 
        $set: { 
          status: "completed", 
          razorpayPaymentId, 
          completedAt: new Date().toISOString() 
        } 
      },
      { returnDocument: "after" }
    );

    if (!result) {
      return { payment: null, error: "Payment not found" };
    }
    return { payment: result, error: null };
  } catch (error) {
    console.error("Error completing payment:", error);
    return { payment: null, error: "Failed to complete payment" };
  }
}

// Get payments by user
export async function getPaymentsByUser(userId: string): Promise<Payment[]> {
  try {
    const db = await getDb();
    const payments = await db.collection<Payment>("payments").find({ userId }).toArray();
    return payments;
  } catch (error) {
    console.error("Error getting payments by user:", error);
    return [];
  }
}

// Get payment by order ID
export async function getPaymentByOrderId(orderId: string): Promise<Payment | null> {
  try {
    const db = await getDb();
    const payment = await db.collection<Payment>("payments").findOne({ razorpayOrderId: orderId });
    return payment;
  } catch (error) {
    console.error("Error getting payment by order ID:", error);
    return null;
  }
}

// ==================== ADMIN ACTIONS ====================

// Disable a user
export async function disableUser(
  userId: string,
  reason?: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const db = await getDb();
    const result = await db.collection<StoredUser>("users").updateOne(
      { id: userId },
      { 
        $set: { 
          disabled: true, 
          disabledReason: reason || "Disabled by admin",
          updatedAt: new Date().toISOString() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found" };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Error disabling user:", error);
    return { success: false, error: "Failed to disable user" };
  }
}

// Enable a user
export async function enableUser(userId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const db = await getDb();
    const result = await db.collection<StoredUser>("users").updateOne(
      { id: userId },
      { 
        $set: { 
          disabled: false, 
          updatedAt: new Date().toISOString() 
        },
        $unset: { disabledReason: "" }
      }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found" };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Error enabling user:", error);
    return { success: false, error: "Failed to enable user" };
  }
}

// Remove admin role
export async function removeAdmin(userId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const db = await getDb();
    const result = await db.collection<StoredUser>("users").updateOne(
      { id: userId },
      { $set: { role: "user", updatedAt: new Date().toISOString() } }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found" };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Error removing admin:", error);
    return { success: false, error: "Failed to update user" };
  }
}

// Change user plan (admin override)
export async function adminSetPlan(
  userId: string,
  plan: "free" | "starter" | "pro" | "enterprise"
): Promise<{ success: boolean; error: string | null }> {
  try {
    const db = await getDb();
    const updateData: Record<string, unknown> = {
      plan,
      updatedAt: new Date().toISOString(),
    };
    if (plan !== "free") {
      updateData.paidAt = new Date().toISOString();
    }

    const result = await db.collection<StoredUser>("users").updateOne(
      { id: userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found" };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Error setting plan:", error);
    return { success: false, error: "Failed to update plan" };
  }
}

// Delete a user
export async function deleteUser(userId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const db = await getDb();
    const result = await db.collection<StoredUser>("users").deleteOne({ id: userId });

    if (result.deletedCount === 0) {
      return { success: false, error: "User not found" };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}

// Reset user password (admin)
export async function adminResetPassword(
  userId: string,
  newPassword: string
): Promise<{ success: boolean; error: string | null }> {
  if (newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }

  try {
    const db = await getDb();
    const result = await db.collection<StoredUser>("users").updateOne(
      { id: userId },
      { 
        $set: { 
          passwordHash: hashPassword(newPassword), 
          updatedAt: new Date().toISOString() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found" };
    }
    return { success: true, error: null };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Failed to reset password" };
  }
}
