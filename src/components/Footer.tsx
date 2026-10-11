import React from 'react';
import { Sparkles, MapPin, Phone, Mail, Clock, Lock, Heart, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, isAdminLoggedIn }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-pink-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
                Elegance
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Salloni lider për femra dedikuar kujdesit dhe bukurisë suaj. Eksperiencë luksoze, produkte elitare dhe stilistë të specializuar.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800 text-[11px] text-pink-400 border border-stone-700">
                <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                Besueshmëri 100%
              </span>
            </div>
          </div>

          {/* Shërbimet Kryesore */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Shërbimet Tona</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>• Stilim & Prerje Flokësh</li>
              <li>• Zgjatime Flokësh (Keratinë / Tape)</li>
              <li>• Grim Profesional (Glamour / Nusesh)</li>
              <li>• Manikyr me Xhel & Tipsa</li>
              <li>• Zgjatim Qerpikësh (3D - 6D Volume)</li>
            </ul>
          </div>

          {/* Orari & Lokacioni */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Orari i Punës</h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-stone-200 font-medium">E Hënë - E Shtunë:</p>
                  <p>09:00 - 19:00</p>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-pink-500/70 shrink-0 mt-0.5" />
                <div>
                  <p className="text-stone-200 font-medium">E Diel:</p>
                  <p>10:00 - 17:00 (Vetëm me Rezervim)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Kontakti & Admin */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Kontakti & Adresa</h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-pink-500 shrink-0" />
                <span>Rruga Myslym Shyri, Nr. 45, Tiranë</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pink-500 shrink-0" />
                <span>+355 69 200 0000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-500 shrink-0" />
                <span>info@elegance-salon.al</span>
              </div>

              {/* Admin Access Button in Footer */}
              <div className="pt-3">
                <button
                  onClick={onOpenAdmin}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {isAdminLoggedIn ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Hap Panelin e Administratorit</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-pink-400" />
                      <span>Hyrja e Administratorit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copy */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Elegance Sallon Bukurie. Të gjitha të drejtat të rezervuara.</p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Privatësia</span>
            <span>•</span>
            <span>Kushtet e Përdorimit</span>
            <span>•</span>
            <span className="text-pink-400">Tiranë, Shqipëri</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
