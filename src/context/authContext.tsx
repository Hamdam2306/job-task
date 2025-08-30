import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import client from '@/lib/pocketbase'

interface User {
    id: string
    username: string
    email: string
    [key: string]: any
}

interface AuthContextType {
    user: User | null
    loading: boolean
    logout: () => void
    checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        setLoading(true);  
        try {
            if (client.authStore.isValid && client.authStore.record) {
                const model = client.authStore.record;
                const userData: User = {
                    ...model,
                    id: model.id,
                    username: model.username,
                    email: model.email
                };
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
            client.authStore.clear();
        } finally {
            setLoading(false);
        }
    }

    const logout = () => {
        client.authStore.clear()
        setUser(null)
        router.push('/auth/login') 
    }

    const value: AuthContextType = {
        user,
        loading,
        logout,
        checkAuth
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
