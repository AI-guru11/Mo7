# M7 - Intelligent B2B Distribution Platform

## Core Vibe
- **Aesthetic:** Dark Mode, Neon Gradients (Purple/Blue/Pink), Glassmorphism (blur filters), Futuristic, Clean.
- **Philosophy:** "Aggressive Growth" & "Smart Operations". Not just a tool, but a business partner.

## Business Logic
- **Products:** Wholesale Vegetables (Specifically: Potatoes for frying, Onions).
- **Users:** Distributor (Admin) only. No client-facing app initially.
- **Key Pain Points:** Cash flow tracking (Cash vs Credit), Customer Retention, Peak time analysis.

## Tech Stack (Strict Constraints)
- **Frontend:** React 18 + Vite 5 (TypeScript strict mode).
- **Hosting:** GitHub Pages (`base: '/Mo7/'`).
- **Backend/DB:** Supabase (Client-side only, NO Node.js backend).
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`) + Framer Motion.
- **Icons:** Lucide-React.
- **PWA:** vite-plugin-pwa with Workbox (offline/installable).
- **PDF:** jsPDF + jspdf-autotable (invoice generation).
- **Charts:** Recharts (BarChart, PieChart on Dashboard).
- **Routing:** react-router-dom (BrowserRouter, basename `/Mo7`).

## Current Architecture (Stable)
```
src/
  App.tsx              # Router: / -> /dashboard, /landing, /dashboard
  main.tsx             # React entry point
  index.css            # Tailwind directives + glass/neon utilities
  pages/
    Landing.tsx        # Marketing page with system status
    Dashboard.tsx      # Central hub: KPIs, charts, debtors, CustomerRadar
  components/
    GlassCard.tsx      # Glassmorphism card wrapper
    NeonButton.tsx     # Neon-styled button (purple/blue/pink/cyan)
    StatusIndicator.tsx# Online/offline/loading indicator
    CustomerRadar.tsx  # Customer grid with status, debt, invoice generation
  lib/
    supabase.ts        # Single Supabase client (env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
    api.ts             # All Supabase queries + getDemoStats() fallback
    types.ts           # Full TypeScript interfaces (Customer, Product, Order, etc.)
    utils.ts           # cn(), formatCurrency(), formatDate()
    invoiceGenerator.ts# PDF invoice generation and download
```

## Deployment
- **Branch:** `main` (single production branch)
- **CI/CD:** `.github/workflows/deploy.yml` (GitHub Actions -> GitHub Pages)
- **Secrets:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (GitHub repo secrets)
- **Database:** Run `db_schema.sql` in Supabase SQL Editor to provision tables + seed data

## AI Growth Features
- **Market Intrusion Module:** Analyze customer gaps.
- **Smart Debt:** Visual warnings for high-risk credit customers (red/yellow/blue tiers).
