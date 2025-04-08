import {type Student} from "./database.types"
import {supabase} from '@/util/supabase'

export const calculateTotalAttendanceRate = async (student: Student, classname: string) => {
    let total = 0;
    let present = 0;
    const { data, error } = await supabase
            .from('History')
            .select('*')
            .eq('id', student.id)
            .eq('classname', classname)
            .order('created_at', {ascending: false})

    if (!data) {
        return '—';
    }
    for (const record of data) {
        if (record.status === 'Present') {
            present++;
        }
        total++;
    }
    return total === 0 ? '—' : `${Math.round((present / total) * 100)}%`
}

export const currentStatus = async (student: Student, classname: string) => {
    try {
        const response = await fetch(`api/ispresent/${student.id}/${classname}`);
        if (!response.ok) {
            return "Absent";
        }
        const res = (await response.text()).replace('"', "").replace('"', "");
        return res || "Absent";
    } catch (error) {
        console.error("Error fetching current status:", error);
        return "Absent";
    }
};