"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getUser, isAdmin } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserData {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: "user" | "admin";
  plan: "free" | "starter" | "pro" | "enterprise";
  currency?: "USD" | "INR";
  signupIp?: string;
  lastLoginIp?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

interface PaymentData {
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

interface Stats {
  totalUsers: number;
  paidUsers: number;
  freeUsers: number;
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  totalRevenue: {
    USD: number;
    INR: number;
  };
  planBreakdown: {
    starter: number;
    pro: number;
    enterprise: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "payments">("overview");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [_isFirstAdmin, setIsFirstAdmin] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Check if this is the first user (allow them to become admin)
    if (!isAdmin()) {
      checkFirstAdmin(user.id);
    } else {
      fetchAdminData(user.id);
    }
  }, [router]);

  const checkFirstAdmin = async (userId: string) => {
    try {
      // Try to make first admin
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ action: "makeFirstAdmin", targetUserId: userId }),
      });

      if (response.ok) {
        setIsFirstAdmin(true);
        // Refresh page to load admin data
        window.location.reload();
      } else {
        setError("Access denied. Admin privileges required.");
        setLoading(false);
      }
    } catch {
      setError("Failed to verify admin status");
      setLoading(false);
    }
  };

  const fetchAdminData = async (userId: string) => {
    try {
      const response = await fetch("/api/admin", {
        headers: {
          "x-user-id": userId,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Access denied");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setUsers(data.users);
      setPayments(data.payments);
      setStats(data.stats);
      setLoading(false);
    } catch {
      setError("Failed to load admin data");
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-hud-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground-secondary">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h1>
          <p className="text-foreground-secondary mb-4">{error}</p>
          <Link href="/dashboard" className="text-hud-cyan hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-hud-blue/30 bg-background-secondary/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground leading-tight">Admin Panel</span>
                <span className="text-[9px] text-red-400/70 tracking-wider">ZENGUARD HEADQUARTERS</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-foreground-secondary hover:text-white transition">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {(["overview", "users", "payments"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? "bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/50"
                  : "bg-background-secondary text-foreground-secondary hover:text-white border border-transparent"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="hud-panel p-6">
                <div className="text-4xl font-bold text-hud-cyan">{stats.totalUsers}</div>
                <div className="text-foreground-secondary text-sm">Total Users</div>
              </div>
              <div className="hud-panel p-6">
                <div className="text-4xl font-bold text-green-400">{stats.paidUsers}</div>
                <div className="text-foreground-secondary text-sm">Paid Users</div>
              </div>
              <div className="hud-panel p-6">
                <div className="text-4xl font-bold text-yellow-400">{stats.freeUsers}</div>
                <div className="text-foreground-secondary text-sm">Free Users</div>
              </div>
              <div className="hud-panel p-6">
                <div className="text-4xl font-bold text-purple-400">{stats.completedPayments}</div>
                <div className="text-foreground-secondary text-sm">Completed Payments</div>
              </div>
            </div>

            {/* Revenue */}
            <div className="hud-panel p-6">
              <h2 className="text-xl font-bold mb-4">Total Revenue</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-400">
                    {formatCurrency(stats.totalRevenue.USD, "USD")}
                  </div>
                  <div className="text-foreground-secondary text-sm">USD Revenue</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4">
                  <div className="text-3xl font-bold text-yellow-400">
                    {formatCurrency(stats.totalRevenue.INR, "INR")}
                  </div>
                  <div className="text-foreground-secondary text-sm">INR Revenue</div>
                </div>
              </div>
            </div>

            {/* Plan Breakdown */}
            <div className="hud-panel p-6">
              <h2 className="text-xl font-bold mb-4">Plan Distribution</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{stats.planBreakdown.starter}</div>
                  <div className="text-foreground-secondary text-sm">Starter</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{stats.planBreakdown.pro}</div>
                  <div className="text-foreground-secondary text-sm">Pro</div>
                </div>
                <div className="bg-background/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-pink-400">{stats.planBreakdown.enterprise}</div>
                  <div className="text-foreground-secondary text-sm">Enterprise</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="hud-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background-secondary">
                    <tr>
                      <th className="text-left p-4 text-foreground-secondary font-medium">User</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium">Phone</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium">Plan</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium">Role</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium">Signup IP</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium">Last Login IP</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium">Created</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-t border-hud-blue/20 hover:bg-hud-blue/5 transition"
                      >
                        <td className="p-4">
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-foreground-secondary">{user.email}</div>
                        </td>
                        <td className="p-4 text-foreground-secondary">{user.phone || "N/A"}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              user.plan === "free"
                                ? "bg-gray-500/20 text-gray-400"
                                : user.plan === "starter"
                                ? "bg-blue-500/20 text-blue-400"
                                : user.plan === "pro"
                                ? "bg-purple-500/20 text-purple-400"
                                : "bg-pink-500/20 text-pink-400"
                            }`}
                          >
                            {user.plan.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-foreground-secondary text-sm font-mono">
                          {user.signupIp || "N/A"}
                        </td>
                        <td className="p-4 text-foreground-secondary text-sm font-mono">
                          {user.lastLoginIp || "N/A"}
                        </td>
                        <td className="p-4 text-foreground-secondary text-sm">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="text-hud-cyan hover:text-white text-sm transition"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="hud-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background-secondary">
                    <tr>
                      <th className="text-left p-4 text-foreground-secondary font-medium">Order ID</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium">Email</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium">Plan</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium">Amount</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium">Status</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium">Created</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-t border-hud-blue/20 hover:bg-hud-blue/5 transition"
                      >
                        <td className="p-4 font-mono text-sm">{payment.razorpayOrderId}</td>
                        <td className="p-4 text-foreground-secondary">{payment.email}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
                            {payment.plan.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 font-medium">
                          {formatCurrency(payment.amount, payment.currency)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              payment.status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : payment.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {payment.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-foreground-secondary text-sm">
                          {formatDate(payment.createdAt)}
                        </td>
                        <td className="p-4 text-foreground-secondary text-sm">
                          {payment.completedAt ? formatDate(payment.completedAt) : "-"}
                        </td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-foreground-secondary">
                          No payments yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="hud-panel p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-foreground-secondary hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-foreground-secondary text-sm">Name</label>
                    <div className="font-medium">{selectedUser.name}</div>
                  </div>
                  <div>
                    <label className="text-foreground-secondary text-sm">Email</label>
                    <div className="font-medium">{selectedUser.email}</div>
                  </div>
                  <div>
                    <label className="text-foreground-secondary text-sm">Phone</label>
                    <div className="font-medium">{selectedUser.phone || "N/A"}</div>
                  </div>
                  <div>
                    <label className="text-foreground-secondary text-sm">Role</label>
                    <div className="font-medium capitalize">{selectedUser.role}</div>
                  </div>
                  <div>
                    <label className="text-foreground-secondary text-sm">Plan</label>
                    <div className="font-medium capitalize">{selectedUser.plan}</div>
                  </div>
                  <div>
                    <label className="text-foreground-secondary text-sm">Currency</label>
                    <div className="font-medium">{selectedUser.currency || "N/A"}</div>
                  </div>
                  <div>
                    <label className="text-foreground-secondary text-sm">Signup IP</label>
                    <div className="font-mono text-sm">{selectedUser.signupIp || "N/A"}</div>
                  </div>
                  <div>
                    <label className="text-foreground-secondary text-sm">Last Login IP</label>
                    <div className="font-mono text-sm">{selectedUser.lastLoginIp || "N/A"}</div>
                  </div>
                  <div>
                    <label className="text-foreground-secondary text-sm">Created At</label>
                    <div className="text-sm">{formatDate(selectedUser.createdAt)}</div>
                  </div>
                  <div>
                    <label className="text-foreground-secondary text-sm">Last Updated</label>
                    <div className="text-sm">{formatDate(selectedUser.updatedAt)}</div>
                  </div>
                  {selectedUser.paidAt && (
                    <div>
                      <label className="text-foreground-secondary text-sm">Paid At</label>
                      <div className="text-sm">{formatDate(selectedUser.paidAt)}</div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-hud-blue/20">
                  <label className="text-foreground-secondary text-sm">User ID</label>
                  <div className="font-mono text-xs text-foreground-secondary break-all">
                    {selectedUser.id}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
