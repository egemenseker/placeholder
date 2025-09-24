import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Coach, Student, Program, TrialSession } from '../types';
import { mockCoaches, mockStudents, mockPrograms } from '../data/mockData';

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
  const [coaches, setCoaches] = useState<Coach[]>(mockCoaches);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [programs, setPrograms] = useState<Program[]>(mockPrograms);
  const [trialSessions, setTrialSessions] = useState<TrialSession[]>([]);

  const login = async (email: string, password: string, role: 'admin' | 'coach'): Promise<boolean> => {
    // Mock authentication
    if (role === 'admin' && email === 'admin@yks.com' && password === 'admin123') {
      setUser({ id: 'admin', email, role: 'admin' });
      return true;
    }
    
    if (role === 'coach') {
      const coach = coaches.find(c => c.email === email);
      if (coach && coach.password && password === coach.password) {
        setUser({ id: coach.id, email, role: 'coach', coachId: coach.id });
        return true;
      }
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addCoach = (coach: Omit<Coach, 'id'>) => {
    const newCoach = { ...coach, id: Date.now().toString() };
    setCoaches(prev => [...prev, newCoach]);
  };

  const updateCoach = (id: string, updatedCoach: Partial<Coach>) => {
    setCoaches(prev => prev.map(coach => 
      coach.id === id ? { ...coach, ...updatedCoach } : coach
    ));
  };

  const deleteCoach = (id: string) => {
    setCoaches(prev => prev.filter(coach => coach.id !== id));
    // Also remove students assigned to this coach
    setStudents(prev => prev.filter(student => student.coachId !== id));
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Date.now().toString() };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updatedStudent: Partial<Student>) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updatedStudent } : student
    ));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  const assignStudentToCoach = (studentId: string, coachId: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, coachId } : student
    ));
  };

  const addProgram = (program: Omit<Program, 'id'>) => {
    const newProgram = { ...program, id: Date.now().toString() };
    setPrograms(prev => [...prev, newProgram]);
  };

  const updateProgram = (id: string, updatedProgram: Partial<Program>) => {
    setPrograms(prev => prev.map(program => 
      program.id === id ? { ...program, ...updatedProgram } : program
    ));
  };

  const addTrialSession = (session: Omit<TrialSession, 'id' | 'createdAt'>) => {
    const newSession = { 
      ...session, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTrialSessions(prev => [...prev, newSession]);
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