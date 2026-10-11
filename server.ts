import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const httpServer = http.createServer(app);

// Enable CORS for all origins, mobile webviews, and iframes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Persistent storage path
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'salon_db.json');

// Initial seed data
const INITIAL_SERVICES = [
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

interface Appointment {
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
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  createdBy: 'client' | 'admin';
}

interface BlockedSlot {
  id: string;
  date: string;
  time?: string; // If empty or undefined, blocks whole day
  reason?: string;
  createdAt: string;
}

interface SalonDB {
  appointments: Appointment[];
  blockedSlots: BlockedSlot[];
  lastUpdated: string;
}

// Ensure database file exists
function loadDB(): SalonDB {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading DB file:', err);
  }

  // Seed sample initial appointments for today to showcase the "Kush vjen sot" calendar immediately
  const todayStr = new Date().toISOString().split('T')[0];
  const initialDB: SalonDB = {
    appointments: [
      {
        id: 'ELG-2001',
        clientName: 'Elira Hoxha',
        clientPhone: '+355 69 412 8890',
        clientEmail: 'elira.hoxha@gmail.com',
        serviceId: 'hair',
        serviceName: 'Stilim & Prerje Flokësh',
        servicePrice: 35,
        serviceDuration: 60,
        date: todayStr,
        time: '10:00',
        notes: 'Dëshiron stilim me onde për një event mbrëmjeje.',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        createdBy: 'client'
      },
      {
        id: 'ELG-2002',
        clientName: 'Dafina Krasniqi',
        clientPhone: '+355 68 230 4511',
        clientEmail: 'dafina.k@gmail.com',
        serviceId: 'makeup',
        serviceName: 'Grim Profesional (Make Up)',
        servicePrice: 45,
        serviceDuration: 60,
        date: todayStr,
        time: '12:00',
        notes: 'Make-up glamour për fejesë.',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
        createdBy: 'client'
      },
      {
        id: 'ELG-2003',
        clientName: 'Sara Berisha',
        clientPhone: '+355 69 771 9922',
        clientEmail: 'sara.b@yahoo.com',
        serviceId: 'nails',
        serviceName: 'Thonj & Manikyr / Pedikyr',
        servicePrice: 25,
        serviceDuration: 50,
        date: todayStr,
        time: '15:00',
        notes: 'Manikyr me xhel French ngjyrë rozë pastel.',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        createdBy: 'client'
      },
      {
        id: 'ELG-2004',
        clientName: 'Klaudia Gjoni',
        clientPhone: '+355 67 890 1234',
        clientEmail: 'klaudia.g@gmail.com',
        serviceId: 'eyelashes',
        serviceName: 'Zgjatim Qerpikësh (Eyelashes)',
        servicePrice: 40,
        serviceDuration: 75,
        date: todayStr,
        time: '17:00',
        notes: 'Volume 4D Cat Eye look.',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        createdBy: 'client'
      }
    ],
    blockedSlots: [
      {
        id: 'blk-1',
        date: todayStr,
        time: '14:00',
        reason: 'Pushim dreke / Dezinfektim',
        createdAt: new Date().toISOString()
      }
    ],
    lastUpdated: new Date().toISOString()
  };

  saveDB(initialDB);
  return initialDB;
}

function saveDB(data: SalonDB) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving DB file:', err);
  }
}

// API Routes

// 1. Verify Admin Code (230306)
app.post('/api/admin/verify', (req, res) => {
  const { code } = req.body;
  if (code === '230306') {
    return res.json({ success: true, message: 'Kodi u verifikua me sukses!' });
  }
  return res.status(401).json({ success: false, message: 'Kodi 6-shifror është i pasaktë!' });
});

// 2. Get Services
app.get('/api/services', (_req, res) => {
  res.json({ success: true, services: INITIAL_SERVICES });
});

// 3. Get Appointments (with optional date query, or all for admin)
app.get('/api/appointments', (req, res) => {
  const db = loadDB();
  const { date } = req.query;
  let appointments = db.appointments;
  if (date && typeof date === 'string') {
    appointments = appointments.filter(a => a.date === date);
  }
  res.json({
    success: true,
    appointments,
    lastUpdated: db.lastUpdated,
    serverTime: new Date().toISOString()
  });
});

