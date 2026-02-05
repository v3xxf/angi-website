import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase credentials not configured");
    }
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

// For client-side usage - will throw if not configured
export const supabase = {
  auth: {
    signUp: async (...args: Parameters<SupabaseClient["auth"]["signUp"]>) => {
      return getSupabase().auth.signUp(...args);
    },
    signInWithPassword: async (...args: Parameters<SupabaseClient["auth"]["signInWithPassword"]>) => {
      return getSupabase().auth.signInWithPassword(...args);
    },
    signOut: async () => {
      return getSupabase().auth.signOut();
    },
    getUser: async () => {
      return getSupabase().auth.getUser();
    },
  },
  from: (table: string) => getSupabase().from(table),
};

// Types for our database
export interface User {
  id: string;
  email: string;
  name: string | null;
  plan: "free" | "starter" | "pro" | "enterprise";
  razorpay_customer_id: string | null;
  razorpay_subscription_id: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: string;
  status: "active" | "cancelled" | "expired";
  razorpay_payment_id: string | null;
  amount: number;
  currency: string;
  started_at: string;
  expires_at: string | null;
}

// Auth helpers
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) throw error;

  // Create user profile
  if (data.user) {
    await supabase.from("users").insert({
      id: data.user.id,
      email,
      name,
      plan: "free",
    });
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data as User;
}

export async function updateUserPlan(
  userId: string,
  plan: User["plan"],
  razorpayData?: { customerId: string; subscriptionId: string }
) {
  const updateData: Partial<User> = { plan };
  
  if (razorpayData) {
    updateData.razorpay_customer_id = razorpayData.customerId;
    updateData.razorpay_subscription_id = razorpayData.subscriptionId;
  }

  const { error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId);

  if (error) throw error;
}
