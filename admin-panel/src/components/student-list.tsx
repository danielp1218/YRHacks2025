"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { allStudents} from "@/util/fakeStudents"
import { supabase } from '@/util/supabase'
import { type Student } from '@/util/database.types'
import {calculateTotalAttendanceRate} from "@/util/studentStatistics";



// Filter for "my students" - in a real app this would be based on teacher's class
const myStudents = allStudents.filter((_, index) => index < 5)
type StudentListProps = {
    filter: 'my-students' | 'all-students'
}

export function StudentList({ filter }: StudentListProps) {
    const [students, setStudents] = useState<Student[]>([])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchStudents = async () => {
            const { data, error } = await supabase
                .from('Students')
                .select('*')
                .order('id');

            if (error) console.error(error);
            else setStudents(data);
        }

        fetchStudents();

        const channel = supabase
            .channel('realtime-students')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'Students',
                },
                (payload) => {
                    setStudents((prev) => {
                        const updated = payload.new as Student;
                        const idx = prev.findIndex((s) => s.id === updated.id);

                        if (payload.eventType === 'DELETE') {
                            return prev.filter((s) => s.id !== payload.old.id);
                        }

                        if (idx > -1) {
                            const copy = [...prev];
                            copy[idx] = updated;
                            return copy;
                        }

                        return [...prev, updated];
                    })
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, []);

    // Mock filter: take first 5 as "my students"
    const filteredByGroup =
        filter === 'my-students' ? students.slice(0, 5) : students;

    const filteredStudents = filteredByGroup.filter((student) => {
        const name = `${student.first_name ?? ''} ${student.last_name ?? ''}`
        return name.toLowerCase().includes(searchQuery.toLowerCase())
    });



    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search students..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Today</TableHead>
                            <TableHead>Attendance Rate</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.map((student) => {
                            const fullName = `${student.first_name ?? ''} ${
                                student.last_name ?? ''
                            }`
                            const rate = calculateTotalAttendanceRate(student);

                            return (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage
                                                    src={student.profile_photo ?? undefined}
                                                    alt={fullName}
                                                />
                                                <AvatarFallback>
                                                    {fullName.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium">{fullName}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{student.grade ?? '—'}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">N/A</Badge>
                                        {/* Replace with actual logic for "today" status if needed */}
                                    </TableCell>
                                    <TableCell>{rate}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/students/${student.id}`}>
                                            <Button variant="ghost" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

