import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  Users,
  AlertTriangle,
  Crown,
  Package,
  Calendar,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { GlassCard } from '../components/GlassCard'
import { getDashboardStats, getDemoStats } from '../lib/api'
import { formatCurrency } from '../lib/utils'
import type { DashboardStats } from '../lib/types'

// Animated counter component
function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const spring = useSpring(0, { duration: 2000 })
  const display = useTransform(spring, (current) =>
    Math.floor(current).toLocaleString('en-IN')
  )

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return (
    <motion.span>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </motion.span>
  )
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isZeroState, setIsZeroState] = useState(false)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats()

        // Check if we got real data (even if it's zero/empty)
        if (data) {
          setStats(data)
          setIsDemoMode(false)

          // Detect zero state (connected but no data yet)
          const hasNoData = data.totalOrders === 0 && data.totalCustomers === 0
          setIsZeroState(hasNoData)

          if (hasNoData) {
            console.log('📊 M7 System: Connected but no data yet - Zero state active')
          }
        } else {
          throw new Error('No data received')
        }
      } catch (error) {
        console.error('Failed to load stats, using demo mode:', error)
        setStats(getDemoStats())
        setIsDemoMode(true)
        setIsZeroState(false)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-neon-purple border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const COLORS = ['#a855f7', '#3b82f6', '#ec4899', '#06b6d4']

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="font-semibold text-yellow-500">Demo Mode Active</p>
              <p className="text-sm text-white/60">
                Supabase not connected. Add credentials to .env file. Showing static demo data.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Zero State Banner - Connected but no data */}
      {!isDemoMode && isZeroState && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 p-4 rounded-lg bg-neon-blue/10 border border-neon-blue/30"
        >
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-neon-blue" />
            <div>
              <p className="font-semibold text-neon-blue">Fresh Start - Database Connected</p>
              <p className="text-sm text-white/60">
                Supabase connected successfully! Run the db_schema.sql to populate with seed data, or start adding customers and orders.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 bg-neon-gradient bg-clip-text text-transparent">
          Distribution Dashboard
        </h1>
        <p className="text-white/60">Real-time insights for aggressive growth</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-neon-purple">
                  <AnimatedNumber value={stats.totalRevenue} prefix="₹" />
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-neon-purple/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-neon-purple" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Cash Sales</p>
                <p className="text-3xl font-bold text-neon-blue">
                  <AnimatedNumber value={stats.cashRevenue} prefix="₹" />
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-neon-blue" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Credit Sales</p>
                <p className="text-3xl font-bold text-neon-pink">
                  <AnimatedNumber value={stats.creditRevenue} prefix="₹" />
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-neon-pink/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-neon-pink" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard hover>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white/60 text-sm mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-neon-cyan">
                  <AnimatedNumber value={stats.totalOrders} />
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-neon-cyan" />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Customer Stats & Weekly Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Customer Stats */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="h-full">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-neon-purple" />
              Customer Insights
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Total Customers</span>
                <span className="text-2xl font-bold">{stats.totalCustomers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <span className="text-white/60">VIP</span>
                </div>
                <span className="text-xl font-bold text-yellow-500">{stats.vipCustomers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-white/60">At Risk</span>
                </div>
                <span className="text-xl font-bold text-red-500">{stats.riskCustomers}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Weekly Sales Chart */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <GlassCard className="h-full">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-neon-blue" />
              Weekly Sales Trend
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.weeklySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.5)' }}
                />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(17, 17, 17, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="cash" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="credit" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>
        </motion.div>
      </div>

      {/* Top Debtors & Product Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Debtors */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Top Debtors - Smart Debt Alert
            </h3>
            <div className="space-y-3">
              {stats.topDebtors.map((debtor, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={`p-3 rounded-lg border ${
                    debtor.debt > 100000
                      ? 'bg-red-500/10 border-red-500/30'
                      : debtor.debt > 50000
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{debtor.name}</span>
                    <span className="text-sm text-white/60">
                      Score: {debtor.trust_score}/100
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">{debtor.shop_name}</span>
                    <span className="font-bold text-red-400">
                      {formatCurrency(debtor.debt)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Product Performance */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-neon-purple" />
              Product Performance
            </h3>
            <div className="flex items-center justify-between mb-4">
              <ResponsiveContainer width="40%" height={180}>
                <PieChart>
                  <Pie
                    data={stats.productPerformance}
                    dataKey="revenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label={false}
                  >
                    {stats.productPerformance.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {stats.productPerformance.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-white/80">{product.name}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
}
