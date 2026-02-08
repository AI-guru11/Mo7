// ============================================
// M7 Distribution Platform - API Service Layer
// ============================================

import { supabase } from './supabase'
import type {
  Customer,
  Product,
  Order,
  DashboardStats,
  CreateOrderForm,
  UpdateStockForm,
  CustomerSummary,
  ProductPerformance,
} from './types'

// ============================================
// CUSTOMERS
// ============================================

export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getCustomerSummaries(): Promise<CustomerSummary[]> {
  const { data, error } = await supabase
    .from('customer_summary')
    .select('*')
    .order('total_debt', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// ============================================
// PRODUCTS
// ============================================

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getProductPerformance(): Promise<ProductPerformance[]> {
  const { data, error } = await supabase
    .from('product_performance')
    .select('*')
    .order('total_revenue', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateStock(form: UpdateStockForm): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({
      stock_kg: form.stock_kg,
      updated_at: new Date().toISOString()
    })
    .eq('id', form.product_id)

  if (error) throw error
}

// ============================================
// ORDERS
// ============================================

export async function getOrders(limit = 50): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function createOrder(form: CreateOrderForm): Promise<Order> {
  // Calculate total amount
  const { data: products } = await supabase
    .from('products')
    .select('id, price_per_bag, bag_weight_kg, stock_kg')
    .in('id', form.items.map(item => item.product_id))

  if (!products) throw new Error('Products not found')

  const productMap = new Map(products.map(p => [p.id, p]))
  const totalAmount = form.items.reduce((sum, item) => {
    const product = productMap.get(item.product_id)
    return sum + (product?.price_per_bag || 0) * item.quantity_bags
  }, 0)

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: form.customer_id,
      total_amount: totalAmount,
      payment_type: form.payment_type,
      is_paid: form.payment_type === 'cash',
    })
    .select()
    .single()

  if (orderError) throw orderError

  // Create order items
  const orderItems = form.items.map(item => {
    const product = productMap.get(item.product_id)!
    return {
      order_id: order.id,
      product_id: item.product_id,
      quantity_bags: item.quantity_bags,
      quantity_kg: item.quantity_bags * product.bag_weight_kg,
      price_per_bag: product.price_per_bag,
      subtotal: item.quantity_bags * product.price_per_bag,
    }
  })

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) throw itemsError

  // Update stock
  for (const item of form.items) {
    const product = productMap.get(item.product_id)!
    const newStock = (products.find(p => p.id === item.product_id)?.stock_kg || 0) -
                     (item.quantity_bags * product.bag_weight_kg)

    await supabase
      .from('products')
      .update({ stock_kg: newStock })
      .eq('id', item.product_id)
  }

  return order
}

export async function markOrderPaid(orderId: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ is_paid: true })
    .eq('id', orderId)

  if (error) throw error
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats(): Promise<DashboardStats> {
  // Get all data in parallel
  const [
    { data: orders },
    { data: customers },
    { data: dailySales },
    { data: productPerf },
  ] = await Promise.all([
    supabase.from('orders').select('*'),
    supabase.from('customers').select('*'),
    supabase.from('daily_sales').select('*').limit(30),
    supabase.from('product_performance').select('*'),
  ])

  // Calculate total revenue
  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0
  const cashRevenue = orders?.filter(o => o.payment_type === 'cash')
    .reduce((sum, o) => sum + Number(o.total_amount), 0) || 0
  const creditRevenue = orders?.filter(o => o.payment_type === 'credit')
    .reduce((sum, o) => sum + Number(o.total_amount), 0) || 0

  // Customer stats
  const totalCustomers = customers?.length || 0
  const riskCustomers = customers?.filter(c => c.status === 'risk').length || 0
  const vipCustomers = customers?.filter(c => c.status === 'vip').length || 0

  // Top debtors
  const topDebtors = customers
    ?.sort((a, b) => Number(b.total_debt) - Number(a.total_debt))
    .slice(0, 5)
    .map(c => ({
      name: c.name,
      shop_name: c.shop_name,
      debt: Number(c.total_debt),
      trust_score: c.trust_score,
    })) || []

  // Weekly sales (last 7 days)
  const weeklySales = (dailySales || [])
    .slice(0, 7)
    .reverse()
    .map(d => ({
      date: d.order_date,
      cash: Number(d.cash_sales),
      credit: Number(d.credit_sales),
      total: Number(d.total_sales),
    }))

  // Product performance
  const productPerformance = (productPerf || [])
    .slice(0, 5)
    .map(p => ({
      name: p.name,
      revenue: Number(p.total_revenue || 0),
      quantity: Number(p.total_bags_sold || 0),
    }))

  return {
    totalRevenue,
    cashRevenue,
    creditRevenue,
    totalOrders: orders?.length || 0,
    totalCustomers,
    riskCustomers,
    vipCustomers,
    topDebtors,
    weeklySales,
    productPerformance,
  }
}

// ============================================
// DEMO MODE - Static Data Fallback
// ============================================

export function getDemoStats(): DashboardStats {
  return {
    totalRevenue: 2847500,
    cashRevenue: 1698500,
    creditRevenue: 1149000,
    totalOrders: 127,
    totalCustomers: 7,
    riskCustomers: 2,
    vipCustomers: 2,
    topDebtors: [
      { name: 'Sunita Devi', shop_name: 'Sunita Wholesale', debt: 125000, trust_score: 30 },
      { name: 'Priya Singh', shop_name: 'Singh Trading Co.', debt: 78000, trust_score: 45 },
      { name: 'Ravi Verma', shop_name: 'Verma Enterprises', debt: 45000, trust_score: 50 },
      { name: 'Neha Gupta', shop_name: 'Gupta Store', debt: 30000, trust_score: 60 },
      { name: 'Amit Sharma', shop_name: 'Sharma Fresh Mart', debt: 15000, trust_score: 70 },
    ],
    weeklySales: [
      { date: '2024-02-01', cash: 125000, credit: 85000, total: 210000 },
      { date: '2024-02-02', cash: 198000, credit: 112000, total: 310000 },
      { date: '2024-02-03', cash: 156000, credit: 94000, total: 250000 },
      { date: '2024-02-04', cash: 245000, credit: 165000, total: 410000 },
      { date: '2024-02-05', cash: 187000, credit: 123000, total: 310000 },
      { date: '2024-02-06', cash: 223000, credit: 147000, total: 370000 },
      { date: '2024-02-07', cash: 264000, credit: 189000, total: 453000 },
    ],
    productPerformance: [
      { name: 'Potato (Frying)', revenue: 1125000, quantity: 450 },
      { name: 'Onion (Red)', revenue: 684000, quantity: 380 },
      { name: 'Potato (Regular)', revenue: 560000, quantity: 280 },
      { name: 'Onion (White)', revenue: 478500, quantity: 299 },
    ],
  }
}
