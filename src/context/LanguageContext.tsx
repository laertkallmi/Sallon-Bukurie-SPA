import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'sq' | 'de';

export interface Translations {
  // Brand
  brandName: string;
  brandSubtitle: string;
  brandFullName: string;

  // Navigation
  bookAppointment: string;
  ourServices: string;
  bookNow: string;
  adminPanel: string;
  staffAccess: string;
  phone: string;

  // Hero
  exclusiveSalonBadge: string;
  heroCity: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroBookBtn: string;
  heroExploreBtn: string;
  qualityBadge: string;
  qualitySub: string;
  calendarBadge: string;
  calendarSub: string;
  hygieneBadge: string;
  hygieneSub: string;
  reviewsCount: string;
  fiveCoreServices: string;
  servicesSubtitleShort: string;

  // Booking Flow
  bookingTitle: string;
  bookingSubtitle: string;
  simpleFastBooking: string;
  stepService: string;
  stepDateTime: string;
  stepInfo: string;
  stepConfirm: string;
  selectBeautyService: string;
  fiveServicesCount: string;
  durationLabel: string;
  minutesUnit: string;
  categoryLabel: string;
  selectedLabel: string;
  selectLabel: string;
  continueToDateTime: string;
  changeService: string;
  selectDay: string;
  availableSlotsFor: string;
  clickGreenSlot: string;
  slotFree: string;
  slotBooked: string;
  slotBlocked: string;
  slotSelected: string;
  backBtn: string;
  continueToInfo: string;
  changeTime: string;
  appointmentSummary: string;
  paymentAtSalon: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  phoneNotice: string;
  emailLabel: string;
  optionalLabel: string;
  notesLabel: string;
  notesPlaceholder: string;
  confirmBookingBtn: string;
  bookingProcessing: string;

  // Confirmation Pass
  bookingSuccessTitle: string;
  bookingSuccessDesc: string;
  digitalPassTitle: string;
  bookingCodeLabel: string;
  clientLabel: string;
  phoneConfirmedLabel: string;
  serviceConfirmedLabel: string;
  priceLabel: string;
  dateLabel: string;
  timeLabel: string;
  noteLabel: string;
  salonAddressNotice: string;
  openInWhatsApp: string;
  bookAnotherBtn: string;

  // Services Showcase
  excellenceBadge: string;
  showcaseTitle: string;
  showcaseSubtitle: string;
  consultationBenefit: string;
  premiumProductsBenefit: string;
  bookThisServiceBtn: string;

  // Footer
  footerBio: string;
  trustBadge: string;
  workingHoursTitle: string;
  monSatHours: string;
  sunHours: string;
  sunByApptOnly: string;
  contactAddressTitle: string;
  rightsReserved: string;
  privacyPolicy: string;
  termsOfUse: string;
  countryNotice: string;
  adminLoginBtn: string;
  openAdminPanelBtn: string;

  // Admin Login Modal
  adminLoginTitle: string;
  adminLoginDesc: string;
  adminLoginVerifying: string;
  wrongPinError: string;
  clearBtn: string;
  deleteBtn: string;

  // Calendar Helpers
  today: string;
  tomorrow: string;
  daysShort: string[];
  months: string[];

  // Services Data
  services: {
    hair: { name: string; category: string; description: string; badge: string };
    extension: { name: string; category: string; description: string; badge: string };
    makeup: { name: string; category: string; description: string; badge: string };
    nails: { name: string; category: string; description: string; badge: string };
    eyelashes: { name: string; category: string; description: string; badge: string };
  };

