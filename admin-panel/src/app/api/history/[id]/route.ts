import {NextResponse, NextRequest} from 'next/server'
import {supabase} from '@/util/supabase'

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    const { id } = await context.params;

    const { data, error } = await supabase
        .from('History')
        .select('*')
        .eq('id', id)
        .order('created_at', {ascending: false})

        
    return NextResponse.json(data);
}
