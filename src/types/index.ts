export interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  field: 'EA' | 'SAY' | 'SÖZ' | 'DİL';
  ranking: number;
  description: string;
  hasGapYear: boolean;
  profilePhoto?: string;
  tytScore: number;
  university: string;
  department: string;
  attendedPrivateInstitution: boolean;
  quotaFull: boolean;
  price: number;
  registeredDate: string;
  adminNotes?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  field: 'EA' | 'SAY' | 'SÖZ' | 'DİL';
  coachId: string;
  hasPaid: boolean;
  profilePhoto?: string;
  registeredDate: string;
  notes: string;
}

export interface Task {
  id: string;
  name: string;
  duration: string;
  courseName: string;
  completed: boolean;
}

export interface DayProgram {
  date: string;
  dayName: string;
  tasks: Task[];
}

export interface Program {
  id: string;
  studentId: string;
  coachId: string;
  weekStart: string;
  days: DayProgram[];
  createdAt: string;
}

export interface TrialSession {
  id: string;
  fullName: string;
  phone: string;
  field: 'EA' | 'SAY' | 'SÖZ' | 'DİL';
  createdAt: string;
}