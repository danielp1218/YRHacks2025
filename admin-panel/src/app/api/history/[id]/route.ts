import {NextResponse} from 'next/server'
import {supabase} from '@/util/supabase'

export async function GET(request: Request, { params }: { params: { id: string} }) {

    const { id } = await params;

    const { data, error } = await supabase
        .from('History')
        .select('*')
        .eq('id', id)
        .order('created_at', {ascending: false})

        
    return NextResponse.json(data);
}
