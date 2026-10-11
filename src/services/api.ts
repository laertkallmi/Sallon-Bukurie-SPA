import { Appointment, BlockedSlot, SalonService, SalonStats } from '../types/salon';

export const ALL_SERVICES: SalonService[] = [
  {
    id: 'hair',
    name: 'Stilim & Prerje Flokësh',
    category: 'Flokë',
    price: 35,
    duration: 60,
    description: 'Larje relaksuese, tharje profesionale, prerje moderne dhe stilim me onde ose drekë/mbrëmje.',
    badge: 'Më e Kërkuara',
    image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'extension',
    name: 'Zgjatim Flokësh (Extensions)',
    category: 'Zgjatim',
    price: 120,
    duration: 120,
    description: 'Zgjatime premium me fije 100% natyrale: Keratinë, Tape-in ose Micro-ring me volum të plotë.',
    badge: 'Premium',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'makeup',
    name: 'Grim Profesional (Make Up)',
    category: 'Grim',
    price: 45,
    duration: 60,
    description: 'Grim artistik për evente, dasma dhe mbrëmje me produkte luksoze dhe fiksim 24-orësh.',
    badge: 'Glamour',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'nails',
    name: 'Thonj & Manikyr / Pedikyr',
    category: 'Thonj',
    price: 25,
    duration: 50,
    description: 'Manikyr me xhel, tipsa, formësim i përsosur, dizajne nail art dhe trajtim hidratues.',
    badge: 'Popullore',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'eyelashes',
    name: 'Zgjatim Qerpikësh (Eyelashes)',
    category: 'Qerpikë',
    price: 40,
    duration: 75,
    description: 'Teknika Volume rus (3D-6D) dhe Klasik 1:1, efekt natyral ose dramatik, rezistent ndaj ujit.',
    badge: 'Trend',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80'
  }
];

export const WORK_TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00'
];

export async function fetchAppointments(): Promise<Appointment[]> {
  try {
    const res = await fetch('/api/appointments');
    if (!res.ok) throw new Error('Dështoi marrja e termineve');
    const data = await res.json();
    return data.appointments || [];
  } catch (error) {
    console.warn('API error, using localStorage fallback:', error);
    const cached = localStorage.getItem('salon_appointments');
    return cached ? JSON.parse(cached) : [];
  }
}

export async function createAppointment(appointmentData: {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceId: string;
  date: string;
  time: string;
  notes?: string;
  createdBy?: 'client' | 'admin';
}): Promise<{ success: boolean; appointment?: Appointment; message: string }> {
  try {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || 'Ndodhi një gabim gjatë rezervimit.' };
    }
    return { success: true, appointment: data.appointment, message: data.message };
  } catch (error) {
    console.error('Network booking error:', error);
    return { success: false, message: 'Lidhja me serverin dështoi. Ju lutem provoni përsëri.' };
  }
}

export async function updateAppointmentStatus(
  id: string,
  status: Appointment['status']
): Promise<boolean> {
  try {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return res.ok;
  } catch (error) {
    console.error('Error updating status:', error);
    return false;
  }
}

export async function deleteAppointment(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return false;
  }
}

export async function fetchBlockedSlots(): Promise<BlockedSlot[]> {
  try {
    const res = await fetch('/api/blocked-slots');
    if (!res.ok) throw new Error('Dështoi marrja e orareve të bllokuara');
    const data = await res.json();
    return data.blockedSlots || [];
  } catch (error) {
    console.warn('Error fetching blocked slots:', error);
    const cached = localStorage.getItem('salon_blocked_slots');
    return cached ? JSON.parse(cached) : [];
  }
}

export async function toggleSlotBlocked(payload: {
  date: string;
  time?: string;
  reason?: string;
}): Promise<{ success: boolean; isBlocked?: boolean; blockedSlots?: BlockedSlot[]; message?: string }> {
  try {
    const res = await fetch('/api/blocked-slots/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error toggling blocked slot:', error);
    return { success: false, message: 'Dështoi bllokimi/zhbllokimi' };
  }
}

export async function verifyAdminCode(code: string): Promise<boolean> {
  if (code === '230306') {
    return true;
  }
  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

export async function fetchStats(): Promise<SalonStats | null> {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) return null;
    const data = await res.json();
    return data.stats;
  } catch {
    return null;
  }
}
