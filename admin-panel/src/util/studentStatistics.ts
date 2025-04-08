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

export const currentStatus = async (student: Student) => {
    try {
        const response = await fetch(`api/ispresent/${student.id}/`);
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