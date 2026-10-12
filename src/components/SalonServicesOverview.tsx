import React from 'react';
import { Sparkles, Clock, Check, ArrowRight } from 'lucide-react';
import { ALL_SERVICES } from '../services/api';
import { SalonService } from '../types/salon';
import { useLanguage } from '../context/LanguageContext';

interface SalonServicesOverviewProps {
  onSelectService: (service: SalonService) => void;
}

export const SalonServicesOverview: React.FC<SalonServicesOverviewProps> = ({ onSelectService }) => {
  const { t } = useLanguage();

  return (
    <section id="services-section" className="py-16 bg-gradient-to-b from-white via-rose-50/30 to-white border-t border-pink-100/70 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>{t.excellenceBadge}</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
            {t.showcaseTitle}
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
            {t.showcaseSubtitle}
          </p>
        </div>

        {/* 5 Core Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ALL_SERVICES.map((srv) => {
            const localized = (t.services as any)[srv.id] || {
              name: srv.name,
              category: srv.category,
              description: srv.description,
              badge: srv.badge
            };

            return (
              <div
                key={srv.id}
                className="group relative rounded-3xl overflow-hidden bg-white border border-pink-100/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Banner */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={srv.image}
                      alt={localized.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent"></div>

                    {/* Badge */}
                    {localized.badge && (
                      <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-pink-600 text-[11px] font-bold shadow-xs">
                        {localized.badge}
                      </span>
                    )}

                    {/* Price Tag */}
                    <div className="absolute bottom-4 right-4 bg-pink-600 text-white font-bold px-3.5 py-1 rounded-xl text-sm shadow-md">
                      {srv.price} €
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{srv.duration} {t.minutesUnit} {t.durationLabel.toLowerCase()}</span>
                    </div>

                    <h3 className="font-serif-luxury text-xl font-bold text-stone-900 group-hover:text-pink-600 transition-colors">
                      {localized.name}
                    </h3>

                    <p className="mt-2 text-stone-600 text-xs sm:text-sm leading-relaxed">
                      {localized.description}
                    </p>

                    {/* Benefits bullet points */}
                    <div className="mt-4 pt-4 border-t border-pink-50 space-y-1.5 text-xs text-stone-600">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{t.consultationBenefit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{t.premiumProductsBenefit}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => onSelectService(srv)}
                    className="w-full py-3 rounded-2xl bg-rose-50 group-hover:bg-pink-600 text-pink-700 group-hover:text-white font-semibold text-xs tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>{t.bookThisServiceBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
