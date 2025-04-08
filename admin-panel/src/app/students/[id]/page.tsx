"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DashboardHeader } from "@/components/dashboard-header"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, Mail, Phone } from "lucide-react"
import { type Student } from "@/util/database.types"

// Mock student data
const studentData = {
    id: "1",
    name: "Alex Johnson",
    grade: "10th",
    email: "alex.johnson@school.edu",
    phone: "(555) 123-4567",
    image: "/placeholder.svg",
    classes: [
        { name: "Mathematics", teacher: "Ms. Johnson", attendance: 95 },
        { name: "Science", teacher: "Mr. Smith", attendance: 92 },
        { name: "English", teacher: "Mrs. Davis", attendance: 98 },
        { name: "History", teacher: "Mr. Wilson", attendance: 90 },
        { name: "Art", teacher: "Ms. Garcia", attendance: 100 },
    ],
    recentAttendance: [
        { date: "2023-04-05", status: true },
        { date: "2023-04-04", status: true },
        { date: "2023-04-03", status: false },
        { date: "2023-04-02", status: true },
        { date: "2023-04-01", status: true },
    ],
}

export default function StudentDetailPage({ params }: { params: { id: string } }) {
    const [attendanceByClass, setAttendanceByClass] = useState<Record<string, boolean>>(
        studentData.classes.reduce(
            (acc, cls, index) => {
                acc[index] = true
                return acc
            },
            {} as Record<string, boolean>,
        ),
    )

    const handleAttendanceChange = (classIndex: string, isPresent: boolean) => {
        setAttendanceByClass((prev) => ({
            ...prev,
            [classIndex]: isPresent,
        }))
    }

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
                                    <AvatarImage src={studentData.image} alt={studentData.name} />
                                    <AvatarFallback>
                                        {studentData.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1 text-center">
                                    <h2 className="text-xl font-bold">{studentData.name}</h2>
                                    <p className="text-sm text-muted-foreground">Grade: {studentData.grade}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{studentData.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{studentData.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Overall Attendance: 95%</span>
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
                                            {studentData.classes.map((cls, index) => (
                                                <div key={index} className="flex items-center justify-between border-b pb-2">
                                                    <div>
                                                        <p className="font-medium">{cls.name}</p>
                                                        <p className="text-sm text-muted-foreground">Teacher: {cls.teacher}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Checkbox
                                                            id={`attendance-${index}`}
                                                            checked={attendanceByClass[index]}
                                                            onCheckedChange={(checked) => handleAttendanceChange(index.toString(), checked === true)}
                                                        />
                                                        <Label htmlFor={`attendance-${index}`}>
                                                            {attendanceByClass[index] ? "Present" : "Absent"}
                                                        </Label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Recent Attendance</CardTitle>
                                        <CardDescription>Last 5 days of attendance records.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {studentData.recentAttendance.map((record, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <div className="font-medium">
                                                        {new Date(record.date).toLocaleDateString("en-US", {
                                                            weekday: "long",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </div>
                                                    <Badge variant={record.status ? "default" : "destructive"}>
                                                        {record.status ? "Present" : "Absent"}
                                                    </Badge>
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
                                            {studentData.classes.map((cls, index) => (
                                                <div key={index} className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-medium">{cls.name}</p>
                                                            <p className="text-sm text-muted-foreground">Teacher: {cls.teacher}</p>
                                                        </div>
                                                        <Badge variant={cls.attendance >= 90 ? "default" : "destructive"}>
                                                            {cls.attendance}% Attendance
                                                        </Badge>
                                                    </div>
                                                    <div className="h-2 w-full rounded-full bg-muted">
                                                        <div className="h-full rounded-full bg-primary" style={{ width: `${cls.attendance}%` }} />
                                                    </div>
                                                </div>
                                            ))}
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

