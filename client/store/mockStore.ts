
import { User, UserRole, Appointment } from '../types';

// Initial Mock Data
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Dr. Sarah Smith', email: 'sarah@mediconnect.com', role: UserRole.DOCTOR, specialization: 'Cardiology', hospital: 'City General Hospital' },
  { id: 'u2', name: 'Dr. James Wilson', email: 'james@mediconnect.com', role: UserRole.DOCTOR, specialization: 'Dermatology', hospital: 'Skin Care Clinic' },
  { id: 'p1', name: 'John Doe', email: 'john@example.com', role: UserRole.PATIENT },
  { id: 'a1', name: 'Admin User', email: 'admin@mediconnect.com', role: UserRole.ADMIN },
];

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'ap1', patientId: 'p1', doctorId: 'u1', date: '2024-06-15', time: '10:00 AM', status: 'PENDING', symptoms: ['Chest pain', 'Shortness of breath'] },
];

class Store {
  private users: User[] = [...MOCK_USERS];
  private appointments: Appointment[] = [...MOCK_APPOINTMENTS];
  private currentUser: User | null = null;

  getCurrentUser() { return this.currentUser; }
  setCurrentUser(user: User | null) { this.currentUser = user; }

  getUsersByRole(role: UserRole) { return this.users.filter(u => u.role === role); }
  getDoctors() { return this.getUsersByRole(UserRole.DOCTOR); }
  getPatients() { return this.getUsersByRole(UserRole.PATIENT); }

  getAppointmentsByPatient(pid: string) { return this.appointments.filter(a => a.patientId === pid); }
  getAppointmentsByDoctor(did: string) { return this.appointments.filter(a => a.doctorId === did); }
  getAllAppointments() { return this.appointments; }

  addAppointment(apt: Appointment) {
    this.appointments.push(apt);
    return apt;
  }

  updateAppointmentStatus(id: string, status: Appointment['status'], notes?: string) {
    const apt = this.appointments.find(a => a.id === id);
    if (apt) {
      apt.status = status;
      if (notes) apt.notes = notes;
    }
  }

  login(email: string): User | null {
    const user = this.users.find(u => u.email === email);
    if (user) {
      this.currentUser = user;
      return user;
    }
    return null;
  }
}

export const mockStore = new Store();
