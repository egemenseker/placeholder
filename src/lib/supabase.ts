import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      coaches: {
        Row: {
          id: string
          firstname: string
          lastname: string
          email: string
          password?: string
          field: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          ranking: number
          description: string
          hasgapyear: boolean
          profilephoto?: string
          tytscore: number
          university: string
          department: string
          attendedprivateinstitution: boolean
          quotafull: boolean
          price: number
          registereddate: string
          adminnotes?: string
          created_at?: string
        }
        Insert: {
          id?: string
          firstname: string
          lastname: string
          email: string
          password?: string
          field: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          ranking: number
          description: string
          hasgapyear: boolean
          profilephoto?: string
          tytscore: number
          university: string
          department: string
          attendedprivateinstitution: boolean
          quotafull: boolean
          price: number
          registereddate: string
          adminnotes?: string
        }
        Update: {
          id?: string
          firstname?: string
          lastname?: string
          email?: string
          password?: string
          field?: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          ranking?: number
          description?: string
          hasgapyear?: boolean
          profilephoto?: string
          tytscore?: number
          university?: string
          department?: string
          attendedprivateinstitution?: boolean
          quotafull?: boolean
          price?: number
          registereddate?: string
          adminnotes?: string
        }
      }
      students: {
        Row: {
          id: string
          firstname: string
          lastname: string
          phone: string
          field: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          coachid: string
          haspaid: boolean
          profilephoto?: string
          registereddate: string
          notes: string
          created_at?: string
        }
        Insert: {
          id?: string
          firstname: string
          lastname: string
          phone: string
          field: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          coachid: string
          haspaid: boolean
          profilephoto?: string
          registereddate: string
          notes: string
        }
        Update: {
          id?: string
          firstname?: string
          lastname?: string
          phone?: string
          field?: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          coachid?: string
          haspaid?: boolean
          profilephoto?: string
          registereddate?: string
          notes?: string
        }
      }
      programs: {
        Row: {
          id: string
          studentid: string
          coachid: string
          weekstart: string
          days: any
          createdat: string
          created_at?: string
        }
        Insert: {
          id?: string
          studentid: string
          coachid: string
          weekstart: string
          days: any
          createdat: string
        }
        Update: {
          id?: string
          studentid?: string
          coachid?: string
          weekstart?: string
          days?: any
          createdat?: string
        }
      }
      trial_sessions: {
        Row: {
          id: string
          fullname: string
          phone: string
          field: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          createdat: string
          created_at?: string
        }
        Insert: {
          id?: string
          fullname: string
          phone: string
          field: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          createdat: string
        }
        Update: {
          id?: string
          fullname?: string
          phone?: string
          field?: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          createdat?: string
        }
      }
    }
  }
}