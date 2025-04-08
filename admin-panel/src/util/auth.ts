import { supabase } from '@/util/supabase'
import { redirect } from 'next/navigation'

export const auth = async () => {
    const res = await supabase.auth.getSession()
    if (res.error || !res.data.session) {
        console.log(res.error);
        redirect('/signin') // Redirect to sign-in page
    }
    return res.data.session;
}