"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { allStudents} from "@/util/fakeStudents"

// Mock data for students


// Filter for "my students" - in a real app this would be based on teacher's class
const myStudents = allStudents.filter((_, index) => index < 5)

type StudentListProps = {
    filter: "my-students" | "all-students"
}

export function StudentList({ filter }: StudentListProps) {
    const [searchQuery, setSearchQuery] = useState("")

    // Determine which student list to show based on filter
    const students = filter === "my-students" ? myStudents : allStudents

    // Filter students based on search query
    const filteredStudents = students.filter((student) => student.name.toLowerCase().includes(searchQuery.toLowerCase()))

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
                        {filteredStudents.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={student.image} alt={student.name} />
                                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">{student.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{student.grade}</TableCell>
                                <TableCell>
                                    <Badge variant={student.attendanceToday ? "default" : "destructive"}>
                                        {student.attendanceToday ? "Present" : "Absent"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{student.attendanceRate}</TableCell>
                                <TableCell className="text-right">
                                    <Link href={`/students/${student.id}`}>
                                        <Button variant="ghost" size="sm">
                                            View
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

