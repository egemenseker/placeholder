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
  login: (email: string, password: string, role: 'admin' | 'coach') => Promise<boolean>;
  logout: () => void;
  addCoach: (coach: Omit<Coach, 'id'>) => void;
  updateCoach: (id: string, coach: Partial<Coach>) => void;
  deleteCoach: (id: string) => void;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  assignStudentToCoach: (studentId: string, coachId: string) => void;
  addProgram: (program: Omit<Program, 'id'>) => void;
  updateProgram: (id: string, program: Partial<Program>) => void;
  addTrialSession: (session: Omit<TrialSession, 'id' | 'createdAt'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [trialSessions, setTrialSessions] = useState<TrialSession[]>([]);

  // Load data from Supabase
  const loadCoaches = async () => {
    try {
      const { data, error } = await supabase
        .from('coaches')
        .select(`
          id,
          firstname,
          lastname,
          email,
          password,
          field,
          ranking,
          description,
          hasgapyear,
          profilephoto,
          tytscore,
          university,
          department,
          attendedprivateinstitution,
          quotafull,
          price,
          registereddate,
          adminnotes,
          created_at
        `)
        .order('registereddate', { ascending: false });
      
      if (error) throw error;
      
      // Convert flat case to camelCase for frontend
      const formattedCoaches = data?.map(coach => ({
        id: coach.id,
        firstName: coach.firstname,
        lastName: coach.lastname,
        email: coach.email,
        password: coach.password,
        field: coach.field,
        ranking: coach.ranking,
        description: coach.description,
        hasGapYear: coach.hasgapyear,
        profilePhoto: coach.profilephoto,
        tytScore: coach.tytscore,
        university: coach.university,
        department: coach.department,
        attendedPrivateInstitution: coach.attendedprivateinstitution,
        quotaFull: coach.quotafull,
        price: coach.price,
        registeredDate: coach.registereddate,
        adminNotes: coach.adminnotes
      })) || [];
      
      setCoaches(formattedCoaches);
    } catch (error) {
      console.error('Error loading coaches:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          firstname,
          lastname,
          phone,
          field,
          coachid,
          haspaid,
          profilephoto,
          registereddate,
          notes,
          created_at
        `)
        .order('registereddate', { ascending: false });
      
      if (error) throw error;
      
      // Convert flat case to camelCase for frontend
      const formattedStudents = data?.map(student => ({
        id: student.id,
        firstName: student.firstname,
        lastName: student.lastname,
        phone: student.phone,
        field: student.field,
        coachId: student.coachid,
        hasPaid: student.haspaid,
        profilePhoto: student.profilephoto,
        registeredDate: student.registereddate,
        notes: student.notes
      })) || [];
      
      setStudents(formattedStudents);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select(`
          id,
          studentid,
          coachid,
          weekstart,
          days,
          createdat,
          created_at
        `)
        .order('createdat', { ascending: false });
      
      if (error) throw error;
      
      // Convert flat case to camelCase for frontend
      const formattedPrograms = data?.map(program => ({
        id: program.id,
        studentId: program.studentid,
        coachId: program.coachid,
        weekStart: program.weekstart,
        days: program.days,
        createdAt: program.createdat
      })) || [];
      
      setPrograms(formattedPrograms);
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const loadTrialSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('trial_sessions')
        .select(`
          id,
          fullname,
          phone,
          field,
          createdat,
          created_at
        `)
        .order('createdat', { ascending: false });
      
      if (error) throw error;
      
      // Convert flat case to camelCase for frontend
      const formattedSessions = data?.map(session => ({
        id: session.id,
        fullName: session.fullname,
        phone: session.phone,
        field: session.field,
        createdAt: session.createdat
      })) || [];
      
      setTrialSessions(formattedSessions);
    } catch (error) {
      console.error('Error loading trial sessions:', error);
    }
  };

  const refreshData = async () => {
    await Promise.all([
      loadCoaches(),
      loadStudents(),
      loadPrograms(),
      loadTrialSessions()
    ]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const login = async (email: string, password: string, role: 'admin' | 'coach'): Promise<boolean> => {
    if (role === 'admin' && email === 'admin@yks.com' && password === 'admin123') {
      setUser({ id: 'admin', email, role: 'admin' });
      return true;
    }
    
    if (role === 'coach') {
      try {
        const { data, error } = await supabase
          .from('coaches')
          .select('*')
          .eq('email', email)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data && data.password === password) {
          setUser({ id: data.id, email, role: 'coach', coachId: data.id });
          return true;
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addCoach = async (coach: Omit<Coach, 'id'>) => {
    try {
      // Convert camelCase to flat case for Supabase
      const { data, error } = await supabase
        .from('coaches')
        .insert({
          email: coach.email,
          password: coach.password,
          firstname: coach.firstName,
          lastname: coach.lastName,
          field: coach.field,
          ranking: coach.ranking,
          description: coach.description,
          hasgapyear: coach.hasGapYear,
          tytscore: coach.tytScore,
          university: coach.university,
          department: coach.department,
          attendedprivateinstitution: coach.attendedPrivateInstitution,
          quotafull: coach.quotaFull,
          price: coach.price,
          registereddate: coach.registeredDate,
          profilephoto: coach.profilePhoto
        })
        .select();
      
      if (error) throw error;
      await loadCoaches();
    } catch (error) {
      console.error('Error adding coach:', error);
      throw error;
    }
  };

  const updateCoach = async (id: string, updatedCoach: Partial<Coach>) => {
    try {
      // Convert camelCase to flat case for Supabase
      const updateData: any = {};
      if (updatedCoach.firstName !== undefined) updateData.firstname = updatedCoach.firstName;
      if (updatedCoach.lastName !== undefined) updateData.lastname = updatedCoach.lastName;
      if (updatedCoach.email !== undefined) updateData.email = updatedCoach.email;
      if (updatedCoach.password !== undefined) updateData.password = updatedCoach.password;
      if (updatedCoach.field !== undefined) updateData.field = updatedCoach.field;
      if (updatedCoach.ranking !== undefined) updateData.ranking = updatedCoach.ranking;
      if (updatedCoach.description !== undefined) updateData.description = updatedCoach.description;
      if (updatedCoach.hasGapYear !== undefined) updateData.hasgapyear = updatedCoach.hasGapYear;
      if (updatedCoach.profilePhoto !== undefined) updateData.profilephoto = updatedCoach.profilePhoto;
      if (updatedCoach.tytScore !== undefined) updateData.tytscore = updatedCoach.tytScore;
      if (updatedCoach.university !== undefined) updateData.university = updatedCoach.university;
      if (updatedCoach.department !== undefined) updateData.department = updatedCoach.department;
      if (updatedCoach.attendedPrivateInstitution !== undefined) updateData.attendedprivateinstitution = updatedCoach.attendedPrivateInstitution;
      if (updatedCoach.quotaFull !== undefined) updateData.quotafull = updatedCoach.quotaFull;
      if (updatedCoach.price !== undefined) updateData.price = updatedCoach.price;
      if (updatedCoach.adminNotes !== undefined) updateData.adminnotes = updatedCoach.adminNotes;
      
      const { error } = await supabase
        .from('coaches')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      await loadCoaches();
    } catch (error) {
      console.error('Error updating coach:', error);
      throw error;
    }
  };

  const deleteCoach = async (id: string) => {
    try {
      const { error } = await supabase
        .from('coaches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await Promise.all([loadCoaches(), loadStudents()]);
    } catch (error) {
      console.error('Error deleting coach:', error);
      throw error;
    }
  };

  const addStudent = async (student: Omit<Student, 'id'>) => {
    try {
      // Convert camelCase to flat case for Supabase
      const { data, error } = await supabase
        .from('students')
        .insert({
          firstname: student.firstName,
          lastname: student.lastName,
          phone: student.phone,
          field: student.field,
          coachid: student.coachId,
          haspaid: student.hasPaid,
          profilephoto: student.profilePhoto,
          registereddate: student.registeredDate,
          notes: student.notes
        })
        .select();
      
      if (error) throw error;
      await loadStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  };

  const updateStudent = async (id: string, updatedStudent: Partial<Student>) => {
    try {
      // Convert camelCase to flat case for Supabase
      const updateData: any = {};
      if (updatedStudent.firstName !== undefined) updateData.firstname = updatedStudent.firstName;
      if (updatedStudent.lastName !== undefined) updateData.lastname = updatedStudent.lastName;
      if (updatedStudent.phone !== undefined) updateData.phone = updatedStudent.phone;
      if (updatedStudent.field !== undefined) updateData.field = updatedStudent.field;
      if (updatedStudent.coachId !== undefined) updateData.coachid = updatedStudent.coachId;
      if (updatedStudent.hasPaid !== undefined) updateData.haspaid = updatedStudent.hasPaid;
      if (updatedStudent.profilePhoto !== undefined) updateData.profilephoto = updatedStudent.profilePhoto;
      if (updatedStudent.registeredDate !== undefined) updateData.registereddate = updatedStudent.registeredDate;
      if (updatedStudent.notes !== undefined) updateData.notes = updatedStudent.notes;
      
      const { error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      await loadStudents();
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      await loadStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  };

  const assignStudentToCoach = async (studentId: string, coachId: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ coachid: coachId })
        .eq('id', studentId);
      
      if (error) throw error;
      await loadStudents();
    } catch (error) {
      console.error('Error assigning student to coach:', error);
      throw error;
    }
  };

  const addProgram = async (program: Omit<Program, 'id'>) => {
    try {
      // Convert camelCase to flat case for Supabase
      const { data, error } = await supabase
        .from('programs')
        .insert({
          studentid: program.studentId,
          coachid: program.coachId,
          weekstart: program.weekStart,
          days: program.days,
          createdat: program.createdAt
        })
        .select();
      
      if (error) throw error;
      await loadPrograms();
    } catch (error) {
      console.error('Error adding program:', error);
      throw error;
    }
  };

  const updateProgram = async (id: string, updatedProgram: Partial<Program>) => {
    try {
      // Convert camelCase to flat case for Supabase
      const updateData: any = {};
      if (updatedProgram.studentId !== undefined) updateData.studentid = updatedProgram.studentId;
      if (updatedProgram.coachId !== undefined) updateData.coachid = updatedProgram.coachId;
      if (updatedProgram.weekStart !== undefined) updateData.weekstart = updatedProgram.weekStart;
      if (updatedProgram.days !== undefined) updateData.days = updatedProgram.days;
      if (updatedProgram.createdAt !== undefined) updateData.createdat = updatedProgram.createdAt;
      
      const { error } = await supabase
        .from('programs')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      await loadPrograms();
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    }
  };

  const addTrialSession = async (session: Omit<TrialSession, 'id' | 'createdAt'>) => {
    try {
      // Convert camelCase to flat case for Supabase
      const { data, error } = await supabase
        .from('trial_sessions')
        .insert({
          fullname: session.fullName,
          phone: session.phone,
          field: session.field,
          createdat: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      await loadTrialSessions();
    } catch (error) {
      console.error('Error adding trial session:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      coaches,
      students,
      programs,
      trialSessions,
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