// Server-side storage using Vercel Blob for persistence
import { put, list, del } from "@vercel/blob";
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

// Blob paths
const USERS_BLOB = "angi-data/users.json";
const PAYMENTS_BLOB = "angi-data/payments.json";
const LOCK_BLOB = "angi-data/lock.json";

// Hash password
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;
}

// ==================== LOCKING MECHANISM ====================

interface LockData {
  lockedBy: string;
  lockedAt: number;
}

const LOCK_TIMEOUT = 10000; // 10 seconds max lock time
const LOCK_RETRY_DELAY = 100; // 100ms between retries
const MAX_RETRIES = 50; // 5 seconds max wait

async function acquireLock(lockId: string): Promise<boolean> {
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      // Check if lock exists and is still valid
      const blobs = await list({ prefix: LOCK_BLOB });
      if (blobs.blobs.length > 0) {
        const response = await fetch(blobs.blobs[0].url, { cache: "no-store" });
        if (response.ok) {
          const lock: LockData = await response.json();
          if (Date.now() - lock.lockedAt < LOCK_TIMEOUT) {
            // Lock is held by another process, wait and retry
            await new Promise(r => setTimeout(r, LOCK_RETRY_DELAY));
            continue;
          }
        }
      }
      
      // Try to acquire lock
      const lockData: LockData = { lockedBy: lockId, lockedAt: Date.now() };
      await put(LOCK_BLOB, JSON.stringify(lockData), {
        access: "public",
        addRandomSuffix: false,
      });
      
      // Verify we got the lock
      await new Promise(r => setTimeout(r, 50));
      const verifyBlobs = await list({ prefix: LOCK_BLOB });
      if (verifyBlobs.blobs.length > 0) {
        const verifyResponse = await fetch(verifyBlobs.blobs[0].url, { cache: "no-store" });
        if (verifyResponse.ok) {
          const verifyLock: LockData = await verifyResponse.json();
          if (verifyLock.lockedBy === lockId) {
            return true;
          }
        }
      }
      
      // Someone else got the lock, retry
      await new Promise(r => setTimeout(r, LOCK_RETRY_DELAY));
    } catch {
      await new Promise(r => setTimeout(r, LOCK_RETRY_DELAY));
    }
  }
  return false;
}

async function releaseLock(): Promise<void> {
  try {
    const blobs = await list({ prefix: LOCK_BLOB });
    for (const blob of blobs.blobs) {
      await del(blob.url);
    }
  } catch {
    // Ignore errors when releasing lock
  }
}

// ==================== BLOB HELPERS ====================

async function readBlob<T>(path: string): Promise<T | null> {
  try {
    const blobs = await list({ prefix: path });
    if (blobs.blobs.length === 0) {
      console.log(`Blob ${path} not found`);
      return null;
    }
    // Use the most recent blob if multiple exist
    const sortedBlobs = blobs.blobs.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    const response = await fetch(sortedBlobs[0].url, { cache: "no-store" });
    if (!response.ok) {
      console.error(`Failed to fetch blob ${path}: ${response.status}`);
      return null;
    }
    const data = await response.json();
    console.log(`Read blob ${path}: ${Array.isArray(data) ? data.length : 1} items`);
    return data;
  } catch (error) {
    console.error(`Error reading blob ${path}:`, error);
    return null;
  }
}

async function writeBlob<T>(path: string, data: T): Promise<void> {
  try {
    // Write the new data with addRandomSuffix: false to overwrite
    const result = await put(path, JSON.stringify(data), {
      access: "public",
      addRandomSuffix: false,
    });
    console.log(`Wrote blob ${path}: ${Array.isArray(data) ? (data as unknown[]).length : 1} items, url: ${result.url}`);
    
    // Clean up any duplicate blobs
    const blobs = await list({ prefix: path });
    if (blobs.blobs.length > 1) {
      const sortedBlobs = blobs.blobs.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      for (let i = 1; i < sortedBlobs.length; i++) {
        await del(sortedBlobs[i].url);
      }
    }
  } catch (error) {
    console.error(`Error writing blob ${path}:`, error);
    throw error;
  }
}

// Atomic read-modify-write operation with locking
async function atomicUpdate<T>(
  path: string,
  updater: (current: T | null) => T
): Promise<T> {
  const lockId = generateId();
  const acquired = await acquireLock(lockId);
  if (!acquired) {
    throw new Error("Could not acquire lock - system busy, please try again");
  }
  
  try {
    const current = await readBlob<T>(path);
    const updated = updater(current);
    await writeBlob(path, updated);
    return updated;
  } finally {
    await releaseLock();
  }
}

// ==================== USERS ====================

// Get all users
export async function getUsers(): Promise<StoredUser[]> {
  const users = await readBlob<StoredUser[]>(USERS_BLOB);
  return users || [];
}

