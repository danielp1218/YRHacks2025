import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentList } from "@/components/student-list"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardPage() {
  return (
      <div className="flex min-h-screen w-full flex-col">
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight">Student Attendance</h1>
            <div className="ml-auto flex items-center gap-2">
              <Link href="/attendance/take">
                <Button>Take Attendance</Button>
              </Link>
            </div>
          </div>
          <Tabs defaultValue="my-students" className="space-y-4">
            <TabsList>
              <TabsTrigger value="my-students">My Students</TabsTrigger>
              <TabsTrigger value="all-students">All Students</TabsTrigger>
            </TabsList>
            <TabsContent value="my-students" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Students</CardTitle>
                  <CardDescription>View and manage attendance for students in your class.</CardDescription>
                </CardHeader>
                <CardContent>
                  <StudentList filter="my-students" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="all-students" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Students</CardTitle>
                  <CardDescription>View all students in the school.</CardDescription>
                </CardHeader>
                <CardContent>
                  <StudentList filter="all-students" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}

