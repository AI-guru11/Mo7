import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Crown, CheckCircle, Printer, Phone, MapPin } from 'lucide-react'
import { GlassCard } from './GlassCard'
import { getCustomers } from '../lib/api'
import { supabase } from '../lib/supabase'
import { downloadInvoice } from '../lib/invoiceGenerator'
import { formatCurrency } from '../lib/utils'
import type { Customer, Order } from '../lib/types'

interface CustomerWithOrders extends Customer {
  lastOrder?: Order
}

export function CustomerRadar() {
  const [customers, setCustomers] = useState<CustomerWithOrders[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingInvoice, setGeneratingInvoice] = useState<string | null>(null)

  useEffect(() => {
    async function loadCustomers() {
      try {
        const customerData = await getCustomers()

        const customersWithOrders = await Promise.all(
          customerData.map(async (customer) => {
            const { data: orders } = await supabase
              .from('orders')
              .select('*')
              .eq('customer_id', customer.id)
              .order('created_at', { ascending: false })
              .limit(1)

            return {
              ...customer,
              lastOrder: orders?.[0] || undefined,
            }
          })
        )

        setCustomers(customersWithOrders)
      } catch (error) {
        console.error('Failed to load customers:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [])

  async function handleGenerateInvoice(customer: CustomerWithOrders) {
    if (!customer.lastOrder) {
      alert('No orders found for this customer')
      return
    }

    setGeneratingInvoice(customer.id)

    try {
      const { data: orderItems } = await supabase
        .from('order_items')
        .select('*, products(*)')
        .eq('order_id', customer.lastOrder.id)

      if (!orderItems || orderItems.length === 0) {
        alert('No order items found')
        return
      }

      const invoiceData = {
        order: customer.lastOrder,
        customer: customer,
        items: orderItems.map((item: any) => ({
          product: item.products,
          quantity_bags: item.quantity_bags,
          quantity_kg: item.quantity_kg,
          price_per_bag: item.price_per_bag,
          subtotal: item.subtotal,
        })),
      }

      downloadInvoice(invoiceData)
    } catch (error) {
      console.error('Failed to generate invoice:', error)
      alert('Failed to generate invoice')
    } finally {
      setGeneratingInvoice(null)
    }
  }

  function getStatusConfig(status: string, debt: number) {
    if (status === 'risk' || debt > 50000) {
      return {
        label: 'RISK',
        icon: AlertTriangle,
        colorClass: 'text-red-500',
        bgClass: 'bg-red-500/10',
        borderClass: 'border-red-500/30',
        glowClass: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
      }
    }

    if (status === 'vip') {
      return {
        label: 'VIP',
        icon: Crown,
        colorClass: 'text-yellow-500',
        bgClass: 'bg-yellow-500/10',
        borderClass: 'border-yellow-500/30',
        glowClass: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
      }
    }

    return {
      label: 'ACTIVE',
      icon: CheckCircle,
      colorClass: 'text-neon-cyan',
      bgClass: 'bg-neon-cyan/10',
      borderClass: 'border-neon-cyan/30',
      glowClass: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white/60">Loading customer intelligence...</div>
      </div>
    )
  }

  if (customers.length === 0) {
    return (
      <GlassCard className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-white/80 text-lg font-semibold">No Customers Yet</p>
        <p className="text-white/60 text-sm mt-2">
          Run db_schema.sql in Supabase to populate seed data
        </p>
      </GlassCard>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {customers.map((customer, index) => {
        const config = getStatusConfig(customer.status, customer.total_debt)
        const StatusIcon = config.icon

        return (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <GlassCard
              hover
              className={`relative border-2 ${config.borderClass} ${config.glowClass}`}
            >
              <div className="absolute top-3 right-3">
                <div
                  className={`px-2 py-1 rounded text-xs font-bold ${config.bgClass} ${config.colorClass} flex items-center gap-1`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {config.label}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-1">{customer.name}</h3>
                <p className="text-white/60 text-sm">{customer.shop_name}</p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                {customer.location_geo && (
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{customer.location_geo}</span>
                  </div>
                )}
              </div>

              <div className="py-3 px-4 rounded-lg bg-white/5 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/60">Total Debt</span>
                  <span className="text-xs text-white/60">Trust Score</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-bold ${config.colorClass}`}>
                    {formatCurrency(customer.total_debt)}
                  </span>
                  <span className="text-lg font-bold text-white">
                    {customer.trust_score}/100
                  </span>
                </div>
              </div>

              {customer.lastOrder && (
                <button
                  onClick={() => handleGenerateInvoice(customer)}
                  disabled={generatingInvoice === customer.id}
                  className="w-full py-2 px-4 rounded-lg bg-neon-purple/20 border-2 border-neon-purple text-neon-purple font-semibold hover:bg-neon-purple/30 hover:shadow-neon-purple transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Printer className="w-4 h-4" />
                  {generatingInvoice === customer.id ? 'Generating...' : 'Generate Invoice'}
                </button>
              )}

              {!customer.lastOrder && (
                <div className="text-center py-2 text-white/40 text-sm">No orders yet</div>
              )}
            </GlassCard>
          </motion.div>
        )
      })}
    </div>
  )
}