// Save all users
async function saveUsers(users: StoredUser[]): Promise<void> {
  await writeBlob(USERS_BLOB, users);
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

// Create user (with atomic locking)
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

  // Auto-assign admin role for designated admin emails
  const isAdminEmail = ADMIN_EMAILS.some(
    (adminEmail) => adminEmail.toLowerCase() === email.toLowerCase()
  );
  const finalRole = isAdminEmail ? "admin" : role;

  let newUser: StoredUser | null = null;
  let errorMsg: string | null = null;

  try {
    await atomicUpdate<StoredUser[]>(USERS_BLOB, (currentUsers) => {
      const users = currentUsers || [];
      
      // Check if user exists (inside atomic block)
      if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        errorMsg = "An account with this email already exists";
        return users; // Return unchanged
      }

      newUser = {
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

      console.log("Creating user:", newUser.email, "Total users:", users.length + 1);
      return [...users, newUser];
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return { user: null, error: "System busy, please try again" };
  }

  if (errorMsg) {
    return { user: null, error: errorMsg };
  }

  return { user: newUser, error: null };
}

// Verify user credentials
export async function verifyUser(
  email: string,
  password: string
): Promise<{ user: StoredUser | null; error: string | null }> {
  const users = await getUsers();
  console.log("Verifying user:", email, "Total users in DB:", users.length);
  
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    console.log("User not found:", email);
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

// Update user plan (with atomic locking)
export async function updateUserPlan(
  userId: string,
  plan: "free" | "starter" | "pro" | "enterprise",
  currency?: "USD" | "INR"
): Promise<{ success: boolean; error: string | null }> {
  let found = false;
  try {
    await atomicUpdate<StoredUser[]>(USERS_BLOB, (currentUsers) => {
      const users = currentUsers || [];
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return users;
      }

      found = true;
      users[userIndex].plan = plan;
      users[userIndex].updatedAt = new Date().toISOString();
      users[userIndex].paidAt = new Date().toISOString();
      if (currency) {
        users[userIndex].currency = currency;
      }
      return users;
    });
  } catch (error) {
    console.error("Error updating user plan:", error);
    return { success: false, error: "System busy, please try again" };
  }
  
  if (!found) {
    return { success: false, error: "User not found" };
  }
  return { success: true, error: null };
}

// Update last login IP (with atomic locking)
export async function updateLastLoginIp(
  userId: string,
  ip: string
): Promise<void> {
  try {
    await atomicUpdate<StoredUser[]>(USERS_BLOB, (currentUsers) => {
      const users = currentUsers || [];
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex !== -1) {
        users[userIndex].lastLoginIp = ip;
        users[userIndex].updatedAt = new Date().toISOString();
      }
      return users;
    });
  } catch (error) {
    console.error("Error updating last login IP:", error);
  }
}

// Check if user is admin
export async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  return user?.role === "admin";
}

// Make user an admin (with atomic locking)
export async function makeUserAdmin(userId: string): Promise<{ success: boolean; error: string | null }> {
  let found = false;
  try {
    await atomicUpdate<StoredUser[]>(USERS_BLOB, (currentUsers) => {
      const users = currentUsers || [];
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return users;
      }

      found = true;
      users[userIndex].role = "admin";
      users[userIndex].updatedAt = new Date().toISOString();
      return users;
    });
  } catch (error) {
    console.error("Error making user admin:", error);
    return { success: false, error: "System busy, please try again" };
  }
  
  if (!found) {
    return { success: false, error: "User not found" };
  }
  return { success: true, error: null };
}

// ==================== PAYMENTS ====================

// Get all payments
export async function getPayments(): Promise<Payment[]> {
  const payments = await readBlob<Payment[]>(PAYMENTS_BLOB);
  return payments || [];
}

// Save all payments
async function savePayments(payments: Payment[]): Promise<void> {
  await writeBlob(PAYMENTS_BLOB, payments);
}

// Create payment record (with atomic locking)
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

  await atomicUpdate<Payment[]>(PAYMENTS_BLOB, (currentPayments) => {
    const payments = currentPayments || [];
    return [...payments, payment];
  });

  return payment;
}

