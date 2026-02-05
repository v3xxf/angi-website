// Comprehensive agent database with 100+ agents across categories

export interface Agent {
  id: string;
  name: string;
  role: string;
  category: string;
  description: string;
  tasksCompleted: number;
  rating: number;
  skills: string[];
  avatar: string;
  color: string;
  featured?: boolean;
}

export const agentCategories = [
  { id: "marketing", name: "Marketing", icon: "📢", color: "#ec4899" },
  { id: "finance", name: "Finance", icon: "💰", color: "#f59e0b" },
  { id: "research", name: "Research", icon: "🔍", color: "#10b981" },
  { id: "creative", name: "Creative", icon: "🎨", color: "#8b5cf6" },
  { id: "operations", name: "Operations", icon: "⚡", color: "#ef4444" },
  { id: "engineering", name: "Engineering", icon: "💻", color: "#06b6d4" },
  { id: "sales", name: "Sales", icon: "🤝", color: "#3b82f6" },
  { id: "hr", name: "HR & People", icon: "👥", color: "#84cc16" },
  { id: "legal", name: "Legal", icon: "⚖️", color: "#64748b" },
  { id: "customer", name: "Customer Success", icon: "💬", color: "#f97316" },
];

// Generate 100+ agents
export const agents: Agent[] = [
  // MARKETING (15 agents)
  { id: "m1", name: "Sarah", role: "Social Media Manager", category: "marketing", description: "Creates engaging social content and manages your brand presence across all platforms", tasksCompleted: 45672, rating: 4.9, skills: ["Instagram", "Twitter", "LinkedIn", "TikTok"], avatar: "👩‍💼", color: "#ec4899", featured: true },
  { id: "m2", name: "Marcus", role: "SEO Specialist", category: "marketing", description: "Optimizes your content for search engines and drives organic traffic", tasksCompleted: 32451, rating: 4.8, skills: ["Keyword Research", "Link Building", "Technical SEO"], avatar: "👨‍💻", color: "#ec4899" },
  { id: "m3", name: "Luna", role: "Ad Copywriter", category: "marketing", description: "Writes compelling ad copy that converts browsers into buyers", tasksCompleted: 28934, rating: 4.9, skills: ["Facebook Ads", "Google Ads", "Headlines"], avatar: "✍️", color: "#ec4899" },
  { id: "m4", name: "Derek", role: "Email Marketer", category: "marketing", description: "Creates email campaigns that nurture leads and drive sales", tasksCompleted: 51283, rating: 4.7, skills: ["Drip Campaigns", "Newsletters", "A/B Testing"], avatar: "📧", color: "#ec4899" },
  { id: "m5", name: "Priya", role: "Content Strategist", category: "marketing", description: "Plans and executes content calendars that align with business goals", tasksCompleted: 19847, rating: 4.8, skills: ["Editorial Calendar", "Content Planning", "Brand Voice"], avatar: "📊", color: "#ec4899" },
  { id: "m6", name: "Jake", role: "Influencer Manager", category: "marketing", description: "Finds and manages influencer partnerships for maximum reach", tasksCompleted: 8734, rating: 4.6, skills: ["Outreach", "Negotiations", "Campaign Tracking"], avatar: "🌟", color: "#ec4899" },
  { id: "m7", name: "Nina", role: "Brand Strategist", category: "marketing", description: "Develops brand positioning and messaging frameworks", tasksCompleted: 12456, rating: 4.9, skills: ["Brand Identity", "Positioning", "Messaging"], avatar: "🎯", color: "#ec4899" },
  { id: "m8", name: "Carlos", role: "PPC Specialist", category: "marketing", description: "Manages paid advertising campaigns across platforms", tasksCompleted: 37821, rating: 4.7, skills: ["Google Ads", "Meta Ads", "Bid Management"], avatar: "💵", color: "#ec4899" },
  { id: "m9", name: "Emma", role: "PR Specialist", category: "marketing", description: "Handles media relations and press coverage", tasksCompleted: 15632, rating: 4.8, skills: ["Press Releases", "Media Outreach", "Crisis PR"], avatar: "📰", color: "#ec4899" },
  { id: "m10", name: "Ryan", role: "Growth Hacker", category: "marketing", description: "Experiments with unconventional strategies to drive rapid growth", tasksCompleted: 21345, rating: 4.9, skills: ["Viral Loops", "Referrals", "Product-Led Growth"], avatar: "🚀", color: "#ec4899", featured: true },
  { id: "m11", name: "Mia", role: "Community Manager", category: "marketing", description: "Builds and nurtures online communities around your brand", tasksCompleted: 43287, rating: 4.8, skills: ["Discord", "Slack", "Forums"], avatar: "🎪", color: "#ec4899" },
  { id: "m12", name: "Alex", role: "Marketing Analyst", category: "marketing", description: "Tracks metrics and provides insights to optimize campaigns", tasksCompleted: 28765, rating: 4.7, skills: ["Google Analytics", "Attribution", "Reporting"], avatar: "📈", color: "#ec4899" },
  { id: "m13", name: "Sophie", role: "Event Marketer", category: "marketing", description: "Plans and promotes virtual and in-person events", tasksCompleted: 9823, rating: 4.6, skills: ["Webinars", "Conferences", "Promotions"], avatar: "🎉", color: "#ec4899" },
  { id: "m14", name: "Tom", role: "Affiliate Manager", category: "marketing", description: "Recruits and manages affiliate partnerships", tasksCompleted: 16754, rating: 4.7, skills: ["Partner Recruitment", "Commission Tracking", "Payouts"], avatar: "🤝", color: "#ec4899" },
  { id: "m15", name: "Zoe", role: "Video Marketer", category: "marketing", description: "Creates video marketing strategies and scripts", tasksCompleted: 22341, rating: 4.8, skills: ["YouTube", "TikTok", "Video Ads"], avatar: "🎬", color: "#ec4899" },

  // FINANCE (12 agents)
  { id: "f1", name: "Aria", role: "Finance Guardian", category: "finance", description: "Your personal CFO tracking budgets, expenses, and financial health", tasksCompleted: 67432, rating: 4.9, skills: ["Budgeting", "Forecasting", "Cash Flow"], avatar: "💰", color: "#f59e0b", featured: true },
  { id: "f2", name: "David", role: "Bookkeeper", category: "finance", description: "Maintains accurate financial records and reconciles accounts", tasksCompleted: 89234, rating: 4.8, skills: ["QuickBooks", "Xero", "Reconciliation"], avatar: "📚", color: "#f59e0b" },
  { id: "f3", name: "Rachel", role: "Invoice Manager", category: "finance", description: "Creates, sends, and tracks invoices to ensure timely payments", tasksCompleted: 54321, rating: 4.7, skills: ["Invoicing", "AR Management", "Collections"], avatar: "📄", color: "#f59e0b" },
  { id: "f4", name: "Michael", role: "Expense Analyst", category: "finance", description: "Analyzes spending patterns and identifies cost savings", tasksCompleted: 31245, rating: 4.8, skills: ["Expense Tracking", "Cost Reduction", "Vendor Analysis"], avatar: "🔎", color: "#f59e0b" },
  { id: "f5", name: "Linda", role: "Payroll Specialist", category: "finance", description: "Processes payroll accurately and on time", tasksCompleted: 42156, rating: 4.9, skills: ["Payroll Processing", "Tax Compliance", "Benefits"], avatar: "💳", color: "#f59e0b" },
  { id: "f6", name: "James", role: "Tax Advisor", category: "finance", description: "Provides tax planning and compliance guidance", tasksCompleted: 18743, rating: 4.8, skills: ["Tax Planning", "Deductions", "Compliance"], avatar: "📋", color: "#f59e0b" },
  { id: "f7", name: "Karen", role: "Financial Planner", category: "finance", description: "Creates long-term financial plans and investment strategies", tasksCompleted: 15632, rating: 4.7, skills: ["Financial Planning", "Investments", "Retirement"], avatar: "🎯", color: "#f59e0b" },
  { id: "f8", name: "Robert", role: "Budget Analyst", category: "finance", description: "Creates and monitors departmental budgets", tasksCompleted: 27834, rating: 4.8, skills: ["Budget Creation", "Variance Analysis", "Forecasting"], avatar: "📊", color: "#f59e0b" },
  { id: "f9", name: "Susan", role: "Accounts Payable", category: "finance", description: "Manages vendor payments and maintains AP records", tasksCompleted: 61234, rating: 4.7, skills: ["AP Processing", "Vendor Relations", "Payment Terms"], avatar: "✅", color: "#f59e0b" },
  { id: "f10", name: "Chris", role: "Financial Reporter", category: "finance", description: "Prepares financial statements and management reports", tasksCompleted: 23456, rating: 4.9, skills: ["P&L", "Balance Sheet", "Cash Flow Statement"], avatar: "📑", color: "#f59e0b" },
  { id: "f11", name: "Angela", role: "Audit Coordinator", category: "finance", description: "Prepares documentation and coordinates audit processes", tasksCompleted: 12345, rating: 4.6, skills: ["Audit Prep", "Documentation", "Compliance"], avatar: "🔍", color: "#f59e0b" },
  { id: "f12", name: "Steve", role: "Treasury Manager", category: "finance", description: "Manages cash positions and banking relationships", tasksCompleted: 19876, rating: 4.8, skills: ["Cash Management", "Banking", "Liquidity"], avatar: "🏦", color: "#f59e0b" },

  // RESEARCH (12 agents)
  { id: "r1", name: "Nova", role: "Research Analyst", category: "research", description: "Conducts deep research and analysis on any topic", tasksCompleted: 78234, rating: 4.9, skills: ["Market Research", "Competitive Analysis", "Data Mining"], avatar: "🔍", color: "#10b981", featured: true },
  { id: "r2", name: "Oliver", role: "Market Researcher", category: "research", description: "Analyzes market trends and customer insights", tasksCompleted: 45678, rating: 4.8, skills: ["Surveys", "Focus Groups", "Trend Analysis"], avatar: "📊", color: "#10b981" },
  { id: "r3", name: "Ivy", role: "Competitor Analyst", category: "research", description: "Monitors competitors and identifies strategic opportunities", tasksCompleted: 34521, rating: 4.9, skills: ["SWOT Analysis", "Benchmarking", "Intel Gathering"], avatar: "🕵️", color: "#10b981", featured: true },
  { id: "r4", name: "Nathan", role: "Data Miner", category: "research", description: "Extracts and analyzes data from various sources", tasksCompleted: 56789, rating: 4.7, skills: ["Web Scraping", "Data Extraction", "Pattern Recognition"], avatar: "⛏️", color: "#10b981" },
  { id: "r5", name: "Grace", role: "Academic Researcher", category: "research", description: "Reviews academic papers and synthesizes findings", tasksCompleted: 23456, rating: 4.8, skills: ["Literature Review", "Citation Analysis", "Synthesis"], avatar: "📚", color: "#10b981" },
  { id: "r6", name: "Ethan", role: "Industry Analyst", category: "research", description: "Tracks industry developments and creates reports", tasksCompleted: 31234, rating: 4.7, skills: ["Industry Reports", "Trend Forecasting", "Expert Interviews"], avatar: "🏭", color: "#10b981" },
  { id: "r7", name: "Chloe", role: "UX Researcher", category: "research", description: "Conducts user research to improve product experience", tasksCompleted: 28765, rating: 4.9, skills: ["User Interviews", "Usability Testing", "Personas"], avatar: "👤", color: "#10b981" },
  { id: "r8", name: "Daniel", role: "Patent Researcher", category: "research", description: "Searches and analyzes patent databases", tasksCompleted: 15432, rating: 4.6, skills: ["Patent Search", "Prior Art", "IP Analysis"], avatar: "📜", color: "#10b981" },
  { id: "r9", name: "Hannah", role: "Survey Designer", category: "research", description: "Creates and analyzes surveys for insights", tasksCompleted: 19876, rating: 4.8, skills: ["Survey Design", "Data Collection", "Statistical Analysis"], avatar: "📝", color: "#10b981" },
  { id: "r10", name: "Lucas", role: "Fact Checker", category: "research", description: "Verifies information and sources for accuracy", tasksCompleted: 67890, rating: 4.9, skills: ["Verification", "Source Analysis", "Accuracy"], avatar: "✓", color: "#10b981" },
  { id: "r11", name: "Emily", role: "Trend Spotter", category: "research", description: "Identifies emerging trends before they go mainstream", tasksCompleted: 21345, rating: 4.8, skills: ["Trend Analysis", "Social Listening", "Forecasting"], avatar: "🔮", color: "#10b981" },
  { id: "r12", name: "Jack", role: "Price Researcher", category: "research", description: "Monitors pricing and finds the best deals", tasksCompleted: 43210, rating: 4.7, skills: ["Price Comparison", "Deal Finding", "Negotiation Intel"], avatar: "💲", color: "#10b981" },

  // CREATIVE (15 agents)
  { id: "c1", name: "Zara", role: "Content Creator", category: "creative", description: "Writes compelling content across all formats", tasksCompleted: 92345, rating: 4.9, skills: ["Blog Posts", "Social Media", "Scripts"], avatar: "✍️", color: "#8b5cf6", featured: true },
  { id: "c2", name: "Leo", role: "Graphic Designer", category: "creative", description: "Creates stunning visuals and graphics", tasksCompleted: 67890, rating: 4.8, skills: ["Logos", "Social Graphics", "Presentations"], avatar: "🎨", color: "#8b5cf6" },
  { id: "c3", name: "Maya", role: "Copywriter", category: "creative", description: "Crafts persuasive copy that sells", tasksCompleted: 78234, rating: 4.9, skills: ["Sales Copy", "Landing Pages", "Ads"], avatar: "📝", color: "#8b5cf6", featured: true },
  { id: "c4", name: "Finn", role: "Video Editor", category: "creative", description: "Edits and produces engaging video content", tasksCompleted: 34567, rating: 4.7, skills: ["Editing", "Motion Graphics", "Color Grading"], avatar: "🎬", color: "#8b5cf6" },
  { id: "c5", name: "Stella", role: "Brand Designer", category: "creative", description: "Develops visual brand identities", tasksCompleted: 23456, rating: 4.8, skills: ["Brand Guidelines", "Visual Identity", "Style Guides"], avatar: "✨", color: "#8b5cf6" },
  { id: "c6", name: "Oscar", role: "UI Designer", category: "creative", description: "Designs beautiful user interfaces", tasksCompleted: 45678, rating: 4.9, skills: ["UI Design", "Figma", "Design Systems"], avatar: "🖥️", color: "#8b5cf6" },
  { id: "c7", name: "Ruby", role: "Illustrator", category: "creative", description: "Creates custom illustrations and artwork", tasksCompleted: 31234, rating: 4.8, skills: ["Digital Art", "Icons", "Characters"], avatar: "🖌️", color: "#8b5cf6" },
  { id: "c8", name: "Max", role: "Animation Artist", category: "creative", description: "Brings designs to life with animation", tasksCompleted: 19876, rating: 4.7, skills: ["2D Animation", "Lottie", "GIFs"], avatar: "🎭", color: "#8b5cf6" },
  { id: "c9", name: "Lily", role: "Presentation Designer", category: "creative", description: "Creates impactful slide decks", tasksCompleted: 56789, rating: 4.8, skills: ["PowerPoint", "Keynote", "Pitch Decks"], avatar: "📊", color: "#8b5cf6" },
  { id: "c10", name: "Hugo", role: "Photo Editor", category: "creative", description: "Retouches and enhances photos", tasksCompleted: 87654, rating: 4.7, skills: ["Retouching", "Color Correction", "Compositing"], avatar: "📸", color: "#8b5cf6" },
  { id: "c11", name: "Violet", role: "Podcast Producer", category: "creative", description: "Produces and edits podcast episodes", tasksCompleted: 12345, rating: 4.6, skills: ["Audio Editing", "Show Notes", "Publishing"], avatar: "🎙️", color: "#8b5cf6" },
  { id: "c12", name: "Theo", role: "Scriptwriter", category: "creative", description: "Writes scripts for videos and ads", tasksCompleted: 28765, rating: 4.8, skills: ["Video Scripts", "Ad Scripts", "Storytelling"], avatar: "🎬", color: "#8b5cf6" },
  { id: "c13", name: "Ivy", role: "Thumbnail Designer", category: "creative", description: "Creates click-worthy thumbnails", tasksCompleted: 43210, rating: 4.9, skills: ["YouTube Thumbnails", "Social Graphics", "A/B Testing"], avatar: "🖼️", color: "#8b5cf6" },
  { id: "c14", name: "Axel", role: "3D Artist", category: "creative", description: "Creates 3D models and renders", tasksCompleted: 15678, rating: 4.7, skills: ["3D Modeling", "Rendering", "Product Viz"], avatar: "🎮", color: "#8b5cf6" },
  { id: "c15", name: "Nora", role: "UX Writer", category: "creative", description: "Writes user-friendly microcopy", tasksCompleted: 34567, rating: 4.8, skills: ["Microcopy", "Error Messages", "Onboarding"], avatar: "💭", color: "#8b5cf6" },

  // OPERATIONS (12 agents)
  { id: "o1", name: "Rex", role: "Operations Manager", category: "operations", description: "Coordinates tasks, projects, and team workflows", tasksCompleted: 123456, rating: 4.9, skills: ["Project Management", "Workflows", "Coordination"], avatar: "⚡", color: "#ef4444", featured: true },
  { id: "o2", name: "Kai", role: "Schedule Architect", category: "operations", description: "Masters your calendar and optimizes your time", tasksCompleted: 98765, rating: 4.9, skills: ["Calendar Management", "Scheduling", "Time Blocking"], avatar: "📅", color: "#ef4444", featured: true },
  { id: "o3", name: "Diana", role: "Project Coordinator", category: "operations", description: "Keeps projects on track and stakeholders aligned", tasksCompleted: 67890, rating: 4.8, skills: ["Asana", "Monday", "Jira"], avatar: "📋", color: "#ef4444" },
  { id: "o4", name: "Victor", role: "Process Optimizer", category: "operations", description: "Streamlines operations and eliminates bottlenecks", tasksCompleted: 34567, rating: 4.7, skills: ["Process Mapping", "Automation", "Efficiency"], avatar: "⚙️", color: "#ef4444" },
  { id: "o5", name: "Elena", role: "Meeting Coordinator", category: "operations", description: "Schedules meetings and prepares agendas", tasksCompleted: 78234, rating: 4.8, skills: ["Scheduling", "Agendas", "Minutes"], avatar: "🗓️", color: "#ef4444" },
  { id: "o6", name: "Adrian", role: "Task Manager", category: "operations", description: "Tracks tasks and ensures nothing falls through", tasksCompleted: 145678, rating: 4.9, skills: ["Task Tracking", "Prioritization", "Deadlines"], avatar: "✅", color: "#ef4444" },
  { id: "o7", name: "Bianca", role: "Travel Coordinator", category: "operations", description: "Books travel and manages itineraries", tasksCompleted: 23456, rating: 4.7, skills: ["Flight Booking", "Hotels", "Itineraries"], avatar: "✈️", color: "#ef4444" },
  { id: "o8", name: "Felix", role: "Inventory Manager", category: "operations", description: "Tracks inventory and manages stock levels", tasksCompleted: 45678, rating: 4.6, skills: ["Inventory Tracking", "Reordering", "Stock Analysis"], avatar: "📦", color: "#ef4444" },
  { id: "o9", name: "Gina", role: "Vendor Manager", category: "operations", description: "Manages vendor relationships and contracts", tasksCompleted: 31234, rating: 4.8, skills: ["Vendor Relations", "Contracts", "Negotiations"], avatar: "🤝", color: "#ef4444" },
  { id: "o10", name: "Henry", role: "Quality Controller", category: "operations", description: "Ensures deliverables meet quality standards", tasksCompleted: 56789, rating: 4.9, skills: ["QA", "Checklists", "Standards"], avatar: "🎯", color: "#ef4444" },
  { id: "o11", name: "Isla", role: "Documentation Specialist", category: "operations", description: "Creates and maintains process documentation", tasksCompleted: 28765, rating: 4.7, skills: ["SOPs", "Wikis", "Knowledge Base"], avatar: "📚", color: "#ef4444" },
  { id: "o12", name: "Jason", role: "Facilities Coordinator", category: "operations", description: "Manages office and facilities needs", tasksCompleted: 19876, rating: 4.6, skills: ["Office Management", "Supplies", "Maintenance"], avatar: "🏢", color: "#ef4444" },

  // ENGINEERING (12 agents)
  { id: "e1", name: "Atlas", role: "Code Reviewer", category: "engineering", description: "Reviews code for quality, security, and best practices", tasksCompleted: 87654, rating: 4.9, skills: ["Code Review", "Best Practices", "Security"], avatar: "💻", color: "#06b6d4", featured: true },
  { id: "e2", name: "Sage", role: "Bug Fixer", category: "engineering", description: "Identifies and fixes bugs in your codebase", tasksCompleted: 65432, rating: 4.8, skills: ["Debugging", "Troubleshooting", "Testing"], avatar: "🐛", color: "#06b6d4" },
  { id: "e3", name: "Quinn", role: "Documentation Writer", category: "engineering", description: "Creates clear technical documentation", tasksCompleted: 43210, rating: 4.7, skills: ["API Docs", "README", "Tutorials"], avatar: "📖", color: "#06b6d4" },
  { id: "e4", name: "River", role: "DevOps Engineer", category: "engineering", description: "Manages infrastructure and deployments", tasksCompleted: 34567, rating: 4.8, skills: ["CI/CD", "Docker", "AWS"], avatar: "🚀", color: "#06b6d4" },
  { id: "e5", name: "Sky", role: "Frontend Developer", category: "engineering", description: "Builds beautiful, responsive user interfaces", tasksCompleted: 56789, rating: 4.9, skills: ["React", "CSS", "TypeScript"], avatar: "🎨", color: "#06b6d4" },
  { id: "e6", name: "Storm", role: "Backend Developer", category: "engineering", description: "Builds robust APIs and server-side logic", tasksCompleted: 45678, rating: 4.8, skills: ["Node.js", "Python", "Databases"], avatar: "⚙️", color: "#06b6d4" },
  { id: "e7", name: "Phoenix", role: "Database Admin", category: "engineering", description: "Optimizes databases and manages data", tasksCompleted: 23456, rating: 4.7, skills: ["PostgreSQL", "MongoDB", "Query Optimization"], avatar: "🗄️", color: "#06b6d4" },
  { id: "e8", name: "Blaze", role: "Security Analyst", category: "engineering", description: "Identifies vulnerabilities and secures systems", tasksCompleted: 31234, rating: 4.9, skills: ["Penetration Testing", "Security Audits", "Compliance"], avatar: "🔒", color: "#06b6d4" },
  { id: "e9", name: "Echo", role: "QA Engineer", category: "engineering", description: "Tests software and ensures quality", tasksCompleted: 78234, rating: 4.8, skills: ["Test Automation", "Manual Testing", "Bug Reporting"], avatar: "🧪", color: "#06b6d4" },
  { id: "e10", name: "Onyx", role: "Data Engineer", category: "engineering", description: "Builds data pipelines and infrastructure", tasksCompleted: 28765, rating: 4.7, skills: ["ETL", "Data Pipelines", "Big Data"], avatar: "📊", color: "#06b6d4" },
  { id: "e11", name: "Jade", role: "Mobile Developer", category: "engineering", description: "Builds iOS and Android applications", tasksCompleted: 19876, rating: 4.8, skills: ["React Native", "Flutter", "Swift"], avatar: "📱", color: "#06b6d4" },
  { id: "e12", name: "Ash", role: "ML Engineer", category: "engineering", description: "Builds and deploys machine learning models", tasksCompleted: 15678, rating: 4.9, skills: ["Python", "TensorFlow", "Model Training"], avatar: "🤖", color: "#06b6d4" },

  // SALES (10 agents)
  { id: "s1", name: "Blake", role: "Sales Development Rep", category: "sales", description: "Prospects and qualifies leads for your pipeline", tasksCompleted: 67890, rating: 4.8, skills: ["Prospecting", "Cold Outreach", "Lead Qualification"], avatar: "🎯", color: "#3b82f6", featured: true },
  { id: "s2", name: "Camila", role: "Account Executive", category: "sales", description: "Closes deals and manages key accounts", tasksCompleted: 45678, rating: 4.9, skills: ["Closing", "Negotiations", "Presentations"], avatar: "💼", color: "#3b82f6" },
  { id: "s3", name: "Drew", role: "Sales Operations", category: "sales", description: "Optimizes sales processes and CRM", tasksCompleted: 34567, rating: 4.7, skills: ["Salesforce", "Pipeline Management", "Reporting"], avatar: "📈", color: "#3b82f6" },
  { id: "s4", name: "Eva", role: "Proposal Writer", category: "sales", description: "Creates winning proposals and RFP responses", tasksCompleted: 23456, rating: 4.8, skills: ["Proposals", "RFPs", "Pricing"], avatar: "📄", color: "#3b82f6" },
  { id: "s5", name: "Frank", role: "Demo Specialist", category: "sales", description: "Delivers compelling product demonstrations", tasksCompleted: 31234, rating: 4.8, skills: ["Product Demos", "Presentations", "Objection Handling"], avatar: "🖥️", color: "#3b82f6" },
  { id: "s6", name: "Gwen", role: "Contract Manager", category: "sales", description: "Manages contracts and negotiations", tasksCompleted: 19876, rating: 4.7, skills: ["Contracts", "Redlining", "Terms"], avatar: "📋", color: "#3b82f6" },
  { id: "s7", name: "Hank", role: "Lead Researcher", category: "sales", description: "Researches prospects and builds contact lists", tasksCompleted: 56789, rating: 4.6, skills: ["LinkedIn", "Lead Lists", "Company Research"], avatar: "🔎", color: "#3b82f6" },
  { id: "s8", name: "Iris", role: "Sales Enablement", category: "sales", description: "Creates sales collateral and training", tasksCompleted: 28765, rating: 4.8, skills: ["Battle Cards", "Training", "Playbooks"], avatar: "📚", color: "#3b82f6" },
  { id: "s9", name: "Jake", role: "Partnership Manager", category: "sales", description: "Develops and manages strategic partnerships", tasksCompleted: 15678, rating: 4.7, skills: ["Partnerships", "Channel Sales", "Co-marketing"], avatar: "🤝", color: "#3b82f6" },
  { id: "s10", name: "Kelly", role: "Revenue Analyst", category: "sales", description: "Analyzes sales data and forecasts revenue", tasksCompleted: 21345, rating: 4.8, skills: ["Forecasting", "Analytics", "Reporting"], avatar: "📊", color: "#3b82f6" },

  // HR & PEOPLE (10 agents)
  { id: "h1", name: "Liam", role: "HR Coordinator", category: "hr", description: "Manages HR processes and employee relations", tasksCompleted: 45678, rating: 4.8, skills: ["HR Admin", "Employee Relations", "Compliance"], avatar: "👥", color: "#84cc16", featured: true },
  { id: "h2", name: "Monica", role: "Recruiter", category: "hr", description: "Sources and screens candidates", tasksCompleted: 56789, rating: 4.9, skills: ["Sourcing", "Screening", "Interviews"], avatar: "🎯", color: "#84cc16" },
  { id: "h3", name: "Nate", role: "Onboarding Specialist", category: "hr", description: "Creates smooth onboarding experiences", tasksCompleted: 34567, rating: 4.7, skills: ["Onboarding", "Training", "Documentation"], avatar: "🚀", color: "#84cc16" },
  { id: "h4", name: "Olivia", role: "Benefits Coordinator", category: "hr", description: "Manages employee benefits and perks", tasksCompleted: 23456, rating: 4.6, skills: ["Benefits Admin", "Insurance", "Perks"], avatar: "🎁", color: "#84cc16" },
  { id: "h5", name: "Pete", role: "Performance Manager", category: "hr", description: "Facilitates performance reviews and feedback", tasksCompleted: 19876, rating: 4.8, skills: ["Reviews", "Feedback", "Goal Setting"], avatar: "📈", color: "#84cc16" },
  { id: "h6", name: "Quinn", role: "Learning & Development", category: "hr", description: "Creates training programs and resources", tasksCompleted: 28765, rating: 4.7, skills: ["Training", "E-learning", "Workshops"], avatar: "📚", color: "#84cc16" },
  { id: "h7", name: "Rosa", role: "Culture Champion", category: "hr", description: "Builds and maintains company culture", tasksCompleted: 31234, rating: 4.9, skills: ["Culture", "Events", "Recognition"], avatar: "🎉", color: "#84cc16" },
  { id: "h8", name: "Sam", role: "Compensation Analyst", category: "hr", description: "Analyzes and benchmarks compensation", tasksCompleted: 15678, rating: 4.6, skills: ["Comp Analysis", "Benchmarking", "Equity"], avatar: "💰", color: "#84cc16" },
  { id: "h9", name: "Tara", role: "HRIS Administrator", category: "hr", description: "Manages HR information systems", tasksCompleted: 21345, rating: 4.7, skills: ["Workday", "BambooHR", "Data Management"], avatar: "🖥️", color: "#84cc16" },
  { id: "h10", name: "Uma", role: "Employee Experience", category: "hr", description: "Improves the overall employee journey", tasksCompleted: 18765, rating: 4.8, skills: ["Surveys", "Engagement", "Retention"], avatar: "😊", color: "#84cc16" },

  // LEGAL (8 agents)
  { id: "l1", name: "Vincent", role: "Contract Reviewer", category: "legal", description: "Reviews contracts and identifies risks", tasksCompleted: 34567, rating: 4.9, skills: ["Contract Review", "Risk Analysis", "Redlining"], avatar: "⚖️", color: "#64748b", featured: true },
  { id: "l2", name: "Wendy", role: "Compliance Officer", category: "legal", description: "Ensures regulatory compliance", tasksCompleted: 23456, rating: 4.8, skills: ["Compliance", "Regulations", "Audits"], avatar: "📋", color: "#64748b" },
  { id: "l3", name: "Xavier", role: "IP Specialist", category: "legal", description: "Manages intellectual property matters", tasksCompleted: 19876, rating: 4.7, skills: ["Patents", "Trademarks", "Copyright"], avatar: "💡", color: "#64748b" },
  { id: "l4", name: "Yara", role: "Privacy Analyst", category: "legal", description: "Ensures data privacy compliance", tasksCompleted: 28765, rating: 4.8, skills: ["GDPR", "CCPA", "Privacy Policies"], avatar: "🔒", color: "#64748b" },
  { id: "l5", name: "Zach", role: "Legal Researcher", category: "legal", description: "Researches legal precedents and regulations", tasksCompleted: 31234, rating: 4.6, skills: ["Legal Research", "Case Law", "Statutes"], avatar: "📚", color: "#64748b" },
  { id: "l6", name: "Amy", role: "NDA Manager", category: "legal", description: "Manages NDAs and confidentiality agreements", tasksCompleted: 45678, rating: 4.7, skills: ["NDAs", "Confidentiality", "Document Management"], avatar: "🤐", color: "#64748b" },
  { id: "l7", name: "Ben", role: "Terms Writer", category: "legal", description: "Drafts terms of service and policies", tasksCompleted: 15678, rating: 4.8, skills: ["Terms of Service", "Privacy Policy", "Disclaimers"], avatar: "📝", color: "#64748b" },
  { id: "l8", name: "Clara", role: "Employment Counsel", category: "legal", description: "Advises on employment law matters", tasksCompleted: 21345, rating: 4.7, skills: ["Employment Law", "Handbooks", "Disputes"], avatar: "👔", color: "#64748b" },

  // CUSTOMER SUCCESS (10 agents)
  { id: "cs1", name: "Derek", role: "Customer Success Manager", category: "customer", description: "Ensures customer satisfaction and retention", tasksCompleted: 67890, rating: 4.9, skills: ["Account Management", "Retention", "Upselling"], avatar: "💬", color: "#f97316", featured: true },
  { id: "cs2", name: "Elle", role: "Support Specialist", category: "customer", description: "Resolves customer issues quickly", tasksCompleted: 123456, rating: 4.8, skills: ["Troubleshooting", "Tickets", "Live Chat"], avatar: "🎧", color: "#f97316" },
  { id: "cs3", name: "Fred", role: "Onboarding Coach", category: "customer", description: "Guides new customers to success", tasksCompleted: 45678, rating: 4.9, skills: ["Onboarding", "Training", "Best Practices"], avatar: "🎓", color: "#f97316" },
  { id: "cs4", name: "Gloria", role: "Knowledge Base Manager", category: "customer", description: "Creates and maintains help documentation", tasksCompleted: 34567, rating: 4.7, skills: ["Documentation", "FAQs", "Tutorials"], avatar: "📚", color: "#f97316" },
  { id: "cs5", name: "Harry", role: "Feedback Analyst", category: "customer", description: "Analyzes customer feedback for insights", tasksCompleted: 28765, rating: 4.8, skills: ["Surveys", "NPS", "Voice of Customer"], avatar: "📊", color: "#f97316" },
  { id: "cs6", name: "Ingrid", role: "Renewal Specialist", category: "customer", description: "Manages contract renewals", tasksCompleted: 23456, rating: 4.7, skills: ["Renewals", "Negotiations", "Forecasting"], avatar: "🔄", color: "#f97316" },
  { id: "cs7", name: "Jim", role: "Technical Support", category: "customer", description: "Handles technical customer issues", tasksCompleted: 56789, rating: 4.8, skills: ["Technical Troubleshooting", "Integrations", "APIs"], avatar: "🔧", color: "#f97316" },
  { id: "cs8", name: "Kate", role: "Community Manager", category: "customer", description: "Builds and nurtures customer community", tasksCompleted: 31234, rating: 4.9, skills: ["Community", "Events", "Advocacy"], avatar: "🎪", color: "#f97316" },
  { id: "cs9", name: "Leo", role: "Customer Trainer", category: "customer", description: "Delivers training sessions and webinars", tasksCompleted: 19876, rating: 4.7, skills: ["Training", "Webinars", "Certification"], avatar: "🎤", color: "#f97316" },
  { id: "cs10", name: "Mia", role: "Escalation Manager", category: "customer", description: "Handles escalated customer issues", tasksCompleted: 15678, rating: 4.8, skills: ["Escalations", "Resolution", "Executive Communication"], avatar: "🚨", color: "#f97316" },
];

// Get featured agents
export const featuredAgents = agents.filter(a => a.featured);

// Get agents by category
export const getAgentsByCategory = (categoryId: string) => 
  agents.filter(a => a.category === categoryId);

// Search agents
export const searchAgents = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return agents.filter(a => 
    a.name.toLowerCase().includes(lowerQuery) ||
    a.role.toLowerCase().includes(lowerQuery) ||
    a.description.toLowerCase().includes(lowerQuery) ||
    a.skills.some(s => s.toLowerCase().includes(lowerQuery))
  );
};

// Stats
export const totalAgents = agents.length;
export const totalTasksCompleted = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);
