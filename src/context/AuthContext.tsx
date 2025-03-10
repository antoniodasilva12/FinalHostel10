import React, { createContext, useContext, useEffect, useState } from 'react'
import { NavigateFunction } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  signUp: (email: string, password: string, fullName: string, nationalId: string, role: 'admin' | 'student') => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
  navigate: NavigateFunction
}

export function AuthProvider({ children, navigate }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function initializeAuth() {
      try {
        console.log('Initializing auth...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          if (mounted) setLoading(false)
          return
        }

        console.log('Session retrieved:', session ? 'exists' : 'none')
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user)
            const profileData = await fetchProfile(session.user.id)
            if (profileData) {
              setProfile(profileData)
            }
          } else {
            setUser(null)
            setProfile(null)
          }
          setLoading(false)
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event)
          if (mounted) {
            if (session?.user) {
              setUser(session.user)
              const profileData = await fetchProfile(session.user.id)
              if (profileData) {
                setProfile(profileData)
              }
            } else {
              setUser(null)
              setProfile(null)
            }
            setLoading(false)
          }
        })

        return () => {
          mounted = false
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          setLoading(false)
          setUser(null)
          setProfile(null)
        }
      }
    }

    initializeAuth()

    return () => {
      mounted = false
    }
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }

      if (!data) {
        console.error('No profile found for user:', userId)
        return null
      }

      console.log('Profile retrieved:', data)
      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  const redirectBasedOnRole = (role?: string) => {
    if (!role) {
      navigate('/login')
      return
    }

    switch (role) {
      case 'admin':
        navigate('/admin')
        break
      case 'student':
        navigate('/student')
        break
      default:
        navigate('/login')
    }
  }

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    nationalId: string,
    role: 'admin' | 'student'
  ) => {
    try {
      const { data: { user: newUser }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            national_id: nationalId,
            role,
          },
        },
      })

      if (error) throw error

      if (newUser) {
        // Wait for the profile to be created by the trigger
        await new Promise(resolve => setTimeout(resolve, 1000))
        const profileData = await fetchProfile(newUser.id)
        
        if (profileData) {
          setProfile(profileData)
          // If profile is created successfully, redirect to appropriate dashboard
          redirectBasedOnRole(profileData.role)
        } else {
          // If there's an issue with profile creation, redirect to login
          navigate('/login')
        }
      }
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data: { user: signedInUser }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (signedInUser) {
        const profileData = await fetchProfile(signedInUser.id)
        if (profileData) {
          setProfile(profileData)
          redirectBasedOnRole(profileData.role)
        } else {
          throw new Error('Profile not found')
        }
      }
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const value = {
    user,
    profile,
    signUp,
    signIn,
    signOut,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 