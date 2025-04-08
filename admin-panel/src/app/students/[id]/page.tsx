"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DashboardHeader } from "@/components/dashboard-header"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Mail } from "lucide-react"
import { type Student } from "@/util/database.types"
import { calculateTotalAttendanceRate } from "@/util/studentStatistics"


export default function StudentDetailPage({ params }: { params: { id: string } }) {
    const [student, setStudent] = useState<Student | null>(null)
    const [attendanceByClass, setAttendanceByClass] = useState<Record<string, boolean>>({})

    useEffect(() => {
        const fetchStudent = async () => {
            const {id} = await params
            const res = await fetch(`/api/students/${id}`)
            const data: Student = await res.json()
            setStudent(data)

            const initialAttendance: Record<string, boolean> = {}
            data.classes.forEach((_, idx) => {
                initialAttendance[idx] = true
            })
            setAttendanceByClass(initialAttendance)
        }

        fetchStudent()
    }, [params])

    const handleAttendanceChange = (classIndex: string, isPresent: boolean) => {
        setAttendanceByClass((prev) => ({
            ...prev,
            [classIndex]: isPresent,
        }))
    }

    if (!student) return <div>Loading...</div>

    const fullName = `${student.first_name ?? ''} ${student.last_name ?? ''}`.trim()

    return (
        <div className="flex min-h-screen w-full flex-col">
            <DashboardHeader />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Student Profile</h1>
                </div>

                <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col items-center space-y-2">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={student.profile_photo ?? '/placeholder.svg'} alt={fullName} />
                                    <AvatarFallback>
                                        {fullName
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 text-center">
                                    <h2 className="text-xl font-bold">{fullName}</h2>
                                    <p className="text-sm text-muted-foreground">Grade: {student.grade ?? '—'}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{student.id}@gapps.yrdsb.ca</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Overall Attendance: {calculateTotalAttendanceRate(student)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Tabs defaultValue="attendance">
                            <TabsList>
                                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                                <TabsTrigger value="classes">Classes</TabsTrigger>
                            </TabsList>

                            <TabsContent value="attendance" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Today's Attendance</CardTitle>
                                        <CardDescription>Mark attendance for each class today.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {student.classes.map((cls, index) => (
                                                <div key={index} className="flex items-center justify-between border-b pb-2">
                                                    <div>
                                                        <p className="font-medium">Class #{index + 1}</p>
                                                        <p className="text-sm text-muted-foreground">Teacher: {cls.teacher}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            id={`attendance-${index}`}
                                                            checked={attendanceByClass[index]}
                                                            onCheckedChange={(checked) =>
                                                                handleAttendanceChange(index.toString(), checked === true)
                                                            }
                                                        />
                                                        <Label htmlFor={`attendance-${index}`}>
                                                            {attendanceByClass[index] ? 'Present' : 'Absent'}
                                                        </Label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="classes">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Class Performance</CardTitle>
                                        <CardDescription>Attendance rates for each class.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {student.classes.map((cls, index) => {
                                                const present = cls.count_present ?? 0
                                                const total = present + (cls.count_late ?? 0) + (cls.count_absent ?? 0)
                                                const attendance = total > 0 ? Math.round((present / total) * 100) : 0

                                                return (
                                                    <div key={index} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-medium">Class #{index + 1}</p>
                                                                <p className="text-sm text-muted-foreground">Teacher: {cls.teacher}</p>
                                                            </div>
                                                            <Badge variant={attendance >= 90 ? 'default' : 'destructive'}>
                                                                {attendance}% Attendance
                                                            </Badge>
                                                        </div>
                                                        <div className="h-2 w-full rounded-full bg-muted">
                                                            <div
                                                                className="h-full rounded-full bg-primary"
                                                                style={{ width: `${attendance}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    )
}