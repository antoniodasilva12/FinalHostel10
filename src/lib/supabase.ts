import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pegfjuauekljfoybcmzv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlZ2ZqdWF1ZWtsamZveWJjbXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5ODk5NzAsImV4cCI6MjAyNTU2NTk3MH0.Uh_Kj-HHGxrWEVhvxRVJOFI_dWvYEVKXgHjJNhqoJ6k'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for your database tables
export interface Profile {
  id: string // UUID from auth.users
  created_at: string
  email: string
  full_name: string
  national_id: string
  role: 'admin' | 'student'
  avatar_url?: string
  updated_at?: string
  phone?: string
  emergency_contact?: string
}

export interface Room {
  id: string
  room_number: string
  room_type: 'single' | 'double' | 'triple'
  is_available: boolean
  student_id: string | null
}

export interface Booking {
  id: number
  created_at: string
  student_id: string
  room_id: number
  check_in_date: string
  check_out_date: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
}

export interface Payment {
  id: number
  created_at: string
  booking_id: number
  amount: number
  payment_date: string
  payment_method: string
  status: 'pending' | 'completed' | 'failed'
}

export interface MaintenanceRequest {
  id: string
  room_number: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  student_id: string
  created_at: string
}

export interface ResourceUsage {
  id: string
  student_id: string
  date: string
  water_usage: number
  electricity_usage: number
  created_at: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  is_read: boolean
  created_at: string
  user_id: string
}

export interface ChatMessage {
  id: string
  student_id: string
  message: string
  response: string
  created_at: string
} 