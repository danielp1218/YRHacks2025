import {createClient } from "@supabase/supabase-js"

// @ts-ignore
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_LINK, process.env.NEXT_PUBLIC_SUPABASE_API_KEY);