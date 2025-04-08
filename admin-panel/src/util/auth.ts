import {supabase } from '@/util/supabase'


export const auth = async () =>{
    const res = await supabase.auth.refreshSession()
    if(res.error){
        console.log(res.error);
    }
    return res;
}