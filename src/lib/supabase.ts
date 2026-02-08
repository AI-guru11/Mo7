import { createClient } from '@supabase/supabase-js'

// Environment variables - Replace with your Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types will be generated here
export type Database = {
  public: {
    Tables: {
      // Add your table types here
    }
  }
}
