import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, Calendar as CalendarIcon, Clock, Lock, Unlock, Phone, 
  MessageCircle, CheckCircle, XCircle, Trash2, Plus, Search, 
  Filter, RefreshCw, LogOut, AlertTriangle, Sparkles, DollarSign,
  ChevronLeft, ChevronRight, Check, ShieldAlert, Bell
} from 'lucide-react';
import { Appointment, BlockedSlot, AppointmentStatus, SalonService } from '../types/salon';
import { 
  fetchAppointments, 
  fetchBlockedSlots, 
  toggleSlotBlocked, 
  updateAppointmentStatus, 
  deleteAppointment, 
  createAppointment,
  ALL_SERVICES,
  WORK_TIME_SLOTS 
} from '../services/api';

interface AdminPanelProps {
  onLogout: () => void;
}

const ALBANIAN_MONTHS = [
  'Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
  'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [syncCount, setSyncCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // New booking notification toast
  const [newBookingAlert, setNewBookingAlert] = useState<Appointment | null>(null);
  const previousAppointmentsRef = useRef<Appointment[]>([]);

  // Selected date for agenda view (defaults to today)
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [viewTab, setViewTab] = useState<'today' | 'calendar' | 'all' | 'manage_slots'>('today');

  // Manual Walk-in Modal State
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualClientName, setManualClientName] = useState('');
  const [manualClientPhone, setManualClientPhone] = useState('');
  const [manualServiceId, setManualServiceId] = useState(ALL_SERVICES[0].id);
  const [manualDate, setManualDate] = useState(todayStr);
  const [manualTime, setManualTime] = useState('11:00');
  const [manualNotes, setManualNotes] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);

  // Fetch function
  const loadData = async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const [appts, blk] = await Promise.all([
        fetchAppointments(),
        fetchBlockedSlots()
      ]);

      // Check if any new appointment arrived compared to previous state
      if (previousAppointmentsRef.current.length > 0) {
        const prevIds = new Set(previousAppointmentsRef.current.map(a => a.id));
        const newOnes = appts.filter(a => !prevIds.has(a.id) && a.createdBy === 'client');
        if (newOnes.length > 0) {
          setNewBookingAlert(newOnes[0]);
          setTimeout(() => setNewBookingAlert(null), 6000);
        }
      }

      previousAppointmentsRef.current = appts;
      setAppointments(appts);
      setBlockedSlots(blk);
      setLastSyncTime(new Date());
      setSyncCount(prev => prev + 1);
    } catch (err) {
      console.error('Polling error:', err);
    } finally {
      if (!silent) setIsSyncing(false);
    }
  };

  // Synchronisation every 2 seconds
  useEffect(() => {
    loadData(false);
    const interval = setInterval(() => {
      loadData(true);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Today's appointments sorted by time
  const todayAppointments = useMemo(() => {
    return appointments
      .filter(a => a.date === todayStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, todayStr]);

  // Appointments for the currently selected date
  const selectedDateAppointments = useMemo(() => {
    return appointments
      .filter(a => a.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments, selectedDate]);

  // Today's statistics
  const todayStats = useMemo(() => {
    const active = todayAppointments.filter(a => a.status !== 'cancelled');
    const revenue = active.reduce((sum, a) => sum + (a.servicePrice || 0), 0);
    const pending = todayAppointments.filter(a => a.status === 'pending').length;
    const confirmed = todayAppointments.filter(a => a.status === 'confirmed').length;
    const completed = todayAppointments.filter(a => a.status === 'completed').length;
    return {
      count: todayAppointments.length,
      revenue,
      pending,
      confirmed,
      completed
    };
  }, [todayAppointments]);

  // Filtered appointments for "All Appointments" table
  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchesSearch = 
        a.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.clientPhone.includes(searchQuery) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchesService = serviceFilter === 'all' || a.serviceId === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [appointments, searchQuery, statusFilter, serviceFilter]);

  // Status changer handler
  const handleStatusChange = async (id: string, newStatus: AppointmentStatus) => {
    const success = await updateAppointmentStatus(id, newStatus);
    if (success) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    }
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    if (window.confirm('A jeni të sigurt që dëshironi të fshini këtë termin?')) {
      const success = await deleteAppointment(id);
      if (success) {
        setAppointments(prev => prev.filter(a => a.id !== id));
      }
    }
  };

  // Toggle Slot Blocked/Free for selectedDate
  const handleToggleBlock = async (time?: string) => {
    const res = await toggleSlotBlocked({
      date: selectedDate,
      time,
      reason: 'I bllokuar nga administratori'
    });
    if (res.success && res.blockedSlots) {
      setBlockedSlots(res.blockedSlots);
    } else {
      loadData(false);
    }
  };

  // Check if slot is blocked for selectedDate
  const isWholeDayBlocked = useMemo(() => {
    return blockedSlots.some(b => b.date === selectedDate && !b.time);
  }, [blockedSlots, selectedDate]);

  // Handle adding manual walk-in appointment
  const handleCreateManualAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);

    if (!manualClientName.trim() || !manualClientPhone.trim()) {
      setManualError('Plotësoni emrin dhe telefonin e klientit.');
      return;
    }

    const res = await createAppointment({
      clientName: manualClientName.trim(),
      clientPhone: manualClientPhone.trim(),
      serviceId: manualServiceId,
      date: manualDate,
      time: manualTime,
      notes: manualNotes.trim() ? `[Walk-in / Telefonatë]: ${manualNotes.trim()}` : '[Walk-in / Telefonatë]',
      createdBy: 'admin'
    });

    if (res.success && res.appointment) {
      setShowManualModal(false);
      setManualClientName('');
      setManualClientPhone('');
      setManualNotes('');
      loadData(false);
    } else {
      setManualError(res.message || 'Ndodhi një gabim gjatë krijimit.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/60 pb-20">
      
      {/* Toast Alert for Instant Booking on another phone */}
      {newBookingAlert && (
        <div className="fixed top-24 right-4 z-50 max-w-md bg-white border-2 border-pink-500 rounded-2xl shadow-2xl p-4 flex items-start gap-3 animate-bounce">
          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
            <Bell className="w-5 h-5 animate-spin" />
          </div>
          <div className="flex-1">
            <h5 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <span>🔔 Rezervim i Ri Online!</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 font-semibold">Tani</span>
            </h5>
            <p className="text-xs text-stone-600 mt-0.5">
              Klientja <strong>{newBookingAlert.clientName}</strong> sapo rezervoi{' '}
              <strong>{newBookingAlert.serviceName}</strong> për datën <strong>{newBookingAlert.date}</strong> në orën <strong>{newBookingAlert.time}</strong>.
            </p>
          </div>
          <button
            onClick={() => setNewBookingAlert(null)}
            className="text-stone-400 hover:text-stone-600 p-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Top Admin Bar */}
      <div className="bg-white border-b border-pink-100 sticky top-20 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>Paneli i Administratorit</span>
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-stone-500">
                {/* 2-second synchronisation live indicator */}
                <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Sinkronizimi aktiv (çdo 2s)
                </span>
                <span>•</span>
                <span>Përditësuar: {lastSyncTime.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowManualModal(true)}
              className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Shto Termim (Walk-In)</span>
            </button>

            <button
              onClick={() => loadData(false)}
              disabled={isSyncing}
              className="p-2 rounded-xl border border-pink-200 bg-pink-50 hover:bg-pink-100 text-pink-700 transition-colors"
              title="Rifresko Tani"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-stone-600 hover:text-rose-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Dil</span>
            </button>
          </div>

        </div>

        {/* Tab Sub-navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-pink-50 flex gap-2 py-2 overflow-x-auto">
          {[
            { id: 'today', label: `🌟 Kush Vjen Sot (${todayStats.count})` },
            { id: 'calendar', label: '📅 Kalendari Ditës' },
            { id: 'manage_slots', label: '🔒 Blloko / Zhblloko Orare' },
            { id: 'all', label: `📋 Të Gjitha Terminet (${appointments.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setViewTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                viewTab === tab.id
                  ? 'bg-pink-600 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-pink-600 hover:bg-pink-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Takimet Sot</span>
              <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900 mt-2">{todayStats.count}</p>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {todayStats.confirmed} të konfirmuara • {todayStats.pending} në pritje
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Të Ardhura Sot</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900 mt-2">{todayStats.revenue} €</p>
            <p className="text-[11px] text-stone-500 mt-0.5">Parashikimi për oraret aktive</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Në Pritje</span>
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900 mt-2">{todayStats.pending}</p>
            <p className="text-[11px] text-stone-500 mt-0.5">Kërkojnë konfirmim me telefon</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Gjithsej në Sistem</span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <CalendarIcon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900 mt-2">{appointments.length}</p>
            <p className="text-[11px] text-stone-500 mt-0.5">Sinkronizuar në kohë reale</p>
          </div>

        </div>

        {/* TAB 1: KUSH VJEN SOT (Who comes today) */}
        {viewTab === 'today' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-pink-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
                    <h3 className="font-serif-luxury text-2xl font-bold text-stone-900">
                      Kush Vjen Sot në Sallon?
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Orari ditor kronologjik për datën e sotme: <strong className="text-pink-600">{todayStr}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewTab('manage_slots')}
                    className="px-3.5 py-1.5 rounded-xl border border-pink-200 text-xs font-semibold text-pink-700 bg-pink-50 hover:bg-pink-100 transition-colors flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Menaxho Orare të Lira / Bllokuara
                  </button>
                </div>
              </div>

              {todayAppointments.length === 0 ? (
                <div className="py-16 text-center text-stone-500 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center mx-auto text-pink-400">
                    <CalendarIcon className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-stone-800">Nuk ka asnjë termin për sot ende!</h4>
                  <p className="text-xs max-w-sm mx-auto text-stone-500">
                    Klientët mund të rezervojnë online në çdo moment, ose shtoni një takim manual me butonin më sipër.
                  </p>
                  <button
                    onClick={() => setShowManualModal(true)}
                    className="px-5 py-2.5 rounded-full bg-pink-600 text-white text-xs font-semibold hover:bg-pink-700 transition-colors"
                  >
                    + Shto Termim Manual
                  </button>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {todayAppointments.map((item, index) => {
                    const isCompleted = item.status === 'completed';
                    const isCancelled = item.status === 'cancelled';
                    const isConfirmed = item.status === 'confirmed';
                    const isPending = item.status === 'pending';

                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl p-5 border transition-all ${
                          isCancelled
                            ? 'bg-stone-50 border-stone-200 opacity-60'
                            : isCompleted
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : isConfirmed
                            ? 'bg-white border-pink-200 shadow-2xs hover:shadow-xs'
                            : 'bg-amber-50/40 border-amber-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          
                          {/* Time & Client info */}
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-xs shrink-0">
                              <span className="text-xs uppercase font-medium">Ora</span>
                              <span className="text-lg font-bold">{item.time}</span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-base font-bold text-stone-900">{item.clientName}</h4>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700">
                                  {item.serviceName}
                                </span>
                                <span className="text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                                  {item.servicePrice} €
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-xs text-stone-600 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                                  <strong>{item.clientPhone}</strong>
                                </span>
                                {item.clientEmail && (
                                  <span className="text-stone-400">({item.clientEmail})</span>
                                )}
                                <span className="text-stone-400">• Kohëzgjatja: {item.serviceDuration} min</span>
                                <span className="text-stone-400">• Kod: #{item.id}</span>
                              </div>

                              {item.notes && (
                                <p className="text-xs text-stone-600 bg-pink-50/60 rounded-lg p-2 mt-1 border border-pink-100">
                                  <span className="font-semibold text-pink-700">Shënim:</span> {item.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Contact buttons & Status actions */}
                          <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-pink-100">
                            
                            {/* Phone call */}
                            <a
                              href={`tel:${item.clientPhone}`}
                              className="px-3 py-2 rounded-xl bg-white border border-stone-200 hover:border-pink-300 text-stone-700 hover:text-pink-600 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                              title="Telefono Klienten"
                            >
                              <Phone className="w-3.5 h-3.5 text-pink-500" />
                              <span className="hidden sm:inline">Telefono</span>
                            </a>

                            {/* WhatsApp button */}
                            <a
                              href={`https://wa.me/${item.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Përshëndetje ${item.clientName}! Ju kujtojmë terminin tuaj sot në orën ${item.time} për ${item.serviceName} tek Sallon Elegance. Ju mirëpresim!`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                              title="Dërgo mesazh WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>

                            {/* Status Changer Actions */}
                            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                              <button
                                onClick={() => handleStatusChange(item.id, 'confirmed')}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  isConfirmed
                                    ? 'bg-pink-600 text-white shadow-2xs'
                                    : 'text-stone-600 hover:text-pink-600'
                                }`}
                                title="Konfirmo"
                              >
                                Konfirmuar
                              </button>

                              <button
                                onClick={() => handleStatusChange(item.id, 'completed')}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  isCompleted
                                    ? 'bg-emerald-600 text-white shadow-2xs'
                                    : 'text-stone-600 hover:text-emerald-600'
                                }`}
                                title="Shëno si Përfunduar"
                              >
                                Përfunduar
                              </button>

                              <button
                                onClick={() => handleStatusChange(item.id, 'cancelled')}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  isCancelled
                                    ? 'bg-rose-600 text-white shadow-2xs'
                                    : 'text-stone-600 hover:text-rose-600'
                                }`}
                                title="Anulo"
                              >
                                Anulo
                              </button>
                            </div>

                            {/* Delete button */}
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Fshi terminin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: KALENDARI I DITËS (Select any date) */}
        {viewTab === 'calendar' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xs">
              
              {/* Date Chooser Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-pink-100 gap-3">
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-stone-900">
                    Kalendari Sipas Ditëve
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Zgjidhni datën për të parë agjendën e termineve dhe klientët.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedDate(todayStr)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      selectedDate === todayStr
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-pink-50'
                    }`}
                  >
                    Sot
                  </button>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-pink-200 text-xs font-medium text-stone-800 bg-white"
                  />
                </div>
              </div>

              {/* Day Appointments */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-stone-800">
                    Terminet për datën: <span className="text-pink-600">{selectedDate}</span> ({selectedDateAppointments.length})
                  </h4>
                </div>

                {selectedDateAppointments.length === 0 ? (
                  <div className="py-12 text-center text-stone-400">
                    <p className="text-sm">Nuk ka asnjë termin për këtë datë.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateAppointments.map(item => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl border border-pink-100 bg-rose-50/30 flex items-center justify-between flex-wrap gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-base text-pink-600 bg-white px-3 py-1 rounded-xl border border-pink-100">
                            {item.time}
                          </span>
                          <div>
                            <h5 className="font-bold text-stone-900 text-sm">{item.clientName}</h5>
                            <p className="text-xs text-stone-500">
                              {item.serviceName} • {item.clientPhone} • {item.servicePrice} €
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                            item.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                            item.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                            item.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {item.status === 'confirmed' ? 'Konfirmuar' :
                             item.status === 'completed' ? 'Përfunduar' :
                             item.status === 'cancelled' ? 'Anuluar' : 'Në Pritje'}
                          </span>

                          <button
                            onClick={() => handleStatusChange(item.id, item.status === 'confirmed' ? 'completed' : 'confirmed')}
                            className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold hover:border-pink-300"
                          >
                            Ndrysho Statusin
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: BLLOKO / ZHBLOKO ORARE (Handle free or blocked appointments) */}
        {viewTab === 'manage_slots' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xs">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-pink-100 gap-3">
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-stone-900">
                    Menaxhimi i Orareve: Blloko ose Liro
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Kontrolloni lehtësisht cilat orare dëshironi t'i keni të lira apo të bllokuara për rezervime nga klientët.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-pink-200 text-xs font-medium text-stone-800 bg-white"
                  />

                  {/* Toggle Whole Day Button */}
                  <button
                    onClick={() => handleToggleBlock(undefined)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                      isWholeDayBlocked
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-stone-100 text-stone-700 hover:bg-rose-50 border-stone-200'
                    }`}
                  >
                    {isWholeDayBlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{isWholeDayBlocked ? 'Zhblloko Gjithë Ditën' : 'Blloko Gjithë Ditën (Pushim)'}</span>
                  </button>
                </div>
              </div>

              {/* Status Notice */}
              {isWholeDayBlocked && (
                <div className="mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>
                    Kjo ditë (<strong>{selectedDate}</strong>) është shënuar si <strong>E BLLOKUAR TËRËSISHT</strong>. Klientët nuk mund të rezervojnë asnjë orar në këtë ditë.
                  </span>
                </div>
              )}

              {/* Slots Matrix */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {WORK_TIME_SLOTS.map(time => {
                  const isBlocked = isWholeDayBlocked || blockedSlots.some(b => b.date === selectedDate && b.time === time);
                  const bookedAppt = appointments.find(
                    a => a.date === selectedDate && a.time === time && a.status !== 'cancelled'
                  );

                  return (
                    <div
                      key={time}
                      className={`p-4 rounded-2xl border transition-all ${
                        isBlocked
                          ? 'bg-rose-50/60 border-rose-200'
                          : bookedAppt
                          ? 'bg-stone-50 border-stone-200'
                          : 'bg-white border-pink-100 hover:border-pink-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg text-stone-900">{time}</span>
                        {isBlocked ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            I Bllokuar
                          </span>
                        ) : bookedAppt ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            I Rezervuar
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            I Lirë
                          </span>
                        )}
                      </div>

                      {bookedAppt ? (
                        <div className="text-xs text-stone-600 my-2">
                          <p className="font-semibold text-stone-900 truncate">{bookedAppt.clientName}</p>
                          <p className="text-[11px] text-stone-500">{bookedAppt.serviceName}</p>
                        </div>
                      ) : (
                        <div className="text-xs text-stone-400 my-2">
                          {isBlocked ? 'Orari nuk është i hapur për rezervime' : 'I hapur për rezervime online'}
                        </div>
                      )}

                      {/* Action toggle button */}
                      <button
                        onClick={() => handleToggleBlock(time)}
                        className={`w-full mt-2 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isBlocked
                            ? 'bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-white hover:bg-rose-50 text-rose-600 border border-rose-200'
                        }`}
                      >
                        {isBlocked ? (
                          <>
                            <Unlock className="w-3.5 h-3.5" />
                            <span>Zhblloko (Bëje të Lirë)</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Blloko Këtë Orar</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: TË GJITHA TERMINET (All Appointments Table) */}
        {viewTab === 'all' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xs">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-pink-100 gap-4">
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-stone-900">
                    Regjistri i Plotë i Termineve
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Kërkoni, filtroni dhe menaxhoni të gjitha rezervimet e klientëve.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Kërko me emër, telefon, kod..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-pink-200 text-xs bg-white focus:outline-pink-500"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 my-4">
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Statusi:</span>
                </div>
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st as any)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                      statusFilter === st
                        ? 'bg-pink-600 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-pink-50'
                    }`}
                  >
                    {st === 'all' ? 'Të Gjitha' :
                     st === 'pending' ? 'Në Pritje' :
                     st === 'confirmed' ? 'Konfirmuar' :
                     st === 'completed' ? 'Përfunduar' : 'Anuluar'}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-xs">
                  <thead className="bg-pink-50/60 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-y border-pink-100">
                    <tr>
                      <th className="py-3 px-4">Kodi & Data</th>
                      <th className="py-3 px-4">Klientja</th>
                      <th className="py-3 px-4">Kontakti</th>
                      <th className="py-3 px-4">Shërbimi</th>
                      <th className="py-3 px-4">Çmimi</th>
                      <th className="py-3 px-4">Statusi</th>
                      <th className="py-3 px-4 text-right">Veprime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-50">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-10 text-center text-stone-400">
                          Nuk u gjet asnjë termin me këto kritere.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map(appt => (
                        <tr key={appt.id} className="hover:bg-rose-50/20 transition-colors">
                          <td className="py-3.5 px-4 font-medium text-stone-800">
                            <div><strong>#{appt.id}</strong></div>
                            <div className="text-[11px] text-stone-500">📅 {appt.date} • ⏰ {appt.time}</div>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-stone-900">
                            {appt.clientName}
                            {appt.createdBy === 'admin' && (
                              <span className="ml-1.5 text-[9px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-sm">Admin</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-stone-600">
                            <div>{appt.clientPhone}</div>
                            {appt.clientEmail && <div className="text-[10px] text-stone-400">{appt.clientEmail}</div>}
                          </td>

                          <td className="py-3.5 px-4 font-medium text-pink-700">
                            {appt.serviceName}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-stone-900">
                            {appt.servicePrice} €
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                              appt.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                              appt.status === 'cancelled' ? 'bg-rose-100 text-rose-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {appt.status === 'confirmed' ? 'Konfirmuar' :
                               appt.status === 'completed' ? 'Përfunduar' :
                               appt.status === 'cancelled' ? 'Anuluar' : 'Në Pritje'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleStatusChange(appt.id, 'confirmed')}
                                className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"
                                title="Konfirmo"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(appt.id, 'cancelled')}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600"
                                title="Anulo"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(appt.id)}
                                className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700"
                                title="Fshi"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* MODAL: SHTO TERMIN MANUAL (Walk-in client or phone call) */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-pink-200">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100 mb-4">
              <h4 className="font-serif-luxury text-lg font-bold text-stone-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-pink-600" />
                Shto Termim të Ri (Walk-In)
              </h4>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold"
              >
                ×
              </button>
            </div>

            {manualError && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {manualError}
              </div>
            )}

            <form onSubmit={handleCreateManualAppointment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Emri i Klientes *</label>
                <input
                  type="text"
                  required
                  placeholder="Emër Mbiemër"
                  value={manualClientName}
                  onChange={e => setManualClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Numri i Telefonit *</label>
                <input
                  type="tel"
                  required
                  placeholder="+355 69 ..."
                  value={manualClientPhone}
                  onChange={e => setManualClientPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Shërbimi *</label>
                <select
                  value={manualServiceId}
                  onChange={e => setManualServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs bg-white focus:outline-pink-500"
                >
                  {ALL_SERVICES.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.price} € - {s.duration} min)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Data *</label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={e => setManualDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Ora *</label>
                  <select
                    value={manualTime}
                    onChange={e => setManualTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 text-xs bg-white"
                  >
                    {WORK_TIME_SLOTS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Shënime Shtesë</label>
                <input
                  type="text"
                  placeholder="p.sh. Klientja erdhi në sallon ose telefonoi"
                  value={manualNotes}
                  onChange={e => setManualNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-xs focus:outline-pink-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-600 hover:bg-stone-50"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-700 shadow-xs"
                >
                  Regjistro Terminin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
