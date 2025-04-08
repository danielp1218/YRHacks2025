import { NextResponse } from 'next/server'
import { supabase } from '@/util/supabase' // use supabaseClient if staying public

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const studentId = params.id

    const { data: student, error } = await supabase
        .from('Students')
        .select('id, first_name, last_name, grade, profile_photo, log')
        .eq('id', studentId)
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // TODO do this later
    const classes: string[] = [];

    return NextResponse.json({
        id: student.id,
        name: `${student.first_name} ${student.last_name}`,
        grade: student.grade,
        image: student.profile_photo,
        classes,
        log: student.log,
    })
}
