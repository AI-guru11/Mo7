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
  void (async () => {
    try {
      const { error } = await supabase
        .from('customers')
        .select('count', { count: 'exact', head: true })

      if (error) {
        console.warn('M7: Supabase connection issue -', error.message)
      }
    } catch {
      console.warn('M7: Supabase unreachable - demo mode active')
    }
  })()
}
