// Agent data
export const agents = [
  {
    id: "angi",
    name: "Angi",
    role: "Chief of Staff",
    description: "Your orchestrator who coordinates the team and ensures everything runs smoothly.",
    personality: "Warm, organized, proactive - the leader",
    color: "#2563eb",
    emoji: "👑",
  },
  {
    id: "maya",
    name: "Maya",
    role: "Communications Director",
    description: "Handles all your emails, WhatsApp messages, and communications.",
    personality: "Professional, articulate, responsive",
    color: "#8b5cf6",
    emoji: "💬",
  },
  {
    id: "kai",
    name: "Kai",
    role: "Schedule Architect",
    description: "Manages your calendar, meetings, and time like a pro.",
    personality: "Punctual, strategic, efficient",
    color: "#06b6d4",
    emoji: "📅",
  },
  {
    id: "nova",
    name: "Nova",
    role: "Research Analyst",
    description: "Deep web research, data analysis, and comprehensive reports.",
    personality: "Curious, thorough, analytical",
    color: "#10b981",
    emoji: "🔍",
  },
  {
    id: "aria",
    name: "Aria",
    role: "Finance Guardian",
    description: "Tracks budgets, expenses, invoices, and financial health.",
    personality: "Precise, trustworthy, detail-oriented",
    color: "#f59e0b",
    emoji: "💰",
  },
  {
    id: "zara",
    name: "Zara",
    role: "Content Creator",
    description: "Writes content, manages social media, and crafts compelling copy.",
    personality: "Creative, engaging, versatile",
    color: "#ec4899",
    emoji: "✍️",
  },
  {
    id: "rex",
    name: "Rex",
    role: "Operations Manager",
    description: "Handles tasks, projects, and team coordination with precision.",
    personality: "Systematic, reliable, results-driven",
    color: "#ef4444",
    emoji: "⚡",
  },
];

// Pricing tiers with dual currency support (USD and INR)
export const pricingTiers = [
  {
    id: "starter",
    name: "Starter",
    price: {
      USD: { monthly: 39, yearly: 390 },
      INR: { monthly: 2999, yearly: 29990 },
    },
    description: "For individuals getting serious",
    features: [
      { name: "Agents", value: "Angi + 2 agents" },
      { name: "Messages/month", value: "2,000" },
      { name: "Integrations", value: "Email, Calendar" },
      { name: "Voice", value: "Text only" },
      { name: "Memory", value: "30 days" },
      { name: "Brain (Proactive)", value: "Basic" },
      { name: "Team members", value: "1" },
      { name: "Support", value: "Email" },
    ],
    cta: "Get Started",
    popular: false,
    agentCount: 3,
  },
  {
    id: "pro",
    name: "Pro",
    price: {
      USD: { monthly: 99, yearly: 990 },
      INR: { monthly: 7499, yearly: 74990 },
    },
    description: "For power users and small teams",
    features: [
      { name: "Agents", value: "All 7 agents" },
      { name: "Messages/month", value: "10,000" },
      { name: "Integrations", value: "+ WhatsApp, Calling" },
      { name: "Voice", value: "Voice chat" },
      { name: "Memory", value: "Unlimited" },
      { name: "Brain (Proactive)", value: "Advanced" },
      { name: "Team members", value: "3" },
      { name: "Support", value: "Priority" },
    ],
    cta: "Get Started",
    popular: true,
    agentCount: 7,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: {
      USD: { monthly: 399, yearly: 3990 },
      INR: { monthly: 29999, yearly: 299990 },
    },
    description: "For organizations that need it all",
    features: [
      { name: "Agents", value: "All 116+ agents" },
      { name: "Messages/month", value: "Unlimited" },
      { name: "Integrations", value: "+ Custom APIs" },
      { name: "Voice", value: "Voice + Phone calls" },
      { name: "Memory", value: "Unlimited + Export" },
      { name: "Brain (Proactive)", value: "Custom rules" },
      { name: "Team members", value: "Unlimited" },
      { name: "Support", value: "Dedicated manager" },
    ],
    cta: "Contact Sales",
    popular: false,
    agentCount: 116,
  },
];

// Currency symbols
export const currencySymbols = {
  USD: "$",
  INR: "₹",
};

// FAQ data
export const faqs = [
  {
    question: "What is Angi?",
    answer: "Angi is your AI-powered team of 7 specialized agents, each designed to handle specific aspects of your work. From communications to scheduling, research to finance, Angi coordinates your digital workforce to help you accomplish more.",
  },
  {
    question: "How is this different from ChatGPT or other AI tools?",
    answer: "Unlike general-purpose AI assistants, Angi provides specialized agents with deep expertise in specific domains. Each agent has its own personality, skills, and integrations. Plus, Angi (the chief of staff) orchestrates them to work together seamlessly.",
  },
  {
    question: "When does Angi launch?",
    answer: "Angi launches on March 3rd, 2026. Sign up now to secure early access and be among the first to experience your new AI team.",
  },
  {
    question: "Can I try before I buy?",
    answer: "Yes! Our Free tier gives you access to Angi (the chief agent) with 100 messages per month. You can upgrade anytime to unlock more agents and features.",
  },
  {
    question: "What integrations are supported?",
    answer: "Depending on your plan, Angi integrates with email (Gmail, Outlook), calendar (Google Calendar), WhatsApp, phone calls, and custom APIs for Enterprise users. We're constantly adding more integrations.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We use enterprise-grade encryption, and your data is never used to train AI models. You own your data, and you can export or delete it anytime.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time. No questions asked. If you're on a yearly plan, you'll receive a prorated refund for unused months.",
  },
];

// Launch date
export const LAUNCH_DATE = new Date("2026-03-03T00:00:00");
