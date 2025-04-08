"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { allStudents } from "@/util/fakeStudents"
import { supabase } from "@/util/supabase"
import type { Student } from "@/util/database.types"
import { calculateTotalAttendanceRate, currentStatus } from "@/util/studentStatistics"
import {auth} from '@/util/auth'
import {type Session} from '@supabase/supabase-js'

// Filter for "my students" - in a real app this would be based on teacher's class
const myStudents = allStudents.filter((_, index) => index < 5)
type StudentListProps = {
  filter: "my-students" | "all-students"
}

export function StudentList({ filter }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [period, setPeriod] = useState(1)
  const [statuses, setStatuses] = useState<Record<number, string>>({}) // Store statuses by student ID
    const [classes, setClasses] = useState([]);
    const [authData, setAuthData] = useState<Session | null>(null);
    

  useEffect(() => {
    const fetchStudents = async () => {
      const { data, error } = await supabase.from("Students").select("*").order("id")

      if (error) console.error(error)
      else setStudents(data)
    }

    fetchStudents()

    // do auth
    auth().then((result) => {
        setAuthData(result);
        console.log(result);
    });

    const fetchClasses = async ()=>{
        if(authData?.user.id === undefined){
            console.log("not logged in")
            return;
        }
        const {data, error} = await supabase
            .from("Teachers")
            .select("*")
            .eq("teacherid", authData?.user?.id)
            .single()

        if(error){
            console.log("error fetching teacher data");
        }
        console.log(data);
        setClasses(data);
    }

    fetchClasses();

    const channel = supabase
      .channel("realtime-students")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Students",
        },
        (payload) => {
          setStudents((prev) => {
            const updated = payload.new as Student
            const idx = prev.findIndex((s) => s.id === updated.id)

            if (payload.eventType === "DELETE") {
              return prev.filter((s) => s.id !== payload.old.id)
            }

            if (idx > -1) {
              const copy = [...prev]
              copy[idx] = updated
              return copy
            }

            return [...prev, updated]
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    const fetchStatuses = async () => {
      const newStatuses: Record<number, string> = {}
      for (const student of students) {
        newStatuses[student.id] = await currentStatus(student)
      }
      setStatuses(newStatuses)
    }

    fetchStatuses()
  }, [students, period]) // Re-fetch statuses when students or period changes

  // Mock filter: take first 5 as "my students"
  const filteredByGroup = filter === "my-students" ? students.slice(0, 5) : students

  const filteredStudents = filteredByGroup.filter((student) => {
    const name = `${student.first_name ?? ""} ${student.last_name ?? ""}`
    return name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const statusToColor = (status: string) => {
    switch (status.trim().toLowerCase()) {
      case "present":
        return "rgb(200, 255, 200)"
      case "absent":
        return "rgb(255, 150, 150)"
      case "late":
        return "rgb(255, 200, 100)"
      default:
        return "gray"
    }
  }

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
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Period:</span>
          <Input
            type="number"
            min={1}
            max={5}
            value={period}
            onChange={(e) => setPeriod(Math.min(5, Math.max(1, Number.parseInt(e.target.value) || 1)))}
            className="w-16"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Status (Period {period})</TableHead>
              <TableHead>Attendance Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => {
              const fullName = `${student.first_name ?? ""} ${student.last_name ?? ""}`
              const rate = calculateTotalAttendanceRate(student)
              const status = statuses[student.id] || "Loading..." // Use status from state
              return (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={student.profile_photo ?? undefined} alt={fullName} />
                        <AvatarFallback>{fullName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{fullName}</div>
                    </div>
                  </TableCell>
                  <TableCell>{student.grade ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" style={{ backgroundColor: statusToColor(status) }}>
                      {status}
                    </Badge>
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
