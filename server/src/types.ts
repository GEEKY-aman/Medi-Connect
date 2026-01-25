
export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  specialization?: string;
  hospital?: string;
  location?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  notes?: string;
  symptoms?: string[];
  prediction?: string;
}

export interface DiseaseRecommendation {
  disease: string;
  confidence: number;
  suggestions: string[];
  medicines: string[];
  precautions: string[];
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Hospital {
  name: string;
  address: string;
  distance?: string;
  uri?: string;
}
