import React, { createContext, useContext, useState, ReactNode } from 'react';

// ─── Types ───────────────────────────────────────────────
export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'telemedicine' | 'in-person';
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  room?: string;
  patientName?: string;
  patientId?: string;
}

export interface Prescription {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
  endDate: string;
  refillsLeft: number;
}

export interface TestResult {
  id: string;
  testName: string;
  date: string;
  status: 'normal' | 'abnormal' | 'pending';
  doctor: string;
  summary: string;
  read: boolean;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'online' | 'offline' | 'busy';
  email: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  userId: string;
  severity: 'INFO' | 'WARN' | 'ERROR';
}

export interface DemoUser {
  email: string;
  password: string;
  role: 'patient' | 'doctor' | 'admin';
  name: string;
  subtitle: string;
  initials: string;
}

// ─── Demo Accounts ───────────────────────────────────────
export const DEMO_ACCOUNTS: DemoUser[] = [
  { email: 'patient@nexus.com', password: 'patient123', role: 'patient', name: 'John Doe', subtitle: 'Patient ID: NX-8421', initials: 'JD' },
  { email: 'doctor@nexus.com',  password: 'doctor123',  role: 'doctor',  name: 'Dr. Sarah Jenkins', subtitle: 'Cardiology Specialist', initials: 'SJ' },
  { email: 'admin@nexus.com',   password: 'admin123',   role: 'admin',   name: 'System Admin', subtitle: 'Superuser', initials: 'SA' },
];

// ─── Hardcoded Seed Data ─────────────────────────────────
const SEED_APPOINTMENTS: Appointment[] = [
  { id: 'a1', doctorName: 'Dr. Sarah Jenkins', specialty: 'Cardiology', date: 'Oct 25', time: '10:00 AM', type: 'telemedicine', status: 'confirmed', patientName: 'John Doe', patientId: 'NX-8421' },
  { id: 'a2', doctorName: 'Dr. Marcus Lee', specialty: 'General Practice', date: 'Oct 28', time: '02:30 PM', type: 'in-person', status: 'pending', room: '402', patientName: 'John Doe', patientId: 'NX-8421' },
  { id: 'a3', doctorName: 'Dr. Sarah Jenkins', specialty: 'Cardiology', date: 'Oct 25', time: '11:30 AM', type: 'in-person', status: 'confirmed', patientName: 'Alice Smith', patientId: 'NX-9920' },
  { id: 'a4', doctorName: 'Dr. Sarah Jenkins', specialty: 'Cardiology', date: 'Oct 25', time: '02:00 PM', type: 'telemedicine', status: 'confirmed', patientName: 'Bob Johnson', patientId: 'NX-7312' },
  { id: 'a5', doctorName: 'Dr. Marcus Lee', specialty: 'General Practice', date: 'Oct 26', time: '09:00 AM', type: 'in-person', status: 'pending', room: '210', patientName: 'Emma Wilson', patientId: 'NX-5544' },
];

