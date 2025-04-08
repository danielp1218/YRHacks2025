import {type Student} from "./database.types"

export const calculateTotalAttendanceRate = (student: Student) => {
    const classes = student.classes;
    let total = 0;
    let present = 0;
    for (const c of classes) {
        total += (c.count_present ?? 0) +
            (c.count_absent ?? 0) +
            (c.count_late ?? 0);
        present += (c.count_present ?? 0);
    }
    return total === 0 ? '—' : `${Math.round((present / total) * 100)}%`
}