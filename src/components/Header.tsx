import React from 'react';
import { Sparkles, Calendar, Phone, Clock } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  onGoToBooking: () => void;
  onGoToServices: () => void;
  activeTab: 'booking' | 'admin' | 'services';
  setActiveTab: (tab: 'booking' | 'admin' | 'services') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onGoToBooking,
  onGoToServices,
  activeTab,
  setActiveTab
}) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => {
              setActiveTab('booking');
              onGoToBooking();
            }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-400 to-pink-300 p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-wide text-stone-900 group-hover:text-pink-600 transition-colors">
                  Elegance
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-pink-500"></span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium tracking-widest uppercase text-pink-600/80 -mt-1">
                {t.brandSubtitle}
              </p>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-rose-50/70 p-1.5 rounded-full border border-pink-100">
            <button
              onClick={() => {
                setActiveTab('booking');
                onGoToBooking();
              }}
              className={`px-4 lg:px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'booking'
                  ? 'bg-white text-pink-600 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-pink-600 hover:bg-white/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{t.bookAppointment}</span>
            </button>

            <button
              onClick={onGoToServices}
              className={`px-4 lg:px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'services'
                  ? 'bg-white text-pink-600 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-pink-600 hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.ourServices}</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Phone (Desktop) */}
            <a
              href="tel:+355692000000"
              className="hidden xl:flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-pink-600 bg-white px-3 py-2 rounded-xl border border-pink-100 shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-pink-500" />
              <span>{t.phone}</span>
            </a>

            {/* Language Switcher at Top Right */}
            <LanguageSwitcher />

            {/* Book Now Button */}
            <button
              onClick={onGoToBooking}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md hover:shadow-pink-500/25 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 shrink-0"
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t.bookNow}</span>
              <span className="sm:hidden">{t.bookNow}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
