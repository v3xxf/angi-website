// Server-side storage using Vercel KV (Redis) for high-concurrency
import { kv } from "@vercel/kv";
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

// Redis keys
const USERS_KEY = "angi:users"; // Hash: id -> user JSON
const EMAILS_KEY = "angi:emails"; // Hash: email -> id
const PAYMENTS_KEY = "angi:payments"; // Hash: id -> payment JSON
const ORDERS_KEY = "angi:orders"; // Hash: orderId -> paymentId

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
    const usersHash = await kv.hgetall<Record<string, StoredUser>>(USERS_KEY);
    if (!usersHash) return [];
    return Object.values(usersHash);
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  try {
    const normalizedEmail = email.toLowerCase();
    const userId = await kv.hget<string>(EMAILS_KEY, normalizedEmail);
    if (!userId) return null;
    const user = await kv.hget<StoredUser>(USERS_KEY, userId);
    return user || null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<StoredUser | null> {
  try {
    const user = await kv.hget<StoredUser>(USERS_KEY, id);
    return user || null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
}

// Create user - ATOMIC
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

  try {
    // Check if email exists (atomic check)
    const existingUserId = await kv.hget<string>(EMAILS_KEY, normalizedEmail);
    if (existingUserId) {
      return { user: null, error: "An account with this email already exists" };
    }

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

    // Use pipeline for atomic multi-command (all or nothing)
    const pipeline = kv.pipeline();
    pipeline.hsetnx(EMAILS_KEY, normalizedEmail, newUser.id); // Only set if not exists
    pipeline.hset(USERS_KEY, { [newUser.id]: newUser });
    const results = await pipeline.exec();

    // Check if email was already taken (hsetnx returns 0 if key existed)
    if (results[0] === 0) {
      // Race condition - email was taken between check and set
      // Clean up the user we just added
      await kv.hdel(USERS_KEY, newUser.id);
      return { user: null, error: "An account with this email already exists" };
    }

    console.log("User created:", newUser.email, "ID:", newUser.id);
    return { user: newUser, error: null };
  } catch (error) {
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
      user.role = "admin";
      user.updatedAt = new Date().toISOString();
      await kv.hset(USERS_KEY, { [user.id]: user });
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
    const user = await getUserById(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    user.plan = plan;
    user.updatedAt = new Date().toISOString();
    user.paidAt = new Date().toISOString();
    if (currency) {
      user.currency = currency;
    }

    await kv.hset(USERS_KEY, { [user.id]: user });
    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating user plan:", error);
    return { success: false, error: "Failed to update plan" };
  }
}

// Update last login IP
export async function updateLastLoginIp(userId: string, ip: string): Promise<void> {
  try {
    const user = await getUserById(userId);
    if (user) {
      user.lastLoginIp = ip;
      user.updatedAt = new Date().toISOString();
      await kv.hset(USERS_KEY, { [user.id]: user });
    }
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
    const user = await getUserById(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    user.role = "admin";
    user.updatedAt = new Date().toISOString();
    await kv.hset(USERS_KEY, { [user.id]: user });
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
    const paymentsHash = await kv.hgetall<Record<string, Payment>>(PAYMENTS_KEY);
    if (!paymentsHash) return [];
    return Object.values(paymentsHash);
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

  const pipeline = kv.pipeline();
  pipeline.hset(PAYMENTS_KEY, { [payment.id]: payment });
  pipeline.hset(ORDERS_KEY, { [razorpayOrderId]: payment.id });
  await pipeline.exec();

  return payment;
}

// Complete payment
export async function completePayment(
  razorpayOrderId: string,
  razorpayPaymentId: string
): Promise<{ payment: Payment | null; error: string | null }> {
  try {
    const paymentId = await kv.hget<string>(ORDERS_KEY, razorpayOrderId);
    if (!paymentId) {
      return { payment: null, error: "Payment not found" };
    }

    const payment = await kv.hget<Payment>(PAYMENTS_KEY, paymentId);
    if (!payment) {
      return { payment: null, error: "Payment not found" };
    }

    payment.status = "completed";
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.completedAt = new Date().toISOString();

    await kv.hset(PAYMENTS_KEY, { [payment.id]: payment });
    return { payment, error: null };
  } catch (error) {
    console.error("Error completing payment:", error);
    return { payment: null, error: "Failed to complete payment" };
  }
}

// Get payments by user
export async function getPaymentsByUser(userId: string): Promise<Payment[]> {
  const payments = await getPayments();
  return payments.filter((p) => p.userId === userId);
}

// Get payment by order ID
export async function getPaymentByOrderId(orderId: string): Promise<Payment | null> {
  try {
    const paymentId = await kv.hget<string>(ORDERS_KEY, orderId);
    if (!paymentId) return null;
    const payment = await kv.hget<Payment>(PAYMENTS_KEY, paymentId);
    return payment || null;
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
    const user = await getUserById(userId);
    if (!user) return { success: false, error: "User not found" };

    user.disabled = true;
    user.disabledReason = reason || "Disabled by admin";
    user.updatedAt = new Date().toISOString();
    await kv.hset(USERS_KEY, { [user.id]: user });
    return { success: true, error: null };
  } catch (error) {
    console.error("Error disabling user:", error);
    return { success: false, error: "Failed to disable user" };
  }
}

// Enable a user
export async function enableUser(userId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getUserById(userId);
    if (!user) return { success: false, error: "User not found" };

    user.disabled = false;
    user.disabledReason = undefined;
    user.updatedAt = new Date().toISOString();
    await kv.hset(USERS_KEY, { [user.id]: user });
    return { success: true, error: null };
  } catch (error) {
    console.error("Error enabling user:", error);
    return { success: false, error: "Failed to enable user" };
  }
}

// Remove admin role
export async function removeAdmin(userId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getUserById(userId);
    if (!user) return { success: false, error: "User not found" };

    user.role = "user";
    user.updatedAt = new Date().toISOString();
    await kv.hset(USERS_KEY, { [user.id]: user });
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
    const user = await getUserById(userId);
    if (!user) return { success: false, error: "User not found" };

    user.plan = plan;
    user.updatedAt = new Date().toISOString();
    if (plan !== "free") {
      user.paidAt = new Date().toISOString();
    }
    await kv.hset(USERS_KEY, { [user.id]: user });
    return { success: true, error: null };
  } catch (error) {
    console.error("Error setting plan:", error);
    return { success: false, error: "Failed to update plan" };
  }
}

// Delete a user
export async function deleteUser(userId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getUserById(userId);
    if (!user) return { success: false, error: "User not found" };

    const pipeline = kv.pipeline();
    pipeline.hdel(USERS_KEY, userId);
    pipeline.hdel(EMAILS_KEY, user.email);
    await pipeline.exec();
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
    const user = await getUserById(userId);
    if (!user) return { success: false, error: "User not found" };

    user.passwordHash = hashPassword(newPassword);
    user.updatedAt = new Date().toISOString();
    await kv.hset(USERS_KEY, { [user.id]: user });
    return { success: true, error: null };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "Failed to reset password" };
  }
}
