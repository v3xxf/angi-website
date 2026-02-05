// Server-side JSON file storage for users and payments
// For production on Vercel, this uses the /tmp directory which is ephemeral
// Consider upgrading to Vercel KV or a database for persistent storage

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// Use /tmp for Vercel compatibility, local data folder for development
const DATA_DIR = process.env.NODE_ENV === "production" 
  ? "/tmp/angi-data" 
  : path.join(process.cwd(), "data");

const USERS_FILE = path.join(DATA_DIR, "users.json");
const PAYMENTS_FILE = path.join(DATA_DIR, "payments.json");

// Types
export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  currency?: "USD" | "INR";
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

// Ensure data directory exists
async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
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
  await ensureDataDir();
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save all users
async function saveUsers(users: StoredUser[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
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
  name: string
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

  const newUser: StoredUser = {
    id: generateId(),
    email: email.toLowerCase(),
    name: name || email.split("@")[0],
    passwordHash: hashPassword(password),
    plan: "free",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  await saveUsers(users);

  return { user: newUser, error: null };
}

// Verify user credentials
export async function verifyUser(
  email: string,
  password: string
): Promise<{ user: StoredUser | null; error: string | null }> {
  const user = await getUserByEmail(email);

  if (!user) {
    return { user: null, error: "No account found with this email" };
  }

  if (user.passwordHash !== hashPassword(password)) {
    return { user: null, error: "Incorrect password" };
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

// ==================== PAYMENTS ====================

// Get all payments
export async function getPayments(): Promise<Payment[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(PAYMENTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save all payments
async function savePayments(payments: Payment[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PAYMENTS_FILE, JSON.stringify(payments, null, 2));
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