// 4. Create new appointment
app.post('/api/appointments', (req, res) => {
  const {
    clientName,
    clientPhone,
    clientEmail,
    serviceId,
    date,
    time,
    notes,
    createdBy = 'client'
  } = req.body;

  if (!clientName || !clientPhone || !serviceId || !date || !time) {
    return res.status(400).json({
      success: false,
      message: 'Ju lutem plotësoni të gjitha të dhënat e kërkuara!'
    });
  }

  const db = loadDB();

  // Check if slot is blocked
  const isBlocked = db.blockedSlots.some(
    b => b.date === date && (!b.time || b.time === time)
  );
  if (isBlocked) {
    return res.status(409).json({
      success: false,
      message: 'Ky orar është i bllokuar nga administratori. Ju lutem zgjidhni një orar tjetër!'
    });
  }

  // Check if slot is already booked and active
  const isAlreadyBooked = db.appointments.some(
    a => a.date === date && a.time === time && a.status !== 'cancelled'
  );
  if (isAlreadyBooked) {
    return res.status(409).json({
      success: false,
      message: 'Ky orar sapo u rezervua nga një klient tjetër! Ju lutem zgjidhni një orar të lirë.'
    });
  }

  const service = INITIAL_SERVICES.find(s => s.id === serviceId) || {
    id: serviceId,
    name: 'Shërbim Bukurie',
    price: 35,
    duration: 60
  };

  const newAppointment: Appointment = {
    id: `ELG-${Math.floor(1000 + Math.random() * 9000)}`,
    clientName: clientName.trim(),
    clientPhone: clientPhone.trim(),
    clientEmail: (clientEmail || '').trim(),
    serviceId: service.id,
    serviceName: service.name,
    servicePrice: service.price,
    serviceDuration: service.duration,
    date,
    time,
    notes: (notes || '').trim(),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    createdBy: createdBy === 'admin' ? 'admin' : 'client'
  };

  db.appointments.unshift(newAppointment);
  saveDB(db);

  res.status(201).json({
    success: true,
    appointment: newAppointment,
    message: 'Termini u rezervua me sukses!'
  });
});

// 5. Update appointment status / details
app.patch('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { status, notes, time, date } = req.body;

  const db = loadDB();
  const appointmentIndex = db.appointments.findIndex(a => a.id === id);

  if (appointmentIndex === -1) {
    return res.status(404).json({ success: false, message: 'Termini nuk u gjet!' });
  }

  const target = db.appointments[appointmentIndex];
  if (status) target.status = status;
  if (notes !== undefined) target.notes = notes;
  if (time) target.time = time;
  if (date) target.date = date;

  saveDB(db);
  res.json({
    success: true,
    appointment: target,
    message: 'Termini u përditësua me sukses!'
  });
});

// 6. Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const initialLength = db.appointments.length;
  db.appointments = db.appointments.filter(a => a.id !== id);

  if (db.appointments.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Termini nuk u gjet!' });
  }

  saveDB(db);
  res.json({ success: true, message: 'Termini u fshi me sukses!' });
});

// 7. Get Blocked Slots
app.get('/api/blocked-slots', (_req, res) => {
  const db = loadDB();
  res.json({ success: true, blockedSlots: db.blockedSlots });
});

// 8. Toggle / Create / Remove Blocked Slot
app.post('/api/blocked-slots/toggle', (req, res) => {
  const { date, time, reason } = req.body;

  if (!date) {
    return res.status(400).json({ success: false, message: 'Data është e nevojshme!' });
  }

  const db = loadDB();
  const existingIndex = db.blockedSlots.findIndex(
    b => b.date === date && (time ? b.time === time : !b.time)
  );

  let isNowBlocked = false;

  if (existingIndex > -1) {
    // Unblock it
    db.blockedSlots.splice(existingIndex, 1);
    isNowBlocked = false;
  } else {
    // Block it
    db.blockedSlots.push({
      id: `blk-${Date.now()}`,
      date,
      time: time || undefined,
      reason: reason || 'I bllokuar nga administratori',
      createdAt: new Date().toISOString()
    });
    isNowBlocked = true;
  }

  saveDB(db);
  res.json({
    success: true,
    isBlocked: isNowBlocked,
    blockedSlots: db.blockedSlots,
    message: isNowBlocked ? 'Orari u bllokua me sukses!' : 'Orari u lirua (zhbllokua) me sukses!'
  });
});

// 9. Stats for admin overview
app.get('/api/stats', (_req, res) => {
  const db = loadDB();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = db.appointments.filter(a => a.date === todayStr);

  const totalAppointments = db.appointments.length;
  const todayCount = todayAppointments.length;
  const todayRevenue = todayAppointments
    .filter(a => a.status !== 'cancelled')
    .reduce((sum, a) => sum + (a.servicePrice || 0), 0);

  const pendingCount = db.appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = db.appointments.filter(a => a.status === 'confirmed').length;

  res.json({
    success: true,
    stats: {
      todayStr,
      todayCount,
      todayRevenue,
      totalAppointments,
      pendingCount,
      confirmedCount
    }
  });
});

// Dev or Prod Static Server setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';

    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
        watch: isHmrDisabled ? null : {},
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Salon server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
