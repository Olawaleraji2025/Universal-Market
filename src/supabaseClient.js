import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nqsfcuholgzhmznpjfwl.supabase.co'
const supabaseAnonKey = 'sb_publishable_TjRd414QFDHFXjBa8xErEw_g78IW6zF'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)