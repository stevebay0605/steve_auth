import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://cznaeymoxgeosvbwrcjm.supabase.co"
const supabaseKey = "sb_publishable_Vc5z2yL2vHRzKaFMIHlVNw_dSefaeB4"
export const supabase = createClient(supabaseUrl, supabaseKey)