"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { supabase } from "@/util/supabase"
import type { Student } from "@/util/database.types"
import { calculateTotalAttendanceRate, currentStatus } from "@/util/studentStatistics"
import { auth } from '@/util/auth'
import { type Session } from '@supabase/supabase-js'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type StudentListProps = {
  filter: "my-students" | "all-students"
}

export function StudentList({ filter }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentClassIndex, setCurrentClassIndex] = useState(0)
  const [statuses, setStatuses] = useState<Record<number, string>>({}) // Store statuses by student ID
  const [attendanceRates, setAttendanceRates] = useState<Record<number, string>>({}) // Store attendance rates by student ID
  const [classes, setClasses] = useState<string[]>([]);
  const [authData, setAuthData] = useState<Session | null>(null);

  const fetchStudentsByClass = async (className: string) => {
    const { data, error } = await supabase.rpc('get_students_by_class', {
      p_classname: className,
    });
  
    if (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  
    return data;
  }

  useEffect(() => {
    // Initial auth setup
    auth().then((result) => {
      setAuthData(result);
      console.log(result);
    });

    // Set up realtime updates
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

  // Fetch classes when auth data is available
  useEffect(() => {
    const fetchClasses = async () => {
      if (authData?.user.id === undefined) {
        console.log("not logged in");
        return;
      }
      const { data, error } = await supabase
        .from("Teachers")
        .select("*")
        .eq("teacherid", authData?.user?.id)
        .single();

      if (error) {
        console.log("error fetching teacher data");
      }
      console.log(data);
      if (data?.classes && data.classes.length > 0) {
        setClasses(data.classes);
        // Fetch students for the first class automatically
        const studentsData = await fetchStudentsByClass(data.classes[0]);
        setStudents(studentsData || []);
      }
    };

    fetchClasses();
  }, [authData]);

  // Fetch students when current class changes
  useEffect(() => {
    const fetchStudentsForClass = async () => {
      if (classes.length > 0 && currentClassIndex >= 0 && currentClassIndex < classes.length) {
        const className = classes[currentClassIndex];
        const studentsData = await fetchStudentsByClass(className);
        setStudents(studentsData || []);
      }
    };
    
    fetchStudentsForClass();
  }, [currentClassIndex, classes]);

  useEffect(() => {
    const fetchStatusesAndRates = async () => {
      const newStatuses: Record<number, string> = {}
      const newRates: Record<number, string> = {}
      
      for (const student of students) {
        newStatuses[student.id] = await currentStatus(student)
        newRates[student.id] = await calculateTotalAttendanceRate(student, classes[currentClassIndex])
      }
      
      setStatuses(newStatuses)
      setAttendanceRates(newRates)
    }

    fetchStatusesAndRates()
  }, [students]) // Re-fetch when students change

  const handleClassSelect = (index: number) => {
    setCurrentClassIndex(index);
  };

  // Filter students based on search query only (class filtering is now handled by fetchStudentsByClass)
  const filteredStudents = students.filter((student) => {
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
          <span className="text-sm font-medium">Class:</span>
          <Select onValueChange={(value) => handleClassSelect(Number(value))}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder={classes[currentClassIndex] || "No Classes"} />
            </SelectTrigger>
            <SelectContent>
              {classes.map((className, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {className}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attendance Rate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => {
              const fullName = `${student.first_name ?? ""} ${student.last_name ?? ""}`
              const rate = attendanceRates[student.id] || "—" // Use rate from state instead of calling the function
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
