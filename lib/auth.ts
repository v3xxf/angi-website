// Client-side authentication with server-side storage
// Uses localStorage for session, server API for persistent storage

export interface User {
  id: string;
  email: string;
  name: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  currency?: "USD" | "INR";
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export interface AuthError {
  message: string;
}

const CURRENT_USER_KEY = "angi_current_user";

// Get the current user from localStorage
export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
}

// Set the current user in localStorage
function setUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Clear the current user from localStorage
function clearUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Sign up a new user
export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signup", email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { user: null, error: { message: data.error || "Signup failed" } };
    }

    setUser(data.user);
    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error: { message: "Network error. Please try again." } };
  }
}

// Sign in an existing user
export async function signIn(
  email: string,
  password: string
): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { user: null, error: { message: data.error || "Login failed" } };
    }

    setUser(data.user);
    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error: { message: "Network error. Please try again." } };
  }
}

// Sign out the current user
export async function signOut(): Promise<{ error: AuthError | null }> {
  clearUser();
  return { error: null };
}

// Get user profile (same as getUser for this implementation)
export function getUserProfile(): User | null {
  return getUser();
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getUser() !== null;
}

// Check if user has paid (not on free plan)
export function hasPaid(): boolean {
  const user = getUser();
  return user !== null && user.plan !== "free";
}

// Update user plan (called after successful payment)
export async function updateUserPlan(
  plan: "free" | "starter" | "pro" | "enterprise",
  currency?: "USD" | "INR"
): Promise<{ user: User | null; error: AuthError | null }> {
  const currentUser = getUser();
  if (!currentUser) {
    return { user: null, error: { message: "No user logged in" } };
  }

  try {
    const response = await fetch(`/api/users/${currentUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, currency }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { user: null, error: { message: data.error || "Update failed" } };
    }

    // Update local storage
    const updatedUser = { ...currentUser, plan, currency, paidAt: new Date().toISOString() };
    setUser(updatedUser);
    
    return { user: updatedUser, error: null };
  } catch (error) {
    return { user: null, error: { message: "Network error. Please try again." } };
  }
}

// Refresh user data from server
export async function refreshUser(): Promise<{ user: User | null; error: AuthError | null }> {
  const currentUser = getUser();
  if (!currentUser) {
    return { user: null, error: { message: "No user logged in" } };
  }

  try {
    const response = await fetch(`/api/users/${currentUser.id}`);
    const data = await response.json();

    if (!response.ok) {
      return { user: null, error: { message: data.error || "Failed to refresh user" } };
    }

    setUser(data.user);
    return { user: data.user, error: null };
  } catch (error) {
    return { user: null, error: { message: "Network error. Please try again." } };
  }
}
