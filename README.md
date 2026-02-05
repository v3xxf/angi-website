# Angi - Your AI Team Awaits

A premium, Apple-style pre-launch marketing website for Angi with user registration, Razorpay payments, and a post-purchase countdown to March 3rd launch.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + Framer Motion (animations)
- **Database:** Supabase (users, subscriptions)
- **Payments:** Razorpay
- **Hosting:** Vercel

## Features

- Modern, animated landing page with Apple-like design
- Interactive AI agent showcase
- Pricing tiers with monthly/yearly toggle
- User authentication (signup/login)
- Razorpay payment integration
- Post-payment welcome page with confetti
- Dashboard with countdown timer to launch
- Fully responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Razorpay account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

4. Fill in your environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

### Supabase Setup

Run these SQL commands in your Supabase SQL editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  plan TEXT DEFAULT 'free',
  razorpay_customer_id TEXT,
  razorpay_subscription_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plan TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  razorpay_payment_id TEXT,
  amount INTEGER,
  currency TEXT DEFAULT 'USD',
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Waitlist table
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  plan_interest TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Policies (adjust as needed)
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

## Deploy to Vercel

1. Push your code to a GitHub repository

2. Go to [Vercel](https://vercel.com) and import your repository

3. Add your environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)

4. Deploy!

5. Configure your custom domain (angi.ai or angideck.com) in Vercel settings

## Project Structure

```
angi-website/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── login/page.tsx           # Login page
│   ├── signup/page.tsx          # Signup page
│   ├── checkout/[plan]/page.tsx # Payment page
│   ├── welcome/page.tsx         # Post-payment welcome
│   ├── dashboard/page.tsx       # User dashboard
│   └── api/
│       └── razorpay/            # Payment API routes
├── components/
│   ├── ui/                      # Base components
│   ├── landing/                 # Landing page sections
│   ├── auth/                    # Auth forms
│   └── dashboard/               # Dashboard components
├── lib/
│   ├── supabase.ts              # Supabase client
│   ├── razorpay.ts              # Razorpay utils
│   ├── constants.ts             # App constants
│   └── utils.ts                 # Helper functions
└── public/                      # Static assets
```

## Pricing Tiers

| Plan | Monthly | Yearly | Agents |
|------|---------|--------|--------|
| Free | $0 | $0 | Angi only |
| Starter | $39 | $390 | Angi + 2 |
| Pro | $99 | $990 | All 7 |
| Enterprise | $399 | $3,990 | All + Custom |

## AI Agent Team

1. **Angi** - Chief of Staff / Orchestrator
2. **Maya** - Communications Director
3. **Kai** - Schedule Architect
4. **Nova** - Research Analyst
5. **Aria** - Finance Guardian
6. **Zara** - Content Creator
7. **Rex** - Operations Manager

## License

Private - All rights reserved
