// Server-side storage using Upstash Redis for persistence
// Falls back to in-memory storage if Redis is not configured

import { Redis } from "@upstash/redis";
import crypto from "crypto";

// Initialize Redis client if credentials are available
let redis: Redis | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
} catch (error) {
  console.error("Failed to initialize Redis:", error);
}

// Admin emails - these users are automatically granted admin role
const ADMIN_EMAILS = [
  "varunagarwl3169@gmail.com",
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
const USERS_KEY = "angi:users";
const PAYMENTS_KEY = "angi:payments";

// In-memory fallback (for development without Redis)
let inMemoryUsers: StoredUser[] = [];
let inMemoryPayments: Payment[] = [];

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
  if (redis) {
    try {
      const data = await redis.get<StoredUser[]>(USERS_KEY);
      return data || [];
    } catch (error) {
      console.error("Redis getUsers error:", error);
      return inMemoryUsers;
    }
  }
  return inMemoryUsers;
}

// Save all users
async function saveUsers(users: StoredUser[]): Promise<void> {
  if (redis) {
    try {
      await redis.set(USERS_KEY, users);
    } catch (error) {
      console.error("Redis saveUsers error:", error);
      inMemoryUsers = users;
    }
  } else {
    inMemoryUsers = users;
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<StoredUser | null> {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

// Get user by ID
export async function getUserById(id: string): Promise<StoredUser | null> {
  const users = await getUsers();
  return users.find((u) => u.id === id) || null;
}

// Create user
export async function createUser(
  email: string,
  password: string,
  name: string,
  phone: string,
  signupIp?: string,
  role: "user" | "admin" = "user"
): Promise<{ user: StoredUser | null; error: string | null }> {
  const users = await getUsers();

  // Check if user exists
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { user: null, error: "An account with this email already exists" };
  }

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

  // Auto-assign admin role for designated admin emails
  const isAdminEmail = ADMIN_EMAILS.some(
    (adminEmail) => adminEmail.toLowerCase() === email.toLowerCase()
  );
  const finalRole = isAdminEmail ? "admin" : role;

  const newUser: StoredUser = {
    id: generateId(),
    email: email.toLowerCase(),
    name: name || email.split("@")[0],
    phone: phone,
    passwordHash: hashPassword(password),
    role: finalRole,
    plan: "free",
    signupIp: signupIp,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  await saveUsers(users);

  console.log("User created:", newUser.email, "Total users:", users.length, "Using Redis:", !!redis);

  return { user: newUser, error: null };
}

// Verify user credentials
export async function verifyUser(
  email: string,
  password: string
): Promise<{ user: StoredUser | null; error: string | null }> {
  const users = await getUsers();
  console.log("Verifying user:", email, "Total users in DB:", users.length, "Using Redis:", !!redis);
  
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    console.log("User not found:", email);
    return { user: null, error: "No account found with this email" };
  }

  if (user.passwordHash !== hashPassword(password)) {
    return { user: null, error: "Incorrect password" };
  }

  // Auto-promote to admin if email is in admin list
  const isAdminEmail = ADMIN_EMAILS.some(
    (adminEmail) => adminEmail.toLowerCase() === email.toLowerCase()
  );
  if (isAdminEmail && user.role !== "admin") {
    const userIndex = users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex].role = "admin";
      users[userIndex].updatedAt = new Date().toISOString();
      await saveUsers(users);
      user.role = "admin";
    }
  }

  return { user, error: null };
}

// Update user plan
export async function updateUserPlan(
  userId: string,
  plan: "free" | "starter" | "pro" | "enterprise",
  currency?: "USD" | "INR"
): Promise<{ success: boolean; error: string | null }> {
  const users = await getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return { success: false, error: "User not found" };
  }

  users[userIndex].plan = plan;
  users[userIndex].updatedAt = new Date().toISOString();
  users[userIndex].paidAt = new Date().toISOString();
  if (currency) {
    users[userIndex].currency = currency;
  }

  await saveUsers(users);
  return { success: true, error: null };
}

// Update last login IP
export async function updateLastLoginIp(
  userId: string,
  ip: string
): Promise<void> {
  const users = await getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex !== -1) {
    users[userIndex].lastLoginIp = ip;
    users[userIndex].updatedAt = new Date().toISOString();
    await saveUsers(users);
  }
}

// Check if user is admin
export async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  return user?.role === "admin";
}

// Make user an admin
export async function makeUserAdmin(userId: string): Promise<{ success: boolean; error: string | null }> {
  const users = await getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return { success: false, error: "User not found" };
  }

  users[userIndex].role = "admin";
  users[userIndex].updatedAt = new Date().toISOString();
  await saveUsers(users);
  return { success: true, error: null };
}

// ==================== PAYMENTS ====================

// Get all payments
export async function getPayments(): Promise<Payment[]> {
  if (redis) {
    try {
      const data = await redis.get<Payment[]>(PAYMENTS_KEY);
      return data || [];
    } catch (error) {
      console.error("Redis getPayments error:", error);
      return inMemoryPayments;
    }
  }
  return inMemoryPayments;
}

// Save all payments
async function savePayments(payments: Payment[]): Promise<void> {
  if (redis) {
    try {
      await redis.set(PAYMENTS_KEY, payments);
    } catch (error) {
      console.error("Redis savePayments error:", error);
      inMemoryPayments = payments;
    }
  } else {
    inMemoryPayments = payments;
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
  const payments = await getPayments();

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

  payments.push(payment);
  await savePayments(payments);

  return payment;
}

// Complete payment
export async function completePayment(
  razorpayOrderId: string,
  razorpayPaymentId: string
): Promise<{ payment: Payment | null; error: string | null }> {
  const payments = await getPayments();
  const paymentIndex = payments.findIndex((p) => p.razorpayOrderId === razorpayOrderId);

  if (paymentIndex === -1) {
    return { payment: null, error: "Payment not found" };
  }

  payments[paymentIndex].status = "completed";
  payments[paymentIndex].razorpayPaymentId = razorpayPaymentId;
  payments[paymentIndex].completedAt = new Date().toISOString();

  await savePayments(payments);
  return { payment: payments[paymentIndex], error: null };
}

// Get payments by user
export async function getPaymentsByUser(userId: string): Promise<Payment[]> {
  const payments = await getPayments();
  return payments.filter((p) => p.userId === userId);
}

// Get payment by order ID
export async function getPaymentByOrderId(orderId: string): Promise<Payment | null> {
  const payments = await getPayments();
  return payments.find((p) => p.razorpayOrderId === orderId) || null;
}