const SEED_PRESCRIPTIONS: Prescription[] = [
  { id: 'p1', name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', prescribedBy: 'Dr. Sarah Jenkins', startDate: 'Sep 15, 2025', endDate: 'Mar 15, 2026', refillsLeft: 3 },
  { id: 'p2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', prescribedBy: 'Dr. Marcus Lee', startDate: 'Aug 1, 2025', endDate: 'Feb 1, 2026', refillsLeft: 1 },
  { id: 'p3', name: 'Atorvastatin', dosage: '20mg', frequency: 'Daily at bedtime', prescribedBy: 'Dr. Sarah Jenkins', startDate: 'Oct 1, 2025', endDate: 'Apr 1, 2026', refillsLeft: 5 },
  { id: 'p4', name: 'Aspirin', dosage: '81mg', frequency: 'Daily', prescribedBy: 'Dr. Sarah Jenkins', startDate: 'Jan 10, 2025', endDate: 'Jan 10, 2026', refillsLeft: 2 },
];

const SEED_TEST_RESULTS: TestResult[] = [
  { id: 't1', testName: 'Complete Blood Count (CBC)', date: 'Oct 20, 2025', status: 'normal', doctor: 'Dr. Sarah Jenkins', summary: 'All values within normal range. WBC 6.2, RBC 4.8, Hemoglobin 14.2', read: false },
  { id: 't2', testName: 'Lipid Panel', date: 'Oct 18, 2025', status: 'abnormal', doctor: 'Dr. Sarah Jenkins', summary: 'LDL cholesterol slightly elevated at 142 mg/dL. HDL within range at 52.', read: true },
  { id: 't3', testName: 'Hemoglobin A1C', date: 'Oct 10, 2025', status: 'normal', doctor: 'Dr. Marcus Lee', summary: 'HbA1c at 5.6% — within normal pre-diabetic threshold.', read: true },
  { id: 't4', testName: 'Chest X-Ray', date: 'Oct 5, 2025', status: 'normal', doctor: 'Dr. Sarah Jenkins', summary: 'No abnormalities detected. Clear lung fields bilaterally.', read: true },
];

const SEED_STAFF: StaffMember[] = [
  { id: 's1', name: 'Dr. Sarah Jenkins', role: 'Cardiologist', department: 'Cardiology', status: 'online', email: 'sarah.jenkins@nexus.com' },
  { id: 's2', name: 'Dr. Marcus Lee', role: 'General Physician', department: 'General Practice', status: 'online', email: 'marcus.lee@nexus.com' },
  { id: 's3', name: 'Dr. Emily Chen', role: 'Cardiologist', department: 'Cardiology', status: 'busy', email: 'emily.chen@nexus.com' },
  { id: 's4', name: 'Dr. Alan Turing', role: 'Neurologist', department: 'Neurology', status: 'online', email: 'alan.turing@nexus.com' },
  { id: 's5', name: 'Dr. Jane Goodall', role: 'Pediatrician', department: 'Pediatrics', status: 'offline', email: 'jane.goodall@nexus.com' },
  { id: 's6', name: 'Nurse Rachel Adams', role: 'Head Nurse', department: 'ER', status: 'online', email: 'rachel.adams@nexus.com' },
  { id: 's7', name: 'Nurse Mike Torres', role: 'Nurse', department: 'Cardiology', status: 'busy', email: 'mike.torres@nexus.com' },
  { id: 's8', name: 'Admin Janet Kim', role: 'Receptionist', department: 'Front Desk', status: 'online', email: 'janet.kim@nexus.com' },
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  { id: 'l1', timestamp: 'Oct 24, 09:42 AM', event: 'New patient registration — Emma Wilson (NX-5544)', userId: 'sys_admin', severity: 'INFO' },
  { id: 'l2', timestamp: 'Oct 24, 08:30 AM', event: 'Multiple failed login attempts from 192.168.1.104', userId: '192.168.1.104', severity: 'WARN' },
  { id: 'l3', timestamp: 'Oct 24, 06:15 AM', event: 'Nightly database backup completed successfully', userId: 'system_worker', severity: 'INFO' },
  { id: 'l4', timestamp: 'Oct 23, 11:00 PM', event: 'Prescription refill approved for patient NX-8421', userId: 'dr.jenkins', severity: 'INFO' },
  { id: 'l5', timestamp: 'Oct 23, 04:12 PM', event: 'System update applied — v2.4.1 deployed', userId: 'devops_bot', severity: 'INFO' },
  { id: 'l6', timestamp: 'Oct 23, 02:00 PM', event: 'Unauthorized API access attempt blocked', userId: '10.0.0.55', severity: 'ERROR' },
];

// ─── Context ─────────────────────────────────────────────
interface DemoDataContextType {
  currentUser: DemoUser | null;
  login: (email: string, password: string) => DemoUser | null;
  logout: () => void;
  appointments: Appointment[];
  addAppointment: (appt: Omit<Appointment, 'id'>) => void;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  prescriptions: Prescription[];
  testResults: TestResult[];
  markTestRead: (id: string) => void;
  staff: StaffMember[];
  auditLogs: AuditLog[];
  documents: string[];
  addDocument: (name: string) => void;
}

const DemoDataContext = createContext<DemoDataContextType | undefined>(undefined);

export function DemoDataProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(SEED_APPOINTMENTS);
  const [prescriptions] = useState<Prescription[]>(SEED_PRESCRIPTIONS);
  const [testResults, setTestResults] = useState<TestResult[]>(SEED_TEST_RESULTS);
  const [staff] = useState<StaffMember[]>(SEED_STAFF);
  const [auditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);
  const [documents, setDocuments] = useState<string[]>(['Blood_Work_Sep2025.pdf', 'Insurance_Card.jpg']);

  const login = (email: string, password: string): DemoUser | null => {
    const user = DEMO_ACCOUNTS.find(a => a.email === email && a.password === password);
    if (user) { setCurrentUser(user); return user; }
    return null;
  };

  const logout = () => setCurrentUser(null);

  const addAppointment = (appt: Omit<Appointment, 'id'>) => {
    const newAppt: Appointment = { ...appt, id: `a${Date.now()}` };
    setAppointments(prev => [newAppt, ...prev]);
  };

  const cancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, date: newDate, time: newTime, status: 'pending' } : a));
  };

  const markTestRead = (id: string) => {
    setTestResults(prev => prev.map(t => t.id === id ? { ...t, read: true } : t));
  };

  const addDocument = (name: string) => {
    setDocuments(prev => [name, ...prev]);
  };

  return (
    <DemoDataContext.Provider value={{
      currentUser, login, logout,
      appointments, addAppointment, cancelAppointment, rescheduleAppointment,
      prescriptions, testResults, markTestRead,
      staff, auditLogs, documents, addDocument,
    }}>
      {children}
    </DemoDataContext.Provider>
  );
}

export function useDemoData() {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error('useDemoData must be used within DemoDataProvider');
  return ctx;
}
