// ============================================
// M7 Distribution Platform - TypeScript Types
// ============================================

export type CustomerStatus = 'active' | 'risk' | 'vip'
export type PaymentType = 'cash' | 'credit'

export interface Customer {
  id: string
  name: string
  shop_name: string
  phone: string
  location_geo: string | null
  trust_score: number
  total_debt: number
  status: CustomerStatus
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string | null
  stock_kg: number
  price_per_bag: number
  bag_weight_kg: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_id: string
  total_amount: number
  payment_type: PaymentType
  is_paid: boolean
  order_date: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity_bags: number
  quantity_kg: number
  price_per_bag: number
  subtotal: number
  created_at: string
}

// ============================================
// Extended Types with Joins
// ============================================

export interface CustomerSummary extends Customer {
  total_orders: number
  cash_sales: number
  credit_sales: number
  last_order_date: string | null
}

export interface ProductPerformance extends Product {
  times_ordered: number
  total_bags_sold: number
  total_kg_sold: number
  total_revenue: number
}

export interface DailySales {
  order_date: string
  total_orders: number
  total_sales: number
  cash_sales: number
  credit_sales: number
}

// ============================================
// Dashboard Stats Type
// ============================================

export interface DashboardStats {
  totalRevenue: number
  cashRevenue: number
  creditRevenue: number
  totalOrders: number
  totalCustomers: number
  riskCustomers: number
  vipCustomers: number
  topDebtors: Array<{
    name: string
    shop_name: string
    debt: number
    trust_score: number
  }>
  weeklySales: Array<{
    date: string
    cash: number
    credit: number
    total: number
  }>
  productPerformance: Array<{
    name: string
    revenue: number
    quantity: number
  }>
}

// ============================================
// Form Types
// ============================================

export interface CreateOrderForm {
  customer_id: string
  payment_type: PaymentType
  items: Array<{
    product_id: string
    quantity_bags: number
  }>
}

export interface UpdateStockForm {
  product_id: string
  stock_kg: number
}
