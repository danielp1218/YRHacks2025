"use client"


import { use, useEffect, useState } from "react"
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

export default function StudentDetailPage({ studentId }: { studentId: string }) {
    const [student, setStudent] = useState<Student | null>(null)
    const [history, setHistory] = useState<any[]>([])
  
    useEffect(() => {
      const fetchStudentAndHistory = async () => {
        const res = await fetch(`/api/students/${studentId}`)
        const data: Student = await res.json()
        setStudent(data)
  
        const historyRes = await fetch(`/api/history?studentId=${studentId}`)
        const historyData = await historyRes.json()
        setHistory(historyData)
      }
      fetchStudentAndHistory()
    }, [studentId])
  
    if (!student) return <div>Loading...</div>
  
    const fullName = `${student.first_name ?? ''} ${student.last_name ?? ''}`.trim()
  
    return (
      <div className="flex min-h-screen w-full flex-col">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
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
                      {fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 text-center">
                    <h2 className="text-xl font-bold">{fullName}</h2>
                    <p className="text-sm text-muted-foreground">Grade: {student.grade ?? '—'}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{student.id}@gapps.yrdsb.ca</span>
                </div>
              </CardContent>
            </Card>
  
            <Card>
              <CardHeader>
                <CardTitle>Attendance Log</CardTitle>
                <CardDescription>History of check-ins.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {history.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No attendance history found.</p>
                  ) : (
                    history.map((entry, i) => (
                      <div key={i} className="flex justify-between text-sm border-b py-1">
                        <span>{new Date(entry.created_at).toLocaleString()}</span>
                        <span>{entry.class}</span>
                        <span>{entry.status}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }