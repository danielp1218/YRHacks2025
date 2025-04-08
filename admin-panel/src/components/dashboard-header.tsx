'use client'

import Link from "next/link"
import { Bell, Calendar, LogOut, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {auth} from '@/util/auth'
import {type AuthResponse} from '@supabase/supabase-js'
import {useEffect, useState} from 'react'

export function DashboardHeader() {
    const [authData, setAuthData] = useState<AuthResponse | null>(null);
    
    useEffect(() => {
        auth().then((result) => {
            setAuthData(result);
            console.log(result);
        });
    }, []);

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
                <Calendar className="h-6 w-6" />
                <span>Attendance Tracker</span>
            </Link>
            <nav className="ml-auto flex items-center gap-4">
                <Button variant="outline" size="icon">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                {
                                    // TODO: get actual picture
                                }
                                <AvatarImage src="/placeholder.svg" alt="Teacher" />
                                <AvatarFallback>
                                    {`${authData?.data.user?.user_metadata?.first_name?.[0] || ""}${authData?.data.user?.user_metadata?.last_name?.[0] || ""}`}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {`${authData?.data.user?.user_metadata?.first_name || ""} ${authData?.data.user?.user_metadata?.last_name || ""}`.trim()}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">{authData?.data.user?.email || "Guest"}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>
        </header>
    )
}

