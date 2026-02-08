import { createClient } from '@supabase/supabase-js'

// ============================================
// M7 Distribution Platform - Supabase Client
// ============================================

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Connection test on initialization
if (supabaseUrl && supabaseAnonKey) {
  // Test connection
  void (async () => {
    try {
      const { error, count } = await supabase
        .from('customers')
        .select('count', { count: 'exact', head: true })

      if (error) {
        console.warn('⚠️ M7 System: Supabase connection issue -', error.message)
      } else {
        console.log('✅ M7 System: Connected to Supabase')
        console.log(`📊 M7 System: ${count || 0} customers in database`)
      }
    } catch (err) {
      console.warn('⚠️ M7 System: Supabase connection failed - Using demo mode')
    }
  })()
} else {
  console.warn('⚠️ M7 System: Missing Supabase credentials - Using demo mode')
}

// Check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Database types will be generated here
export type Database = {
  public: {
    Tables: {
      // Add your table types here
    }
  }
}
