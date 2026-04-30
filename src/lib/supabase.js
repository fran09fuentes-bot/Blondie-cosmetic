import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aohrjqhuhpyiketaffnw.supabase.co'
const supabaseKey = 'PEGA_AQUI_TU_CLAVE_ANON_eyJ...'

export const supabase = createClient(supabaseUrl, supabaseKey)