// Complete payment (with atomic locking)
export async function completePayment(
  razorpayOrderId: string,
  razorpayPaymentId: string
): Promise<{ payment: Payment | null; error: string | null }> {
  let completedPayment: Payment | null = null;
  
  try {
    await atomicUpdate<Payment[]>(PAYMENTS_BLOB, (currentPayments) => {
      const payments = currentPayments || [];
      const paymentIndex = payments.findIndex((p) => p.razorpayOrderId === razorpayOrderId);

      if (paymentIndex === -1) {
        return payments;
      }

      payments[paymentIndex].status = "completed";
      payments[paymentIndex].razorpayPaymentId = razorpayPaymentId;
      payments[paymentIndex].completedAt = new Date().toISOString();
      completedPayment = payments[paymentIndex];
      return payments;
    });
  } catch (error) {
    console.error("Error completing payment:", error);
    return { payment: null, error: "System busy, please try again" };
  }

  if (!completedPayment) {
    return { payment: null, error: "Payment not found" };
  }
  return { payment: completedPayment, error: null };
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

// ==================== ADMIN ACTIONS (all with atomic locking) ====================

// Disable a user
export async function disableUser(
  userId: string,
  reason?: string
): Promise<{ success: boolean; error: string | null }> {
  let found = false;
  try {
    await atomicUpdate<StoredUser[]>(USERS_BLOB, (currentUsers) => {
      const users = currentUsers || [];
      const idx = users.findIndex((u) => u.id === userId);
      if (idx === -1) return users;
      found = true;
      users[idx].disabled = true;
      users[idx].disabledReason = reason || "Disabled by admin";
      users[idx].updatedAt = new Date().toISOString();
      return users;
    });
  } catch (error) {
    console.error("Error disabling user:", error);
    return { success: false, error: "System busy" };
  }
  return found ? { success: true, error: null } : { success: false, error: "User not found" };
}

// Enable a user
export async function enableUser(
  userId: string
): Promise<{ success: boolean; error: string | null }> {
  let found = false;
  try {
    await atomicUpdate<StoredUser[]>(USERS_BLOB, (currentUsers) => {
      const users = currentUsers || [];
      const idx = users.findIndex((u) => u.id === userId);
      if (idx === -1) return users;
      found = true;
      users[idx].disabled = false;
      users[idx].disabledReason = undefined;
      users[idx].updatedAt = new Date().toISOString();
      return users;
    });
  } catch (error) {
    console.error("Error enabling user:", error);
    return { success: false, error: "System busy" };
  }
  return found ? { success: true, error: null } : { success: false, error: "User not found" };
}

// Remove admin role
export async function removeAdmin(
  userId: string
): Promise<{ success: boolean; error: string | null }> {
  let found = false;
  try {
    await atomicUpdate<StoredUser[]>(USERS_BLOB, (currentUsers) => {
      const users = currentUsers || [];
      const idx = users.findIndex((u) => u.id === userId);
      if (idx === -1) return users;
      found = true;
      users[idx].role = "user";
      users[idx].updatedAt = new Date().toISOString();
      return users;
    });
  } catch (error) {
    console.error("Error removing admin:", error);
    return { success: false, error: "System busy" };
  }
  return found ? { success: true, error: null } : { success: false, error: "User not found" };
}

// Change user plan (admin override)
export async function adminSetPlan(
  userId: string,
  plan: "free" | "starter" | "pro" | "enterprise"
): Promise<{ success: boolean; error: string | null }> {
  let found = false;
  try {
    await atomicUpdate<StoredUser[]>(USERS_BLOB, (currentUsers) => {
      const users = currentUsers || [];
      const idx = users.findIndex((u) => u.id === userId);
      if (idx === -1) return users;
      found = true;
      users[idx].plan = plan;
      users[idx].updatedAt = new Date().toISOString();
      if (plan !== "free") {
        users[idx].paidAt = new Date().toISOString();
      }
      return users;
    });
  } catch (error) {
    console.error("Error setting plan:", error);
    return { success: false, error: "System busy" };
  }
  return found ? { success: true, error: null } : { success: false, error: "User not found" };
}

// Delete a user
export async function deleteUser(
  userId: string
): Promise<{ success: boolean; error: string | null }> {
  let found = false;
  try {
    await atomicUpdate<StoredUser[]>(USERS_BLOB, (currentUsers) => {
      const users = currentUsers || [];
      const idx = users.findIndex((u) => u.id === userId);
      if (idx === -1) return users;
      found = true;
      users.splice(idx, 1);
      return users;
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "System busy" };
  }
  return found ? { success: true, error: null } : { success: false, error: "User not found" };
}

// Reset user password (admin)
export async function adminResetPassword(
  userId: string,
  newPassword: string
): Promise<{ success: boolean; error: string | null }> {
  if (newPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters" };
  }
  let found = false;
  try {
    await atomicUpdate<StoredUser[]>(USERS_BLOB, (currentUsers) => {
      const users = currentUsers || [];
      const idx = users.findIndex((u) => u.id === userId);
      if (idx === -1) return users;
      found = true;
      users[idx].passwordHash = hashPassword(newPassword);
      users[idx].updatedAt = new Date().toISOString();
      return users;
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return { success: false, error: "System busy" };
  }
  return found ? { success: true, error: null } : { success: false, error: "User not found" };
}
