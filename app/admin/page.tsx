"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUser } from "@/lib/auth";
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
  disabled?: boolean;
  disabledReason?: string;
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
  disabledUsers: number;
  adminUsers: number;
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  totalRevenue: { USD: number; INR: number };
  planBreakdown: { free: number; starter: number; pro: number; enterprise: number };
}

type Tab = "overview" | "users" | "payments";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [actionLoading, setActionLoading] = useState("");
  const [toast, setToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmAction, setConfirmAction] = useState<{
    action: string;
    userId: string;
    userName: string;
    extra?: string;
  } | null>(null);
  const [resetPwModal, setResetPwModal] = useState<{ userId: string; name: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [authInfo, setAuthInfo] = useState<{ userId: string; email: string } | null>(null);

  const fetchAdminData = useCallback(async (userId: string, email: string) => {
    try {
      const response = await fetch("/api/admin", {
        headers: { "x-user-id": userId, "x-user-email": email },
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
  }, []);

  useEffect(() => {
    const user = getUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setAuthInfo({ userId: user.id, email: user.email });
    fetchAdminData(user.id, user.email);
  }, [router, fetchAdminData]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const doAction = async (action: string, targetUserId: string, extra?: Record<string, string>) => {
    if (!authInfo) return;
    setActionLoading(targetUserId + action);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": authInfo.userId,
          "x-user-email": authInfo.email,
        },
        body: JSON.stringify({ action, targetUserId, ...extra }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "Done!");
        await fetchAdminData(authInfo.userId, authInfo.email);
        // Update selectedUser if it was the one acted upon
        if (selectedUser?.id === targetUserId) {
          const updated = users.find((u) => u.id === targetUserId);
          if (updated) setSelectedUser(updated);
          else setSelectedUser(null);
        }
      } else {
        showToast("Error: " + (data.error || "Failed"));
      }
    } catch {
      showToast("Error: Network failure");
    }
    setActionLoading("");
    setConfirmAction(null);
  };

  const formatDate = (d: string) => new Date(d).toLocaleString();
  const formatCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount / 100);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery)
  );

  const planColors: Record<string, string> = {
    free: "bg-gray-500/20 text-gray-400",
    starter: "bg-blue-500/20 text-blue-400",
    pro: "bg-purple-500/20 text-purple-400",
    enterprise: "bg-pink-500/20 text-pink-400",
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
          <Link href="/dashboard" className="text-hud-cyan hover:underline">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-4 right-4 z-[100] bg-hud-cyan/20 border border-hud-cyan/50 text-hud-cyan px-6 py-3 rounded-lg backdrop-blur-sm"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

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
            <span className="text-xs text-foreground-secondary hidden md:block">{authInfo?.email}</span>
            <Link href="/dashboard" className="text-sm text-foreground-secondary hover:text-white transition">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
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
              {tab === "overview" ? "Overview" : tab === "users" ? `Users (${users.length})` : `Payments (${payments.length})`}
            </button>
          ))}
        </div>

        {/* ==================== OVERVIEW ==================== */}
        {activeTab === "overview" && stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Total Users", value: stats.totalUsers, color: "text-hud-cyan" },
                { label: "Paid Users", value: stats.paidUsers, color: "text-green-400" },
                { label: "Free Users", value: stats.freeUsers, color: "text-yellow-400" },
                { label: "Disabled", value: stats.disabledUsers, color: "text-red-400" },
                { label: "Admins", value: stats.adminUsers, color: "text-purple-400" },
                { label: "Payments", value: stats.completedPayments, color: "text-blue-400" },
              ].map((s) => (
                <div key={s.label} className="hud-panel p-4">
                  <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-foreground-secondary text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Revenue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="hud-panel p-6">
                <h3 className="text-sm text-foreground-secondary mb-2">INR Revenue</h3>
                <div className="text-3xl font-bold text-green-400">{formatCurrency(stats.totalRevenue.INR, "INR")}</div>
              </div>
              <div className="hud-panel p-6">
                <h3 className="text-sm text-foreground-secondary mb-2">USD Revenue</h3>
                <div className="text-3xl font-bold text-blue-400">{formatCurrency(stats.totalRevenue.USD, "USD")}</div>
              </div>
            </div>

            {/* Plan Breakdown */}
            <div className="hud-panel p-6">
              <h3 className="text-lg font-bold mb-4">Plan Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(["free", "starter", "pro", "enterprise"] as const).map((p) => (
                  <div key={p} className="bg-background/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">{stats.planBreakdown[p]}</div>
                    <div className="text-foreground-secondary text-sm capitalize">{p}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Users */}
            <div className="hud-panel p-6">
              <h3 className="text-lg font-bold mb-4">Recent Signups</h3>
              <div className="space-y-3">
                {users.slice(-5).reverse().map((u) => (
                  <div key={u.id} className="flex items-center justify-between bg-background/50 rounded-lg p-3">
                    <div>
                      <span className="font-medium">{u.name}</span>
                      <span className="text-foreground-secondary text-sm ml-2">{u.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs ${planColors[u.plan]}`}>{u.plan.toUpperCase()}</span>
                      <span className="text-foreground-secondary text-xs">{new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================== USERS ==================== */}
        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Search */}
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-background-secondary border border-hud-blue/30 rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-hud-cyan/50"
              />
              <span className="text-foreground-secondary text-sm">{filteredUsers.length} users</span>
            </div>

            {/* User Cards */}
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`hud-panel p-4 transition-all ${user.disabled ? "opacity-60 border-red-500/30" : ""}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-lg">{user.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${planColors[user.plan]}`}>{user.plan.toUpperCase()}</span>
                        {user.role === "admin" && (
                          <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400">ADMIN</span>
                        )}
                        {user.disabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-red-600/30 text-red-300">DISABLED</span>
                        )}
                      </div>
                      <div className="text-foreground-secondary text-sm mt-1">{user.email}</div>
                      <div className="flex gap-4 text-xs text-foreground-secondary mt-1">
                        <span>Phone: {user.phone || "N/A"}</span>
                        <span>IP: {user.signupIp || "N/A"}</span>
                        <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-hud-cyan/10 text-hud-cyan border border-hud-cyan/30 hover:bg-hud-cyan/20 transition"
                      >
                        Details
                      </button>

                      {/* Plan dropdown */}
                      <select
                        value={user.plan}
                        onChange={(e) =>
                          setConfirmAction({
                            action: "changePlan",
                            userId: user.id,
                            userName: user.name,
                            extra: e.target.value,
                          })
                        }
                        className="px-3 py-1.5 text-xs rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20 transition cursor-pointer appearance-none"
                      >
                        <option value="free">Free</option>
                        <option value="starter">Starter</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>

                      {/* Toggle admin */}
                      {user.role === "admin" ? (
                        <button
                          onClick={() =>
                            setConfirmAction({ action: "removeAdmin", userId: user.id, userName: user.name })
                          }
                          disabled={actionLoading === user.id + "removeAdmin"}
                          className="px-3 py-1.5 text-xs rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20 transition"
                        >
                          Remove Admin
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            setConfirmAction({ action: "makeAdmin", userId: user.id, userName: user.name })
                          }
                          disabled={actionLoading === user.id + "makeAdmin"}
                          className="px-3 py-1.5 text-xs rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20 transition"
                        >
                          Make Admin
                        </button>
                      )}

                      {/* Toggle disable */}
                      {user.disabled ? (
                        <button
                          onClick={() => doAction("enableUser", user.id)}
                          disabled={actionLoading === user.id + "enableUser"}
                          className="px-3 py-1.5 text-xs rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition"
                        >
                          Enable
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            setConfirmAction({ action: "disableUser", userId: user.id, userName: user.name })
                          }
                          className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition"
                        >
                          Disable
                        </button>
                      )}

                      {/* Reset password */}
                      <button
                        onClick={() => setResetPwModal({ userId: user.id, name: user.name })}
                        className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition"
                      >
                        Reset PW
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          setConfirmAction({ action: "deleteUser", userId: user.id, userName: user.name })
                        }
                        className="px-3 py-1.5 text-xs rounded-lg bg-red-600/10 text-red-500 border border-red-600/30 hover:bg-red-600/20 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center text-foreground-secondary py-12">No users found</div>
              )}
            </div>
          </motion.div>
        )}

        {/* ==================== PAYMENTS ==================== */}
        {activeTab === "payments" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="hud-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background-secondary">
                    <tr>
                      <th className="text-left p-4 text-foreground-secondary font-medium text-sm">Order ID</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium text-sm">Email</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium text-sm">Plan</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium text-sm">Amount</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium text-sm">Status</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium text-sm">Payment ID</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium text-sm">Created</th>
                      <th className="text-left p-4 text-foreground-secondary font-medium text-sm">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-t border-hud-blue/20 hover:bg-hud-blue/5 transition">
                        <td className="p-4 font-mono text-xs">{p.razorpayOrderId.substring(0, 20)}...</td>
                        <td className="p-4 text-sm">{p.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-xs ${planColors[p.plan] || "bg-gray-500/20 text-gray-400"}`}>
                            {p.plan.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 font-medium text-sm">{formatCurrency(p.amount, p.currency)}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              p.status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : p.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-xs text-foreground-secondary">
                          {p.razorpayPaymentId ? p.razorpayPaymentId.substring(0, 20) + "..." : "-"}
                        </td>
                        <td className="p-4 text-foreground-secondary text-xs">{formatDate(p.createdAt)}</td>
                        <td className="p-4 text-foreground-secondary text-xs">{p.completedAt ? formatDate(p.completedAt) : "-"}</td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-foreground-secondary">No payments yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================== USER DETAILS MODAL ==================== */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedUser(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="hud-panel p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                    <p className="text-foreground-secondary text-sm">{selectedUser.email}</p>
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="text-foreground-secondary hover:text-white text-xl">✕</button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: "Phone", value: selectedUser.phone || "N/A" },
                    { label: "Role", value: selectedUser.role.toUpperCase() },
                    { label: "Plan", value: selectedUser.plan.toUpperCase() },
                    { label: "Currency", value: selectedUser.currency || "N/A" },
                    { label: "Signup IP", value: selectedUser.signupIp || "N/A" },
                    { label: "Last Login IP", value: selectedUser.lastLoginIp || "N/A" },
                    { label: "Status", value: selectedUser.disabled ? "DISABLED" : "ACTIVE" },
                    { label: "Disabled Reason", value: selectedUser.disabledReason || "N/A" },
                    { label: "Created", value: formatDate(selectedUser.createdAt) },
                    { label: "Updated", value: formatDate(selectedUser.updatedAt) },
                    { label: "Paid At", value: selectedUser.paidAt ? formatDate(selectedUser.paidAt) : "Never" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="text-foreground-secondary text-xs">{item.label}</div>
                      <div className="font-medium mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-hud-blue/20">
                  <div className="text-foreground-secondary text-xs">User ID</div>
                  <div className="font-mono text-xs break-all mt-0.5">{selectedUser.id}</div>
                </div>

                {/* Quick Actions in modal */}
                <div className="mt-6 pt-4 border-t border-hud-blue/20 flex flex-wrap gap-2">
                  <select
                    value={selectedUser.plan}
                    onChange={(e) => {
                      doAction("changePlan", selectedUser.id, { plan: e.target.value });
                    }}
                    className="px-3 py-1.5 text-xs rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30 cursor-pointer"
                  >
                    <option value="free">Free</option>
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                  {selectedUser.role !== "admin" ? (
                    <button onClick={() => doAction("makeAdmin", selectedUser.id)} className="px-3 py-1.5 text-xs rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20">
                      Make Admin
                    </button>
                  ) : (
                    <button onClick={() => doAction("removeAdmin", selectedUser.id)} className="px-3 py-1.5 text-xs rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500/20">
                      Remove Admin
                    </button>
                  )}
                  {selectedUser.disabled ? (
                    <button onClick={() => doAction("enableUser", selectedUser.id)} className="px-3 py-1.5 text-xs rounded-lg bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20">
                      Enable User
                    </button>
                  ) : (
                    <button onClick={() => doAction("disableUser", selectedUser.id, { reason: "Disabled by admin" })} className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20">
                      Disable User
                    </button>
                  )}
                  <button
                    onClick={() => { setSelectedUser(null); setResetPwModal({ userId: selectedUser.id, name: selectedUser.name }); }}
                    className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20"
                  >
                    Reset Password
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== CONFIRM MODAL ==================== */}
        <AnimatePresence>
          {confirmAction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
              onClick={() => setConfirmAction(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="hud-panel p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-2">Confirm Action</h3>
                <p className="text-foreground-secondary mb-6">
                  {confirmAction.action === "deleteUser" && `Are you sure you want to DELETE "${confirmAction.userName}"? This cannot be undone.`}
                  {confirmAction.action === "disableUser" && `Disable "${confirmAction.userName}"? They won't be able to log in.`}
                  {confirmAction.action === "makeAdmin" && `Grant admin access to "${confirmAction.userName}"?`}
                  {confirmAction.action === "removeAdmin" && `Remove admin access from "${confirmAction.userName}"?`}
                  {confirmAction.action === "changePlan" && `Change "${confirmAction.userName}" plan to ${confirmAction.extra?.toUpperCase()}?`}
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="px-4 py-2 text-sm rounded-lg bg-background-secondary text-foreground-secondary hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      let extra: Record<string, string> | undefined;
                      if (confirmAction.action === "changePlan") extra = { plan: confirmAction.extra! };
                      else if (confirmAction.action === "disableUser") extra = { reason: "Disabled by admin" };
                      doAction(confirmAction.action, confirmAction.userId, extra);
                    }}
                    disabled={!!actionLoading}
                    className={`px-4 py-2 text-sm rounded-lg font-medium transition ${
                      confirmAction.action === "deleteUser"
                        ? "bg-red-600 hover:bg-red-500 text-white"
                        : "bg-hud-cyan/20 text-hud-cyan border border-hud-cyan/50 hover:bg-hud-cyan/30"
                    }`}
                  >
                    {actionLoading ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================== RESET PASSWORD MODAL ==================== */}
        <AnimatePresence>
          {resetPwModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
              onClick={() => { setResetPwModal(null); setNewPassword(""); }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="hud-panel p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-2">Reset Password</h3>
                <p className="text-foreground-secondary mb-4 text-sm">
                  Set a new password for {resetPwModal.name}
                </p>
                <input
                  type="text"
                  placeholder="New password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-background-secondary border border-hud-blue/30 rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-hud-cyan/50 mb-4"
                />
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => { setResetPwModal(null); setNewPassword(""); }}
                    className="px-4 py-2 text-sm rounded-lg bg-background-secondary text-foreground-secondary hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (newPassword.length < 6) { showToast("Password must be 6+ chars"); return; }
                      doAction("resetPassword", resetPwModal.userId, { newPassword });
                      setResetPwModal(null);
                      setNewPassword("");
                    }}
                    disabled={!!actionLoading}
                    className="px-4 py-2 text-sm rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/50 hover:bg-blue-500/30 transition font-medium"
                  >
                    {actionLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
