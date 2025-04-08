import {supabase } from '@/util/supabase'


export const auth = async () =>{
    const res = await supabase.auth.getSession()
    if(res.error){
        console.log(res.error);
        return null;
    }
    return res.data.session;
}