  // Admin Panel
  admin: {
    dashboardTitle: string;
    liveSync: string;
    lastUpdated: string;
    viewClientSite: string;
    logout: string;
    todayAppointments: string;
    todayRevenue: string;
    pendingCount: string;
    allAppointments: string;
    whoComesToday: string;
    whoComesTodayDesc: string;
    allBookingsTab: string;
    blockSlotsTab: string;
    manualBookingTab: string;
    searchPlaceholder: string;
    filterAll: string;
    statusConfirmed: string;
    statusPending: string;
    statusCompleted: string;
    statusCancelled: string;
    statusFree: string;
    statusBlocked: string;
    noApptsToday: string;
    clientAndPhone: string;
    serviceAndPrice: string;
    dateTime: string;
    statusLabel: string;
    actionsLabel: string;
    callBtn: string;
    whatsAppBtn: string;
    deleteBtn: string;
    confirmDeleteMsg: string;
    manageSlotsTitle: string;
    manageSlotsDesc: string;
    blockWholeDay: string;
    unblockWholeDay: string;
    manualTitle: string;
    manualDesc: string;
    saveBookingBtn: string;
    newBookingToastTitle: string;
    newBookingToastNow: string;
    newBookingToastDesc: string;
  };
}

export const translations: Record<Language, Translations> = {
  sq: {
    brandName: 'Elegance',
    brandSubtitle: 'Sallon Bukurie & Spa',
    brandFullName: 'Elegance Sallon Bukurie & Spa',

    bookAppointment: 'Rezervo Takim',
    ourServices: 'Shërbimet Tona',
    bookNow: 'Rezervo Menjëherë',
    adminPanel: 'Paneli Admin',
    staffAccess: 'Hyrja e Administratorit',
    phone: '+355 69 200 0000',

    exclusiveSalonBadge: 'Salloni Ekskluziv i Bukurisë për Femra',
    heroCity: 'Tiranë',
    heroTitle1: 'Bukuria dhe Eleganca',
    heroTitleHighlight: 'që Meritoni',
    heroSubtitle: 'Zgjidhni shërbimin tuaj të preferuar: stilim dhe zgjatim flokësh, grim profesional glamour, manikyr luksoz dhe zgjatim qerpikësh. Rezervoni orarin e lirë online me konfirmim të menjëhershëm.',
    heroBookBtn: 'Rezervo Takimin Online',
    heroExploreBtn: 'Eksploro Shërbimet',
    qualityBadge: '100% Cilësi',
    qualitySub: 'Produkte Premium',
    calendarBadge: 'Live Kalendar',
    calendarSub: 'Orare të Lira',
    hygieneBadge: 'Higjienë & Kujdes',
    hygieneSub: 'Sterilizim i Plotë',
    reviewsCount: 'Mbi 2,500+ kliente të lumtura',
    fiveCoreServices: '5 Shërbime Kryesore',
    servicesSubtitleShort: 'Flokë • Grim • Thonj • Qerpikë',

    bookingTitle: 'Kalendari i Rezervimeve Online',
    bookingSubtitle: 'Zgjidhni shërbimin, orarin që ju përshtatet më së miri dhe plotësoni të dhënat tuaja.',
    simpleFastBooking: 'Rezervim i Thjeshtë & i Shpejtë',
    stepService: 'Shërbimi',
    stepDateTime: 'Data & Ora',
    stepInfo: 'Të Dhënat',
    stepConfirm: 'Konfirmimi',
    selectBeautyService: '1. Zgjidhni Shërbimin e Bukurisë',
    fiveServicesCount: '5 Shërbime Profesionale',
    durationLabel: 'Kohëzgjatja',
    minutesUnit: 'minuta',
    categoryLabel: 'Kategoria',
    selectedLabel: 'E Zgjedhur',
    selectLabel: 'Zgjidh',
    continueToDateTime: 'Vazhdo te Data & Ora',
    changeService: 'Ndrysho Shërbimin',
    selectDay: 'Zgjidhni Ditën:',
    availableSlotsFor: 'Oraret e Disponueshme për datën:',
    clickGreenSlot: 'Kliko mbi orarin e gjelbër për ta zgjedhur.',
    slotFree: 'I Lirë',
    slotBooked: 'I Rezervuar',
    slotBlocked: 'I Bllokuar',
    slotSelected: '✓ Zgjedhur',
    backBtn: 'Mbrapa',
    continueToInfo: 'Vazhdo te Të Dhënat',
    changeTime: 'Ndrysho Orarin',
    appointmentSummary: 'Përmbledhje e Terminit:',
    paymentAtSalon: 'Pagesa në sallon',
    fullNameLabel: 'Emri dhe Mbiemri',
    fullNamePlaceholder: 'p.sh. Valbona Krasniqi',
    phoneLabel: 'Numri i Telefonit (WhatsApp)',
    phonePlaceholder: 'p.sh. +355 69 123 4567',
    phoneNotice: 'Do të merrni konfirmimin dhe njoftimin në këtë numër.',
    emailLabel: 'Email Adresa',
    optionalLabel: '(Opsionale)',
    notesLabel: 'Kërkesa Shtesë ose Shënime',
    notesPlaceholder: 'p.sh. Kam një event mbrëmjeje në orën 20:00, dëshiroj onde voluminoze...',
    confirmBookingBtn: 'Konfirmo Rezervimin Tani',
    bookingProcessing: 'Po rezervohet...',

    bookingSuccessTitle: 'Termini u Rezervua me Sukses!',
    bookingSuccessDesc: 'Faleminderit që zgjodhët Elegance Sallon Bukurie. Ju presim me kënaqësi!',
    digitalPassTitle: 'Bileta Dixhitale e Terminit',
    bookingCodeLabel: 'Kodi i Rezervimit:',
    clientLabel: 'Klientja:',
    phoneConfirmedLabel: 'Numri i Telefonit:',
    serviceConfirmedLabel: 'Shërbimi:',
    priceLabel: 'Çmimi:',
    dateLabel: 'Data:',
    timeLabel: 'Ora e Fillimit:',
    noteLabel: 'Shënim:',
    salonAddressNotice: '📍 Adresa: Rruga Myslym Shyri, Nr. 45, Tiranë • 📞 +355 69 200 0000',
    openInWhatsApp: 'Hap Konfirmimin në WhatsApp',
    bookAnotherBtn: '+ Bëj Një Rezervim Tjetër',

    excellenceBadge: 'Ekselencë & Estetikë',
    showcaseTitle: 'Shërbimet Tona Ekskluzive',
    showcaseSubtitle: 'Përkushtim i veçantë për çdo detaj të bukurisë suaj. Staf i kualifikuar ndërkombëtarisht dhe produkte të markave më prestigjioze botërore.',
    consultationBenefit: 'Këshillim i personalizuar falas',
    premiumProductsBenefit: 'Produkte premium të certifikuara',
    bookThisServiceBtn: 'Rezervo Këtë Shërbim',

    footerBio: 'Salloni lider për femra dedikuar kujdesit dhe bukurisë suaj. Eksperiencë luksoze, produkte elitare dhe stilistë të specializuar.',
    trustBadge: 'Besueshmëri 100%',
    workingHoursTitle: 'Orari i Punës',
    monSatHours: 'E Hënë - E Shtunë: 09:00 - 19:00',
    sunHours: 'E Diel: 10:00 - 17:00',
    sunByApptOnly: '(Vetëm me Rezervim)',
    contactAddressTitle: 'Kontakti & Adresa',
    rightsReserved: 'Të gjitha të drejtat të rezervuara.',
    privacyPolicy: 'Privatësia',
    termsOfUse: 'Kushtet e Përdorimit',
    countryNotice: 'Tiranë, Shqipëri',
    adminLoginBtn: 'Hyrja e Administratorit',
    openAdminPanelBtn: 'Hap Panelin e Administratorit',

    adminLoginTitle: 'Hyrja e Administratorit',
    adminLoginDesc: 'Vendosni kodin 6-shifror të sigurisë për të hyrë në panel.',
    adminLoginVerifying: 'Duke verifikuar kodin...',
    wrongPinError: 'Kodi 6-shifror është i pasaktë! Provoni përsëri.',
    clearBtn: 'Pastro',
    deleteBtn: 'Fshi',

    today: 'Sot',
    tomorrow: 'Nesër',
    daysShort: ['Dje', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht'],
    months: [
      'Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
      'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'
    ],

    services: {
      hair: {
        name: 'Stilim & Prerje Flokësh',
        category: 'Flokë',
        description: 'Larje relaksuese, tharje profesionale, prerje moderne dhe stilim me onde ose drekë/mbrëmje.',
        badge: 'Më e Kërkuara'
      },
      extension: {
        name: 'Zgjatim Flokësh (Extensions)',
        category: 'Zgjatim',
        description: 'Zgjatime premium me fije 100% natyrale: Keratinë, Tape-in ose Micro-ring me volum të plotë.',
        badge: 'Premium'
      },
      makeup: {
        name: 'Grim Profesional (Make Up)',
        category: 'Grim',
        description: 'Grim artistik për evente, dasma dhe mbrëmje me produkte luksoze dhe fiksim 24-orësh.',
        badge: 'Glamour'
      },
      nails: {
        name: 'Thonj & Manikyr / Pedikyr',
        category: 'Thonj',
        description: 'Manikyr me xhel, tipsa, formësim i përsosur, dizajne nail art dhe trajtim hidratues.',
        badge: 'Popullore'
      },
      eyelashes: {
        name: 'Zgjatim Qerpikësh (Eyelashes)',
        category: 'Qerpikë',
        description: 'Teknika Volume rus (3D-6D) dhe Klasik 1:1, efekt natyral ose dramatik, rezistent ndaj ujit.',
        badge: 'Trend'
      }
    },

    admin: {
      dashboardTitle: 'Paneli i Administratorit',
      liveSync: 'Sinkronizimi aktiv (çdo 2s)',
      lastUpdated: 'Përditësuar:',
      viewClientSite: 'Shiko Faqen e Klientes',
      logout: 'Dil nga Paneli',
      todayAppointments: 'Termine Sot',
      todayRevenue: 'Të Ardhura Sot',
      pendingCount: 'Në Pritje',
      allAppointments: 'Të Gjitha Terminet',
      whoComesToday: 'Kush Vjen Sot',
      whoComesTodayDesc: 'Axhenda e Ditës së Sotme:',
      allBookingsTab: 'Të Gjitha Rezervimet',
      blockSlotsTab: 'Blloko / Liro Orare',
      manualBookingTab: '+ Shto Rezervim Manual',
      searchPlaceholder: 'Kërko sipas emrit, telefonit ose kodit të terminit...',
      filterAll: 'Të gjitha',
      statusConfirmed: 'Konfirmuar',
      statusPending: 'Në Pritje',
      statusCompleted: 'Përfunduar',
      statusCancelled: 'Anuluar',
      statusFree: 'I Lirë',
      statusBlocked: 'I Bllokuar',
      noApptsToday: 'Nuk ka termine të regjistruara për sot.',
      clientAndPhone: 'Klientja & Telefoni',
      serviceAndPrice: 'Shërbimi & Çmimi',
      dateTime: 'Data & Ora',
      statusLabel: 'Statusi',
      actionsLabel: 'Veprime',
      callBtn: 'Telefono',
      whatsAppBtn: 'WhatsApp',
      deleteBtn: 'Fshi',
      confirmDeleteMsg: 'A jeni të sigurt që dëshironi të fshini këtë termin?',
      manageSlotsTitle: 'Menaxhimi i Orareve: Blloko ose Liro',
      manageSlotsDesc: 'Zgjidhni një datë dhe klikoni mbi oraret për t\'i bllokuar (p.sh. pushim, dezinfektim), ose për t\'i liruar që klientët të mund të rezervojnë.',
      blockWholeDay: 'Blloko Tërë Ditën',
      unblockWholeDay: 'Liro Tërë Ditën',
      manualTitle: 'Regjistro një Termin të Ri Manualisht (Walk-in)',
      manualDesc: 'Plotësoni të dhënat e klientes që erdhi direkt në sallon ose telefonoi.',
      saveBookingBtn: 'Regjistro Terminin',
      newBookingToastTitle: 'Rezervim i Ri Online!',
      newBookingToastNow: 'Tani',
      newBookingToastDesc: 'sapo rezervoi'
    }
  },

  de: {
    brandName: 'Elegance',
    brandSubtitle: 'Schönheitssalon & Spa',
    brandFullName: 'Elegance Schönheitssalon & Spa',

    bookAppointment: 'Termin Buchen',
    ourServices: 'Unsere Dienstleistungen',
    bookNow: 'Jetzt Buchen',
    adminPanel: 'Admin-Bereich',
    staffAccess: 'Mitarbeiter-Login',
    phone: '+355 69 200 0000',

    exclusiveSalonBadge: 'Exklusiver Schönheitssalon für Damen',
    heroCity: 'Tirana',
    heroTitle1: 'Schönheit und Eleganz,',
    heroTitleHighlight: 'die Sie Verdienen',
    heroSubtitle: 'Wählen Sie Ihre Lieblingsbehandlung: Haarstyling und Haarverlängerung, glamouröses Make-up, luxuriöse Nagelpflege und Wimpernverlängerung. Buchen Sie Ihren Wunschtermin online mit sofortiger Bestätigung.',
    heroBookBtn: 'Online-Termin Buchen',
    heroExploreBtn: 'Dienstleistungen Entdecken',
    qualityBadge: '100% Qualität',
    qualitySub: 'Premium-Produkte',
    calendarBadge: 'Live-Kalender',
    calendarSub: 'Freie Termine',
    hygieneBadge: 'Hygiene & Schutz',
    hygieneSub: 'Vollständige Sterilisation',
    reviewsCount: 'Über 2.500+ zufriedene Kundinnen',
    fiveCoreServices: '5 Hauptdienstleistungen',
    servicesSubtitleShort: 'Haare • Make-up • Nägel • Wimpern',

    bookingTitle: 'Online-Terminkalender',
    bookingSubtitle: 'Wählen Sie Ihren Service, die passende Uhrzeit und tragen Sie Ihre Daten ein.',
    simpleFastBooking: 'Einfache & Schnelle Buchung',
    stepService: 'Service',
    stepDateTime: 'Datum & Zeit',
    stepInfo: 'Ihre Daten',
    stepConfirm: 'Bestätigung',
    selectBeautyService: '1. Wählen Sie Ihre Schönheitsbehandlung',
    fiveServicesCount: '5 Professionelle Services',
    durationLabel: 'Dauer',
    minutesUnit: 'Minuten',
    categoryLabel: 'Kategorie',
    selectedLabel: 'Ausgewählt',
    selectLabel: 'Wählen',
    continueToDateTime: 'Weiter zu Datum & Uhrzeit',
    changeService: 'Service ändern',
    selectDay: 'Tag auswählen:',
    availableSlotsFor: 'Verfügbare Uhrzeiten für:',
    clickGreenSlot: 'Klicken Sie auf ein grünes Zeitfenster zur Auswahl.',
    slotFree: 'Frei',
    slotBooked: 'Gebucht',
    slotBlocked: 'Blockiert',
    slotSelected: '✓ Ausgewählt',
    backBtn: 'Zurück',
    continueToInfo: 'Weiter zu Ihren Daten',
    changeTime: 'Uhrzeit ändern',
    appointmentSummary: 'Terminzusammenfassung:',
    paymentAtSalon: 'Zahlung im Salon',
    fullNameLabel: 'Vor- und Nachname',
    fullNamePlaceholder: 'z.B. Anna Schmidt',
    phoneLabel: 'Telefonnummer (WhatsApp)',
    phonePlaceholder: 'z.B. +49 170 1234567',
    phoneNotice: 'Sie erhalten die Bestätigung und Benachrichtigung auf diese Nummer.',
    emailLabel: 'E-Mail-Adresse',
    optionalLabel: '(Optional)',
    notesLabel: 'Besondere Wünsche oder Notizen',
    notesPlaceholder: 'z.B. Ich habe abends eine Feier um 20:00 Uhr, wünsche mir voluminöse Locken...',
    confirmBookingBtn: 'Termin Jetzt Bestätigen',
    bookingProcessing: 'Wird gebucht...',

    bookingSuccessTitle: 'Termin erfolgreich gebucht!',
    bookingSuccessDesc: 'Vielen Dank, dass Sie den Elegance Beauty Salon gewählt haben. Wir freuen uns auf Sie!',
    digitalPassTitle: 'Digitale Buchungskarte',
    bookingCodeLabel: 'Buchungscode:',
    clientLabel: 'Kundin:',
    phoneConfirmedLabel: 'Telefonnummer:',
    serviceConfirmedLabel: 'Behandlung:',
    priceLabel: 'Preis:',
    dateLabel: 'Datum:',
    timeLabel: 'Startzeit:',
    noteLabel: 'Notiz:',
    salonAddressNotice: '📍 Adresse: Rruga Myslym Shyri, Nr. 45, Tirana • 📞 +355 69 200 0000',
    openInWhatsApp: 'Bestätigung in WhatsApp öffnen',
    bookAnotherBtn: '+ Weiteren Termin Buchen',

    excellenceBadge: 'Exzellenz & Ästhetik',
    showcaseTitle: 'Unsere Exklusiven Behandlungen',
    showcaseSubtitle: 'Besondere Hingabe für jedes Detail Ihrer Schönheit. International geschultes Fachpersonal und weltweit renommierte Markenprodukte.',
    consultationBenefit: 'Kostenlose persönliche Beratung',
    premiumProductsBenefit: 'Zertifizierte Premium-Kosmetik',
    bookThisServiceBtn: 'Diesen Service Buchen',

    footerBio: 'Führender Damen-Schönheitssalon für Ihre persönliche Pflege und Eleganz. Luxuriöses Ambiente, hochkarätige Produkte und erfahrene Stylisten.',
    trustBadge: '100% Zuverlässigkeit',
    workingHoursTitle: 'Öffnungszeiten',
    monSatHours: 'Montag - Samstag: 09:00 - 19:00 Uhr',
    sunHours: 'Sonntag: 10:00 - 17:00 Uhr',
    sunByApptOnly: '(Nur nach Voranmeldung)',
    contactAddressTitle: 'Kontakt & Anfahrt',
    rightsReserved: 'Alle Rechte vorbehalten.',
    privacyPolicy: 'Datenschutz',
    termsOfUse: 'Nutzungsbedingungen',
    countryNotice: 'Tirana, Albanien',
    adminLoginBtn: 'Mitarbeiter-Login',
    openAdminPanelBtn: 'Admin-Bereich Öffnen',

    adminLoginTitle: 'Mitarbeiter-Login',
    adminLoginDesc: 'Geben Sie den 6-stelligen Sicherheitscode ein, um fortzufahren.',
    adminLoginVerifying: 'Code wird überprüft...',
    wrongPinError: 'Der 6-stellige Code ist ungültig! Bitte erneut versuchen.',
    clearBtn: 'Löschen',
    deleteBtn: 'Zurück',

    today: 'Heute',
    tomorrow: 'Morgen',
    daysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    months: [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ],

    services: {
      hair: {
        name: 'Haarstyling & Haarschnitt',
        category: 'Haare',
        description: 'Entspannendes Waschen, professionelles Föhnen, moderne Schnitte und glamouröses Styling mit Locken.',
        badge: 'Bestseller'
      },
      extension: {
        name: 'Haarverlängerung (Extensions)',
        category: 'Extensions',
        description: 'Premium-Echthaar-Verlängerung: Keratin-Bondings, Tape-in oder Micro-Ringe für maximales Volumen.',
        badge: 'Premium'
      },
      makeup: {
        name: 'Professionelles Make-up',
        category: 'Make-up',
        description: 'Künstlerisches Event-, Braut- und Abend-Make-up mit Luxuskosmetik und 24-Stunden-Haltbarkeit.',
        badge: 'Glamour'
      },
      nails: {
        name: 'Nägel & Maniküre / Pediküre',
        category: 'Nägel',
        description: 'Gel-Maniküre, Tips-Verlängerung, Nagelmodellage, kreative Nail-Art und feuchtigkeitsspendende Spa-Pflege.',
        badge: 'Beliebt'
      },
      eyelashes: {
        name: 'Wimpernverlängerung (Eyelashes)',
        category: 'Wimpern',
        description: 'Russische Volumentechnik (3D-6D) und 1:1 Classic, natürlicher oder dramatischer Look, wasserfest.',
        badge: 'Trend'
      }
    },

    admin: {
      dashboardTitle: 'Admin-Dashboard',
      liveSync: 'Live-Synchronisierung (alle 2s)',
      lastUpdated: 'Aktualisiert:',
      viewClientSite: 'Kundenansicht',
      logout: 'Abmelden',
      todayAppointments: 'Heutige Termine',
      todayRevenue: 'Tagesumsatz',
      pendingCount: 'Ausstehend',
      allAppointments: 'Gesamte Termine',
      whoComesToday: 'Wer kommt heute',
      whoComesTodayDesc: 'Tagesordnung für heute:',
      allBookingsTab: 'Alle Buchungen',
      blockSlotsTab: 'Termine Blockieren / Freigeben',
      manualBookingTab: '+ Manueller Termin',
      searchPlaceholder: 'Nach Name, Telefon oder Buchungscode suchen...',
      filterAll: 'Alle',
      statusConfirmed: 'Bestätigt',
      statusPending: 'Ausstehend',
      statusCompleted: 'Abgeschlossen',
      statusCancelled: 'Storniert',
      statusFree: 'Frei',
      statusBlocked: 'Blockiert',
      noApptsToday: 'Keine Termine für heute eingetragen.',
      clientAndPhone: 'Kundin & Telefon',
      serviceAndPrice: 'Service & Preis',
      dateTime: 'Datum & Zeit',
      statusLabel: 'Status',
      actionsLabel: 'Aktionen',
      callBtn: 'Anrufen',
      whatsAppBtn: 'WhatsApp',
      deleteBtn: 'Löschen',
      confirmDeleteMsg: 'Möchten Sie diesen Termin wirklich löschen?',
      manageSlotsTitle: 'Terminverwaltung: Blockieren oder Freigeben',
      manageSlotsDesc: 'Wählen Sie ein Datum und klicken Sie auf die Uhrzeiten, um sie zu blockieren (z.B. Pause, Desinfektion) oder freizugeben.',
      blockWholeDay: 'Ganzen Tag blockieren',
      unblockWholeDay: 'Ganzen Tag freigeben',
      manualTitle: 'Neuen Termin manuell eintragen (Walk-in)',
      manualDesc: 'Tragen Sie die Daten einer Kundin ein, die telefonisch oder persönlich im Salon gebucht hat.',
      saveBookingBtn: 'Termin Eintragen',
      newBookingToastTitle: 'Neue Online-Buchung!',
      newBookingToastNow: 'Jetzt',
      newBookingToastDesc: 'hat soeben gebucht'
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'sq',
  setLanguage: () => {},
  t: translations.sq
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('salon_language');
    if (saved === 'de' || saved === 'sq') return saved;
    return 'sq';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('salon_language', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
