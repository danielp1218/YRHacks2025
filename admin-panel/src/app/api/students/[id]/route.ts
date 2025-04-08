import {NextResponse, NextRequest} from 'next/server'
import {supabase} from '@/util/supabase' // use supabaseClient if staying public

export async function GET(request: NextRequest, { params }: { params: Promise<{ id:string[] }> }) {
    const { id } = await params;

    const { data: student, error } = await supabase
        .from('Students')
        .select('*')
        .eq('id', id)
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(student)
}
