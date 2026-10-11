import React from 'react';
import { Sparkles, Calendar, Heart, Award, Shield } from 'lucide-react';

interface HeroProps {
  onStartBooking: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartBooking, onExploreServices }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-rose-100/60 via-pink-50/40 to-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-pink-100/60">
      
      {/* Decorative luxury blur orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-rose-200/30 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-pink-100/50 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-pink-200 shadow-xs text-xs font-semibold text-pink-600 tracking-wide">
              <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
              <span>Salloni Ekskluziv i Bukurisë për Femra</span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
              <span className="text-stone-500">Tiranë</span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-bold tracking-tight leading-[1.15]">
              Bukuria dhe Eleganca{' '}
              <span className="relative whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500">
                që Meritoni
              </span>
            </h1>

            {/* Subtitle in Albanian */}
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Zgjidhni shërbimin tuaj të preferuar: stilim dhe zgjatim flokësh, grim profesional glamour, manikyr luksoz dhe zgjatim qerpikësh. Rezervoni orarin e lirë online me konfirmim të menjëhershëm.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onStartBooking}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-pink-600 to-rose-500 text-white font-medium text-base shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <Calendar className="w-5 h-5 text-pink-100" />
                <span>Rezervo Takimin Online</span>
              </button>

              <button
                onClick={onExploreServices}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white text-stone-700 hover:text-pink-600 border border-pink-200 font-medium text-base shadow-xs hover:border-pink-300 hover:bg-pink-50/50 transition-all flex items-center justify-center gap-2"
              >
                <span>Eksploro Shërbimet</span>
              </button>
            </div>

            {/* Highlights feature list */}
            <div className="pt-6 grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 border-t border-pink-100/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-stone-900">100% Cilësi</p>
                  <p className="text-[11px] text-stone-500">Produkte Premium</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-stone-900">Live Kalendar</p>
                  <p className="text-[11px] text-stone-500">Orare të Lira</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-stone-900">Higjienë & Kujdes</p>
                  <p className="text-[11px] text-stone-500">Sterilizim i Plotë</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Cinematic Imagery Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glow backdrop frame */}
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-400 to-rose-300 rounded-3xl rotate-2 opacity-30 blur-lg"></div>

              {/* Main Image Card */}
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
                  alt="Elegance Beauty Salon"
                  className="w-full h-[400px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent"></div>

                {/* Floating reviews / satisfaction pill */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-pink-100 shadow-lg flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-0.5">
                      {'★★★★★'.split('').map((s, i) => (
                        <span key={i} className="text-sm">{s}</span>
                      ))}
                      <span className="text-xs font-bold text-stone-800 ml-1">4.9 / 5.0</span>
                    </div>
                    <p className="text-xs text-stone-600 font-medium">Mbi 2,500+ kliente të lumtura</p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                    <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
                  </div>
                </div>

              </div>

              {/* Floating Mini Card: Shërbimet Kyçe */}
              <div className="hidden sm:flex absolute -top-5 -left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-pink-100 shadow-xl items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">5 Shërbime Kryesore</p>
                  <p className="text-[11px] text-pink-600 font-medium">Flokë • Grim • Thonj • Qerpikë</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
