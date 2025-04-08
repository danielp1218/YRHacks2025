'use client' // runs on the browser, NOT server

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {supabase} from '@/util/supabase'

export default function LoginPage() {
    const router = useRouter()
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        setError('')

        const { error } = await supabase.auth.signInWithPassword({ email, password }) // signing in with supabase

        if (error) {
            setError(error.message)
            return
        }

        router.push('/') // redirect to home
    }
    
    return (
        <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
            <form onSubmit={handleLogin} style={{ background: 'white', padding: 24, borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
                <h2>Teacher Login</h2>
                
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />

                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: 'block', width: '100%' }}
                />

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit" style={{ padding : 8, backgroundColor: 'black', color: 'white', width: '100%' }}>Sign In</button>
            </form>
        </div>
    )
}