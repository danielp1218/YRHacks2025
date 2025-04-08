import {NextResponse} from 'next/server'
import {supabase} from '@/util/supabase'

export async function GET(request: Request, { params }: { params: { id: string, classname: string } }) {

    const { id, classname } = await params;

    const { data, error } = await supabase
        .from('History')
        .select('*')
        .eq('id', id)
        .eq('class', classname)
        .order('created_at', {ascending: false})
        .limit(1)
        .single();

    if (error) {
        console.error('Supabase error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if(data == null){
        console.error('No data found for the given ID:', id);
        return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }


    const isToday = data ? new Date(data.created_at).toDateString() === new Date().toDateString() : false;
    console.log("isToday: ", isToday);
    return NextResponse.json(isToday ? "Present" : "Absent");
}
