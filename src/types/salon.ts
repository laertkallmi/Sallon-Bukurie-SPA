export interface SalonService {
  id: string;
  name: string;
  category: 'Flokë' | 'Zgjatim' | 'Grim' | 'Thonj' | 'Qerpikë';
  price: number;
  duration: number; // in minutes
  description: string;
  badge?: string;
  image: string;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes: string;
  status: AppointmentStatus;
  createdAt: string;
  createdBy: 'client' | 'admin';
}

export interface BlockedSlot {
  id: string;
  date: string;
  time?: string;
  reason?: string;
  createdAt: string;
}

export interface SalonStats {
  todayStr: string;
  todayCount: number;
  todayRevenue: number;
  totalAppointments: number;
  pendingCount: number;
  confirmedCount: number;
}
