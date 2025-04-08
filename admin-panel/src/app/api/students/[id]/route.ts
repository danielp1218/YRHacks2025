import { NextResponse } from 'next/server'
import { supabase } from '@/util/supabase' // use supabaseClient if staying public

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const studentId = params.id

    const { data: student, error } = await supabase
        .from('Students')
        .select('first_name, last_name, grade, profile_photo')
        .eq('id', studentId)
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // TODO do this later
    const classes: string[] = [];

    return NextResponse.json({
        name: `${student.first_name} ${student.last_name}`,
        grade: student.grade,
        image: student.profile_photo,
        classes,
    })
}
