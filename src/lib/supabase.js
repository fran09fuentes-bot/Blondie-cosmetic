import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aohrjqhuhpyiketaffnw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvaHJqcWh1aHB5aWtldGFmZm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NTIxNjIsImV4cCI6MjA5MjAyODE2Mn0.jhuwVZc_3VWelWix4NJBHl79BIHGLIj_90C4ML8CIJN0'

export const supabase = createClient(supabaseUrl, supabaseKey)
