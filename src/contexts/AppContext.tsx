import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Coach, Student, Program, TrialSession } from '../types';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'coach';
  coachId?: string;
}

interface AppContextType {
  user: User | null;
  coaches: Coach[];
  students: Student[];
  programs: Program[];
  trialSessions: TrialSession[];
  loading: boolean;
  login: (email: string, password: string, role: 'admin' | 'coach') => Promise<boolean>;
  logout: () => void;
  addCoach: (coach: Omit<Coach, 'id'>) => Promise<void>;
  updateCoach: (id: string, coach: Partial<Coach>) => Promise<void>;
  deleteCoach: (id: string) => Promise<void>;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  assignStudentToCoach: (studentId: string, coachId: string) => Promise<void>;
  addProgram: (program: Omit<Program, 'id'>) => Promise<void>;
  updateProgram: (id: string, program: Partial<Program>) => Promise<void>;
  addTrialSession: (session: Omit<TrialSession, 'id' | 'createdAt'>) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [trialSessions, setTrialSessions] = useState<TrialSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase
  const loadCoaches = async () => {
    try {
      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .order('ranking', { ascending: true });
      
      if (error) throw error;
      setCoaches(data || []);
    } catch (error) {
      console.error('Error loading coaches:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('registeredDate', { ascending: false });
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const loadTrialSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('trial_sessions')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (error) throw error;
      setTrialSessions(data || []);
    } catch (error) {
      console.error('Error loading trial sessions:', error);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([
      loadCoaches(),
      loadStudents(),
      loadPrograms(),
      loadTrialSessions()
    ]);
    setLoading(false);
  };

  // Initialize data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'coach'): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Admin login
      if (role === 'admin' && email === 'admin@yks.com' && password === 'admin123') {
        setUser({ id: 'admin', email, role: 'admin' });
        return true;
      }
      
      // Coach login - check against coaches table
      if (role === 'coach') {
        const { data: coach, error } = await supabase
          .from('coaches')
          .select('*')
          .eq('email', email)
          .single();
        
        if (error || !coach || coach.password !== password) {
          return false;
        }
        
        setUser({ id: coach.id, email, role: 'coach', coachId: coach.id });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addCoach = async (coach: Omit<Coach, 'id'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coaches')
        .insert([coach])
        .select()
        .single();
      
      if (error) throw error;
      
      setCoaches(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding coach:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCoach = async (id: string, updatedCoach: Partial<Coach>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('coaches')
        .update(updatedCoach)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setCoaches(prev => prev.map(coach => 
        coach.id === id ? { ...coach, ...data } : coach
      ));
    } catch (error) {
      console.error('Error updating coach:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCoach = async (id: string) => {
    try {
      setLoading(true);
      
      // First delete all students assigned to this coach
      await supabase
        .from('students')
        .delete()
        .eq('coachId', id);
      
      // Then delete the coach
      const { error } = await supabase
        .from('coaches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCoaches(prev => prev.filter(coach => coach.id !== id));
      setStudents(prev => prev.filter(student => student.coachId !== id));
    } catch (error) {
      console.error('Error deleting coach:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (student: Omit<Student, 'id'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .insert([student])
        .select()
        .single();
      
      if (error) throw error;
      
      setStudents(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStudent = async (id: string, updatedStudent: Partial<Student>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .update(updatedStudent)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setStudents(prev => prev.map(student => 
        student.id === id ? { ...student, ...data } : student
      ));
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setStudents(prev => prev.filter(student => student.id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const assignStudentToCoach = async (studentId: string, coachId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .update({ coachId })
        .eq('id', studentId)
        .select()
        .single();
      
      if (error) throw error;
      
      setStudents(prev => prev.map(student => 
        student.id === studentId ? { ...student, coachId } : student
      ));
    } catch (error) {
      console.error('Error assigning student to coach:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addProgram = async (program: Omit<Program, 'id'>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('programs')
        .insert([program])
        .select()
        .single();
      
      if (error) throw error;
      
      setPrograms(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding program:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProgram = async (id: string, updatedProgram: Partial<Program>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('programs')
        .update(updatedProgram)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setPrograms(prev => prev.map(program => 
        program.id === id ? { ...program, ...data } : program
      ));
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addTrialSession = async (session: Omit<TrialSession, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      const sessionWithTimestamp = {
        ...session,
        createdAt: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('trial_sessions')
        .insert([sessionWithTimestamp])
        .select()
        .single();
      
      if (error) throw error;
      
      setTrialSessions(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding trial session:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      coaches,
      students,
      programs,
      trialSessions,
      loading,
      login,
      logout,
      addCoach,
      updateCoach,
      deleteCoach,
      addStudent,
      updateStudent,
      deleteStudent,
      assignStudentToCoach,
      addProgram,
      updateProgram,
      addTrialSession,
      refreshData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}