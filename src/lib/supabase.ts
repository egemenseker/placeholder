import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
let supabase: any = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables missing:');
  console.warn('- VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗ Missing');
  console.warn('- VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗ Missing');
  console.warn('Please check your .env file and restart the dev server.');
} else if (!supabaseUrl.startsWith('https://') || supabaseUrl.endsWith('/')) {
  console.warn('⚠️ Invalid VITE_SUPABASE_URL format. Expected: https://<ref>.supabase.co');
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Supabase client:', error);
  }
}

export { supabase };

// Database types
export interface Database {
  public: {
    Tables: {
      coaches: {
        Row: {
          id: string
          firstName: string
          lastName: string
          email: string
          password?: string
          field: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          ranking: number
          description: string
          hasGapYear: boolean
          profilePhoto?: string
          tytScore: number
          university: string
          department: string
          attendedPrivateInstitution: boolean
          quotaFull: boolean
          price: number
          registeredDate: string
          adminNotes?: string
          created_at?: string
        }
        Insert: {
          id?: string
          firstName: string
          lastName: string
          email: string
          password?: string
          field: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          ranking: number
          description: string
          hasGapYear: boolean
          profilePhoto?: string
          tytScore: number
          university: string
          department: string
          attendedPrivateInstitution: boolean
          quotaFull: boolean
          price: number
          registeredDate: string
          adminNotes?: string
        }
        Update: {
          id?: string
          firstName?: string
          lastName?: string
          email?: string
          password?: string
          field?: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          ranking?: number
          description?: string
          hasGapYear?: boolean
          profilePhoto?: string
          tytScore?: number
          university?: string
          department?: string
          attendedPrivateInstitution?: boolean
          quotaFull?: boolean
          price?: number
          registeredDate?: string
          adminNotes?: string
        }
      }
      students: {
        Row: {
          id: string
          firstName: string
          lastName: string
          phone: string
          field: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          coachId: string
          hasPaid: boolean
          profilePhoto?: string
          registeredDate: string
          notes: string
          created_at?: string
        }
        Insert: {
          id?: string
          firstName: string
          lastName: string
          phone: string
          field: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          coachId: string
          hasPaid: boolean
          profilePhoto?: string
          registeredDate: string
          notes: string
        }
        Update: {
          id?: string
          firstName?: string
          lastName?: string
          phone?: string
          field?: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          coachId?: string
          hasPaid?: boolean
          profilePhoto?: string
          registeredDate?: string
          notes?: string
        }
      }
      programs: {
        Row: {
          id: string
          studentId: string
          coachId: string
          weekStart: string
          days: any
          createdAt: string
          created_at?: string
        }
        Insert: {
          id?: string
          studentId: string
          coachId: string
          weekStart: string
          days: any
          createdAt: string
        }
        Update: {
          id?: string
          studentId?: string
          coachId?: string
          weekStart?: string
          days?: any
          createdAt?: string
        }
      }
      trial_sessions: {
        Row: {
          id: string
          fullName: string
          phone: string
          field: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          createdAt: string
          created_at?: string
        }
        Insert: {
          id?: string
          fullName: string
          phone: string
          field: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          createdAt: string
        }
        Update: {
          id?: string
          fullName?: string
          phone?: string
          field?: 'EA' | 'SAY' | 'SÖZ' | 'DİL'
          createdAt?: string
        }
      }
    }
  }
}