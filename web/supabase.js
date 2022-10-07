import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://vtrnebhplomlxakwhgpn.supabase.co', `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`)

export { supabase }