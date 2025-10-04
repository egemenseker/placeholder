export interface Coach {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  field: 'EA' | 'SAY' | 'SÖZ' | 'DİL';
  ranking: number;
  description: string;
  hasgapyear: boolean;
  profilephoto?: string;
  tytscore: number;
  university: string;
  department: string;
  attendedprivateinstitution: boolean;
  quotafull: boolean;
  price: number;
  registereddate: string;
  adminnotes?: string;
}

export interface Student {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  field: 'EA' | 'SAY' | 'SÖZ' | 'DİL';
  coachid: string;
  haspaid: boolean;
  profilephoto?: string;
  registereddate: string;
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
  studentid: string;
  coachid: string;
  weekstart: string;
  days: DayProgram[];
  createdat: string;
}

export interface TrialSession {
  id: string;
  fullname: string;
  phone: string;
  field: 'EA' | 'SAY' | 'SÖZ' | 'DİL';
  createdat: string;
}