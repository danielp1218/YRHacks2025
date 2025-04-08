import {NextResponse} from 'next/server'
import {supabase} from '@/util/supabase' // use supabaseClient if staying public

export async function GET(request: Request, { params }: { params: { id: string } }) {

    const { id } = await params;

    const { data, error } = await supabase
        .from('History')
        .select('*')
        .eq('id', id)
        .order('created_at', {ascending: false})
        .limit(1)
        .single();

    if (error) {
        console.error('Supabase error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const isToday = data ? new Date(data.created_at).toDateString() === new Date().toDateString() : false;

    return NextResponse.json(isToday ? "Present" : "Absent");
}
