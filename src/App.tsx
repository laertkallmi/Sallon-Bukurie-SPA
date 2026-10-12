import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BookingFlow } from './components/BookingFlow';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SalonServicesOverview } from './components/SalonServicesOverview';
import { Footer } from './components/Footer';
import { Appointment, BlockedSlot, SalonService } from './types/salon';
import { fetchAppointments, fetchBlockedSlots } from './services/api';
import { LanguageProvider } from './context/LanguageContext';

function SalonApp() {
  const [activeTab, setActiveTab] = useState<'booking' | 'admin' | 'services'>('booking');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('salon_admin_auth') === 'true';
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);

  // App-level appointments and blocked slots
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);

  // Initial load
  const loadInitialData = async () => {
    try {
      const [appts, blk] = await Promise.all([
        fetchAppointments(),
        fetchBlockedSlots()
      ]);
      setAppointments(appts);
      setBlockedSlots(blk);
    } catch (e) {
      console.error('Error fetching initial data:', e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    localStorage.setItem('salon_admin_auth', 'true');
    setShowAdminLoginModal(false);
    setActiveTab('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('salon_admin_auth');
    setActiveTab('booking');
  };

  const scrollToBooking = () => {
    setActiveTab('booking');
    setTimeout(() => {
      const el = document.getElementById('booking-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const scrollToServices = () => {
    // If admin is active, switch to booking view so client sections exist
    if (activeTab === 'admin') {
      setActiveTab('booking');
    }
    setTimeout(() => {
      const el = document.getElementById('services-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  const handleServiceSelectFromOverview = (_srv: SalonService) => {
    scrollToBooking();
  };

  const handleBookingSuccess = (newAppointment: Appointment) => {
    setAppointments(prev => [newAppointment, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-800">
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGoToBooking={scrollToBooking}
        onGoToServices={scrollToServices}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'admin' && isAdminLoggedIn ? (
          <AdminPanel onLogout={handleAdminLogout} />
        ) : (
          <>
            {/* Hero Section */}
            <Hero
              onStartBooking={scrollToBooking}
              onExploreServices={scrollToServices}
            />

            {/* Core Booking Flow */}
            <BookingFlow
              appointments={appointments}
              blockedSlots={blockedSlots}
              onBookingSuccess={handleBookingSuccess}
            />

            {/* Services Showcase */}
            <SalonServicesOverview
              onSelectService={handleServiceSelectFromOverview}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={() => {
          if (isAdminLoggedIn) {
            setActiveTab('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            setShowAdminLoginModal(true);
          }
        }}
      />

      {/* Admin 6-digit Code (230306) Login Modal */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onSuccess={handleAdminLoginSuccess}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <SalonApp />
    </LanguageProvider>
  );
}
