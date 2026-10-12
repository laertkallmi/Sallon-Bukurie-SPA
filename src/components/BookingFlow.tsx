import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Calendar as CalendarIcon, Clock, User, Phone, Mail, 
  MessageSquare, CheckCircle2, ChevronRight, AlertCircle, ArrowLeft,
  Check, Share2
} from 'lucide-react';
import { Appointment, BlockedSlot, SalonService } from '../types/salon';
import { ALL_SERVICES, WORK_TIME_SLOTS, createAppointment } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface BookingFlowProps {
  appointments: Appointment[];
  blockedSlots: BlockedSlot[];
  onBookingSuccess: (newAppointment: Appointment) => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({
  appointments,
  blockedSlots,
  onBookingSuccess
}) => {
  const { t } = useLanguage();

  // Step: 1 = Service, 2 = Date & Time, 3 = Personal Info, 4 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<SalonService>(ALL_SERVICES[0]);
  
  // Default date to today in YYYY-MM-DD
  const todayDateStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Personal Info State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Submitting state & errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Generate next 14 selectable dates
  const nextDates = useMemo(() => {
    const list = [];
    const base = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      const dateString = `${y}-${m}-${dayNum}`;
      list.push({
        dateString,
        dayOfWeek: t.daysShort[d.getDay()],
        dayNumber: d.getDate(),
        monthName: t.months[d.getMonth()],
        isToday: i === 0,
        isTomorrow: i === 1
      });
    }
    return list;
  }, [t]);

  // Compute status for all time slots for selected date
  const timeSlotStatuses = useMemo(() => {
    const isWholeDayBlocked = blockedSlots.some(b => b.date === selectedDate && !b.time);
    
    return WORK_TIME_SLOTS.map(time => {
      if (isWholeDayBlocked) {
        return { time, status: 'blocked' as const, reason: t.slotBlocked };
      }

      // Check specific slot blocked by admin
      const slotBlocked = blockedSlots.find(b => b.date === selectedDate && b.time === time);
      if (slotBlocked) {
        return { time, status: 'blocked' as const, reason: slotBlocked.reason || t.slotBlocked };
      }

      // Check if already booked and active
      const isBooked = appointments.some(
        a => a.date === selectedDate && a.time === time && a.status !== 'cancelled'
      );
      if (isBooked) {
        return { time, status: 'booked' as const, reason: t.slotBooked };
      }

      return { time, status: 'available' as const, reason: t.slotFree };
    });
  }, [selectedDate, blockedSlots, appointments, t]);

  // Handle final submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!clientName.trim()) {
      setErrorMessage(t.fullNamePlaceholder);
      return;
    }
    if (!clientPhone.trim() || clientPhone.trim().length < 6) {
      setErrorMessage(t.phonePlaceholder);
      return;
    }
    if (!selectedDate || !selectedTime) {
      setErrorMessage(t.availableSlotsFor);
      return;
    }

    setIsSubmitting(true);
    try {
      const localizedService = (t.services as any)[selectedService.id] || selectedService;
      const res = await createAppointment({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim(),
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedTime,
        notes: notes.trim(),
        createdBy: 'client'
      });

      if (res.success && res.appointment) {
        // Ensure serviceName matches current localized language
        const appt = {
          ...res.appointment,
          serviceName: localizedService.name || res.appointment.serviceName
        };
        setConfirmedAppointment(appt);
        onBookingSuccess(appt);
        setStep(4);
      } else {
        setErrorMessage(res.message || 'Error');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('Ju lutem rishikoni të dhënat dhe provoni përsëri.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForNewBooking = () => {
    setStep(1);
    setSelectedTime('');
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setNotes('');
    setConfirmedAppointment(null);
    setErrorMessage(null);
  };

  const selectedLocalizedService = (t.services as any)[selectedService.id] || selectedService;

  return (
    <div id="booking-section" className="py-12 bg-white scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.simpleFastBooking}</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {t.bookingTitle}
          </h2>
          <p className="mt-2 text-stone-600 text-sm sm:text-base">
            {t.bookingSubtitle}
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-xl mx-auto relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full bg-pink-100 -z-0"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-pink-500 to-rose-500 -z-0 transition-all duration-300"
              style={{
                width: step === 1 ? '0%' : step === 2 ? '50%' : step === 3 ? '85%' : '100%'
              }}
            ></div>

            {[
              { num: 1, label: t.stepService },
              { num: 2, label: t.stepDateTime },
              { num: 3, label: t.stepInfo },
              { num: 4, label: t.stepConfirm }
            ].map(s => {
              const isActive = step === s.num;
              const isDone = step > s.num;
              return (
                <div key={s.num} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-xs ${
                      isActive
                        ? 'bg-gradient-to-tr from-pink-500 to-rose-500 text-white ring-4 ring-pink-100 scale-110'
                        : isDone
                        ? 'bg-rose-500 text-white'
                        : 'bg-white text-stone-400 border-2 border-pink-100'
                    }`}
                  >
                    {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : s.num}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isActive || isDone ? 'text-pink-600 font-semibold' : 'text-stone-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* STEP 1: Select Service */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
                {t.selectBeautyService}
              </h3>
              <span className="text-xs text-pink-600 font-semibold bg-pink-50 px-3 py-1 rounded-full">
                {t.fiveServicesCount}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {ALL_SERVICES.map(service => {
                const isSelected = selectedService.id === service.id;
                const localized = (t.services as any)[service.id] || service;

                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 luxury-card ${
                      isSelected
                        ? 'border-pink-500 shadow-lg shadow-pink-500/15 ring-2 ring-pink-200'
                        : 'border-pink-100 hover:border-pink-300'
                    }`}
                  >
                    {/* Image Header */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={service.image}
                        alt={localized.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent"></div>
                      
                      {/* Category / Badge */}
                      {localized.badge && (
                        <div className="absolute top-3 left-3 bg-pink-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                          {localized.badge}
                        </div>
                      )}

                      {/* Selected check circle */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white text-pink-600 flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}

                      {/* Price tag on image */}
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-xl text-stone-900 font-bold text-sm shadow-xs border border-pink-100">
                        {service.price} €
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 mb-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{t.durationLabel}: {service.duration} {t.minutesUnit}</span>
                      </div>
                      <h4 className="font-serif-luxury text-lg font-bold text-stone-900 mb-2 group-hover:text-pink-600 transition-colors">
                        {localized.name}
                      </h4>
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                        {localized.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-pink-50 flex items-center justify-between">
                        <span className="text-xs font-medium text-stone-500">
                          {t.categoryLabel}: <strong className="text-stone-800">{localized.category}</strong>
                        </span>
                        <span className={`text-xs font-semibold flex items-center gap-1 ${
                          isSelected ? 'text-pink-600' : 'text-stone-400 group-hover:text-pink-500'
                        }`}>
                          {isSelected ? t.selectedLabel : t.selectLabel}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Button */}
            <div className="pt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium text-sm shadow-md hover:shadow-pink-500/25 transition-all flex items-center gap-2"
              >
                <span>{t.continueToDateTime}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Date & Time */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
                  {t.stepDateTime}: {t.availableSlotsFor}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  <span className="font-bold text-pink-600">{selectedLocalizedService.name}</span> ({selectedService.duration} {t.minutesUnit} • {selectedService.price} €)
                </p>
              </div>

              <button
                onClick={() => setStep(1)}
                className="text-xs text-stone-600 hover:text-pink-600 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-pink-200 bg-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t.changeService}
              </button>
            </div>

            {/* Date Selection Carousel */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-pink-500" />
                {t.selectDay}
              </label>

              <div className="flex gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
                {nextDates.map(item => {
                  const isSelected = selectedDate === item.dateString;
                  return (
                    <button
                      key={item.dateString}
                      onClick={() => {
                        setSelectedDate(item.dateString);
                        setSelectedTime(''); // Reset time when date changes
                      }}
                      className={`shrink-0 w-24 py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border ${
                        isSelected
                          ? 'bg-gradient-to-b from-pink-500 to-rose-500 text-white border-pink-500 shadow-md scale-105 font-bold'
                          : 'bg-white text-stone-700 border-pink-100 hover:border-pink-300 hover:bg-pink-50/50'
                      }`}
                    >
                      <span className={`text-[11px] font-medium uppercase tracking-wider ${
                        isSelected ? 'text-pink-100' : 'text-pink-600'
                      }`}>
                        {item.isToday ? t.today : item.isTomorrow ? t.tomorrow : item.dayOfWeek}
                      </span>
                      <span className="text-xl font-bold my-0.5">{item.dayNumber}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-pink-100' : 'text-stone-400'}`}>
                        {item.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Grid */}
            <div className="bg-rose-50/50 rounded-3xl p-6 border border-pink-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pink-500" />
                    <span>{t.availableSlotsFor}</span>{' '}
                    <span className="text-pink-600 font-semibold">{selectedDate}</span>
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {t.clickGreenSlot}
                  </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-stone-600">{t.slotFree}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-stone-300"></span>
                    <span className="text-stone-600">{t.slotBooked}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-300"></span>
                    <span className="text-stone-600">{t.slotBlocked}</span>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {timeSlotStatuses.map(({ time, status, reason }) => {
                  const isSelected = selectedTime === time;

                  if (status === 'blocked') {
                    return (
                      <div
                        key={time}
                        className="py-3 px-4 rounded-xl border border-rose-200 bg-rose-100/50 text-rose-400 flex flex-col items-center justify-center cursor-not-allowed opacity-75"
                        title={reason}
                      >
                        <span className="text-sm font-semibold line-through">{time}</span>
                        <span className="text-[10px] text-rose-500 font-medium">{t.slotBlocked}</span>
                      </div>
                    );
                  }

                  if (status === 'booked') {
                    return (
                      <div
                        key={time}
                        className="py-3 px-4 rounded-xl border border-stone-200 bg-stone-100 text-stone-400 flex flex-col items-center justify-center cursor-not-allowed"
                        title={reason}
                      >
                        <span className="text-sm font-medium">{time}</span>
                        <span className="text-[10px] text-stone-500">{t.slotBooked}</span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-pink-600 text-white border-pink-600 shadow-md font-bold scale-102 ring-2 ring-pink-200'
                          : 'bg-white hover:bg-emerald-50 text-stone-800 border-pink-100 hover:border-emerald-300 shadow-2xs'
                      }`}
                    >
                      <span className="text-base font-bold">{time}</span>
                      <span className={`text-[11px] font-medium ${isSelected ? 'text-pink-100' : 'text-emerald-600'}`}>
                        {isSelected ? t.slotSelected : t.slotFree}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-full border border-pink-200 text-stone-700 hover:text-pink-600 text-sm font-medium flex items-center gap-2 hover:bg-pink-50"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.backBtn}
              </button>

              <button
                disabled={!selectedTime}
                onClick={() => setStep(3)}
                className={`px-8 py-3.5 rounded-full text-white font-medium text-sm transition-all flex items-center gap-2 ${
                  selectedTime
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 shadow-md hover:shadow-pink-500/25'
                    : 'bg-stone-300 cursor-not-allowed text-stone-500'
                }`}
              >
                <span>{t.continueToInfo}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Personal Information Form */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-pink-100">
              <h3 className="font-serif-luxury text-xl font-bold text-stone-900">
                3. {t.stepInfo}
              </h3>

              <button
                onClick={() => setStep(2)}
                className="text-xs text-stone-600 hover:text-pink-600 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-pink-200 bg-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t.changeTime}
              </button>
            </div>

            {/* Summary Mini-Card */}
            <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 rounded-2xl p-4 border border-pink-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 font-medium">{t.appointmentSummary}</p>
                <h4 className="text-base font-bold text-stone-900">{selectedLocalizedService.name}</h4>
                <p className="text-xs text-pink-600 font-semibold mt-0.5">
                  📅 {selectedDate} {t.timeLabel.toLowerCase()} {selectedTime} ({selectedService.duration} {t.minutesUnit})
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-stone-900">{selectedService.price} €</span>
                <p className="text-[10px] text-stone-400">{t.paymentAtSalon}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  {t.fullNameLabel} <span className="text-pink-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={t.fullNamePlaceholder}
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-hidden text-sm bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  {t.phoneLabel} <span className="text-pink-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder={t.phonePlaceholder}
                    value={clientPhone}
                    onChange={e => setClientPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-hidden text-sm bg-white"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  {t.phoneNotice}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  {t.emailLabel} <span className="text-stone-400 text-[10px] font-normal">{t.optionalLabel}</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={clientEmail}
                    onChange={e => setClientEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-hidden text-sm bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  {t.notesLabel} <span className="text-stone-400 text-[10px] font-normal">{t.optionalLabel}</span>
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <textarea
                    rows={3}
                    placeholder={t.notesPlaceholder}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-hidden text-sm bg-white resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Navigation and Submit */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-full border border-pink-200 text-stone-700 hover:text-pink-600 text-sm font-medium flex items-center gap-2 hover:bg-pink-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.backBtn}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-9 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-pink-600 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium text-sm shadow-md hover:shadow-pink-500/25 transition-all flex items-center gap-2 disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t.bookingProcessing}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.confirmBookingBtn}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* STEP 4: Luxury Confirmation Pass / Voucher */}
        {step === 4 && confirmedAppointment && (
          <div className="max-w-xl mx-auto space-y-6">
            
            {/* Success Notification */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-900">
                {t.bookingSuccessTitle}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm">
                {t.bookingSuccessDesc}
              </p>
            </div>

            {/* Cinematic Digital Ticket */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-pink-200 bg-white shadow-xl">
              
              {/* Ticket Top Header */}
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white text-center relative">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-pink-100 bg-white/20 px-3 py-1 rounded-full mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.digitalPassTitle}
                </div>
                <h4 className="font-serif-luxury text-2xl font-bold">Elegance Salon</h4>
                <p className="text-xs text-pink-100">{t.bookingCodeLabel} <strong>#{confirmedAppointment.id}</strong></p>
              </div>

              {/* Decorative ticket perforations */}
              <div className="relative flex items-center justify-between -mt-3.5 px-0">
                <div className="w-7 h-7 bg-white rounded-full -ml-3.5 border-r border-pink-200"></div>
                <div className="flex-1 border-t-2 border-dashed border-pink-200 mx-2"></div>
                <div className="w-7 h-7 bg-white rounded-full -mr-3.5 border-l border-pink-200"></div>
              </div>

              {/* Ticket Details Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-pink-100">
                  <div>
                    <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider block">{t.clientLabel}</span>
                    <strong className="text-sm text-stone-800">{confirmedAppointment.clientName}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider block">{t.phoneConfirmedLabel}</span>
                    <strong className="text-sm text-stone-800">{confirmedAppointment.clientPhone}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-pink-100">
                  <div>
                    <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider block">{t.serviceConfirmedLabel}</span>
                    <strong className="text-sm text-pink-600">
                      {(t.services as any)[confirmedAppointment.serviceId]?.name || confirmedAppointment.serviceName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider block">{t.priceLabel}</span>
                    <strong className="text-sm text-stone-900">{confirmedAppointment.servicePrice} €</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-pink-100">
                  <div>
                    <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider block">{t.dateLabel}</span>
                    <strong className="text-sm text-stone-800">📅 {confirmedAppointment.date}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-400 font-medium uppercase tracking-wider block">{t.timeLabel}</span>
                    <strong className="text-sm text-stone-800">⏰ {confirmedAppointment.time}</strong>
                  </div>
                </div>

                {confirmedAppointment.notes && (
                  <div className="p-3 rounded-xl bg-pink-50/60 text-xs text-stone-600">
                    <span className="font-bold text-stone-700">{t.noteLabel}</span> {confirmedAppointment.notes}
                  </div>
                )}

                <div className="pt-2 text-center text-xs text-stone-500">
                  {t.salonAddressNotice}
                </div>
              </div>

              {/* Action buttons on ticket */}
              <div className="bg-pink-50/50 p-4 border-t border-pink-100 flex items-center justify-center sm:justify-end">
                <a
                  href={`https://wa.me/355692000000?text=${encodeURIComponent(
                    `Buchung #${confirmedAppointment.id}: ${confirmedAppointment.serviceName} - ${confirmedAppointment.date} ${confirmedAppointment.time}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto justify-center px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{t.openInWhatsApp}</span>
                </a>
              </div>

            </div>

            {/* Back / Book Another Button */}
            <div className="text-center pt-4">
              <button
                onClick={resetForNewBooking}
                className="px-8 py-3 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold text-xs tracking-wider uppercase transition-colors"
              >
                {t.bookAnotherBtn}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
