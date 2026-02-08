# M7 - Intelligent B2B Distribution Platform

> Not just a tool, but a business partner. Aggressive growth meets smart operations.

## 🎨 Core Vibe

- **Aesthetic:** Dark Mode, Neon Gradients (Purple/Blue/Pink), Glassmorphism
- **Philosophy:** "Aggressive Growth" & "Smart Operations"
- **Business:** Wholesale Vegetables Distribution (Potatoes, Onions)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase (Optional - Demo Mode Available)

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env`
3. Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Run the SQL schema in Supabase SQL Editor:
   - Open `db_schema.sql`
   - Copy all contents
   - Paste into Supabase SQL Editor
   - Execute

> **Note:** If you skip Supabase setup, the app will run in **Demo Mode** with static data!

### 3. Run Development Server

```bash
npm run dev
```

Visit: `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## 📊 Features

### Dashboard
- **Real-time KPIs:** Revenue, Cash/Credit Sales, Orders
- **Customer Insights:** VIP customers, Risk alerts, Trust scores
- **Smart Debt Management:** Visual warnings for high-risk customers
- **Weekly Sales Trends:** Interactive charts with cash vs credit breakdown
- **Product Performance:** Revenue analysis by product

### Data Heart (Database Schema)
- `customers` - Customer profiles with trust scores and debt tracking
- `products` - Inventory management for wholesale items
- `orders` - Order tracking with payment types
- `order_items` - Detailed order line items
- **Auto-triggers:** Automatic debt calculation and trust score updates
- **RLS Policies:** Secure data access

### AI Growth Features (Planned)
- Market Intrusion Module - Analyze customer gaps
- Peak Time Analysis - Optimize operations
- Retention Predictions - Identify at-risk customers

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Database | Supabase (PostgreSQL) |
| PDF Export | jsPDF + autoTable |
| PWA | Vite PWA Plugin |
| Hosting | GitHub Pages |

## 📁 Project Structure

```
/src
  /components      # Reusable UI components
    GlassCard.tsx
    NeonButton.tsx
    StatusIndicator.tsx
  /pages          # Application pages
    Dashboard.tsx
    Landing.tsx
  /lib            # Services and utilities
    api.ts        # Supabase API layer
    supabase.ts   # Supabase client
    types.ts      # TypeScript types
    utils.ts      # Helper functions
  /context        # Global state (future)
  /assets         # Static assets
```

## 🎯 Key Pain Points Solved

1. **Cash Flow Tracking** - Separate cash vs credit sales visualization
2. **Customer Retention** - Trust scores and status tracking (VIP/Active/Risk)
3. **Peak Time Analysis** - Weekly sales trends and patterns
4. **Debt Management** - Automatic debt tracking with visual alerts

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Environment variables for sensitive data
- Client-side only architecture (no backend server)

## 📱 PWA Features

- Installable on mobile and desktop
- Offline support
- Optimized caching strategy
- Fast load times

## 🎨 Design System

### Colors
- Neon Purple: `#a855f7`
- Neon Blue: `#3b82f6`
- Neon Pink: `#ec4899`
- Neon Cyan: `#06b6d4`
- Glass Black: `rgba(10, 10, 10, 0.8)`

### Components
- **GlassCard** - Glassmorphism container with optional hover effect
- **NeonButton** - Multi-variant button with glow effects
- **StatusIndicator** - Animated status display

## 📝 License

MIT

## 🤝 Contributing

This is an internal distributor tool. Contact the admin for access.

---

Built with 💜 using Claude Code
