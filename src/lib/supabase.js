import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aohrjqhuhpyiketaffnw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvaHJqcWh1aHB5aWtldGFmZm53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMzE5MTEsImV4cCI6MjA2MDYwNzkxMX0.jhuw__3VWelWix4NJBH179BIHGLIj_9C4ML8CIJN0'

export const supabase = createClient(supabaseUrl, supabaseKey)
