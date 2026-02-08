import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, Shield, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from '../components/GlassCard'
import { NeonButton } from '../components/NeonButton'
import { StatusIndicator } from '../components/StatusIndicator'

export function Landing() {
  const [systemStatus, setSystemStatus] = useState<'loading' | 'online'>('loading')
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate system initialization
    const timer = setTimeout(() => {
      setSystemStatus('online')
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-neon-purple rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-neon-blue rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-neon-pink rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="border-b border-white/10 backdrop-blur-sm"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neon-gradient flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-neon-gradient bg-clip-text text-transparent">
                  M7
                </h1>
              </div>
              <StatusIndicator status={systemStatus} />
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <main className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-bold mb-6 bg-neon-gradient bg-clip-text text-transparent">
              Intelligent B2B Distribution
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Not just a tool, but a business partner. Aggressive growth meets smart operations.
            </p>
            <div className="flex gap-4 justify-center">
              <NeonButton variant="purple" size="lg" onClick={() => navigate('/dashboard')}>
                Get Started
              </NeonButton>
              <NeonButton variant="blue" size="lg">
                Learn More
              </NeonButton>
            </div>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <GlassCard hover className="h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-neon-purple/20 flex items-center justify-center mb-4 shadow-neon-purple">
                    <TrendingUp className="w-8 h-8 text-neon-purple" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Aggressive Growth</h3>
                  <p className="text-white/60">
                    Market intrusion modules analyze customer gaps and identify expansion opportunities.
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <GlassCard hover className="h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mb-4 shadow-neon-blue">
                    <Shield className="w-8 h-8 text-neon-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Smart Debt Management</h3>
                  <p className="text-white/60">
                    Visual warnings for high-risk credit customers. Track cash vs credit effortlessly.
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <GlassCard hover className="h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-neon-pink/20 flex items-center justify-center mb-4 shadow-neon-pink">
                    <BarChart3 className="w-8 h-8 text-neon-pink" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Peak Time Analysis</h3>
                  <p className="text-white/60">
                    Understand customer patterns and optimize your operations for maximum efficiency.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* System Status Panel */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <GlassCard className="border-2 border-neon-purple/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">System Status</h3>
                  <p className="text-white/60">
                    All systems operational. Ready for aggressive growth.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-purple">99.9%</div>
                    <div className="text-sm text-white/60">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-blue">24/7</div>
                    <div className="text-sm text-white/60">Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-pink">Real-time</div>
                    <div className="text-sm text-white/60">Updates</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
