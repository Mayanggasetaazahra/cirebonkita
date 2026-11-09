import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Body parsers with generous 60MB limit for rich media / base64 image uploads
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Ensure persistent data and upload directories exist
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const uploadsDir = path.resolve(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve public uploads statically
app.use('/uploads', express.static(uploadsDir));

const dbFilePath = path.resolve(dataDir, 'cirebonkita_db.json');

// Interface for server database
interface DatabaseState {
  version: number;
  lastUpdated: number;
  wisata?: any[];
  umkm?: any[];
  homestay?: any[];
  booking?: any[];
  ulasan?: any[];
  users?: any[];
  settings?: any;
  categories?: any[];
}

let dbMemory: DatabaseState = {
  version: 1,
  lastUpdated: Date.now(),
};

// Load database from disk or initialize
function loadDb(): DatabaseState {
  try {
    if (fs.existsSync(dbFilePath)) {
      const raw = fs.readFileSync(dbFilePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        dbMemory = {
          version: parsed.version || 1,
          lastUpdated: parsed.lastUpdated || Date.now(),
          wisata: parsed.wisata || null,
          umkm: parsed.umkm || null,
          homestay: parsed.homestay || null,
          booking: parsed.booking || null,
          ulasan: parsed.ulasan || null,
          users: parsed.users || null,
          settings: parsed.settings || null,
          categories: parsed.categories || null,
        };
        return dbMemory;
      }
    }
  } catch (err) {
    console.warn('[Server DB] Gagal membaca cirebonkita_db.json, menggunakan memory:', err);
  }
  return dbMemory;
}

// Atomic save to disk to prevent corrupted JSON writes
function saveDb(updated: Partial<DatabaseState>): DatabaseState {
  dbMemory = {
    ...dbMemory,
    ...updated,
    version: (dbMemory.version || 1) + 1,
    lastUpdated: Date.now(),
  };

  try {
    const tmpFile = `${dbFilePath}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(dbMemory, null, 2), 'utf8');
    fs.renameSync(tmpFile, dbFilePath);
  } catch (err) {
    console.error('[Server DB] Gagal menulis ke cirebonkita_db.json:', err);
  }

  return dbMemory;
}

// Initial boot load
loadDb();

// -----------------------------------------------------------------------------
// REST API ROUTES
// -----------------------------------------------------------------------------

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: dbMemory.version,
    lastUpdated: dbMemory.lastUpdated,
    timestamp: Date.now(),
  });
});

// Lightweight version check for client background polling (every ~4s)
app.get('/api/version', (_req, res) => {
  res.json({
    version: dbMemory.version,
    lastUpdated: dbMemory.lastUpdated,
  });
});

// Fetch full centralized database
app.get('/api/data', (_req, res) => {
  res.json({
    success: true,
    version: dbMemory.version,
    lastUpdated: dbMemory.lastUpdated,
    data: {
      wisata: dbMemory.wisata,
      umkm: dbMemory.umkm,
      homestay: dbMemory.homestay,
      booking: dbMemory.booking,
      ulasan: dbMemory.ulasan,
      users: dbMemory.users,
      settings: dbMemory.settings,
      categories: dbMemory.categories,
    },
  });
});

// Save / update data (handles single key update or full dataset)
app.post('/api/save', (req, res) => {
  try {
    const { key, data, allData } = req.body;

    if (allData && typeof allData === 'object') {
      const saved = saveDb(allData);
      return res.json({
        success: true,
        version: saved.version,
        lastUpdated: saved.lastUpdated,
        message: 'Seluruh basis data CirebonKita berhasil disinkronkan ke server.',
      });
    }

    if (key && data !== undefined) {
      const updatePayload: Partial<DatabaseState> = { [key]: data };
      const saved = saveDb(updatePayload);
      return res.json({
        success: true,
        version: saved.version,
        lastUpdated: saved.lastUpdated,
        keyUpdated: key,
        message: `Modul '${key}' berhasil diperbarui dan disiarkan ke seluruh admin & pengunjung.`,
      });
    }

    return res.status(400).json({ success: false, error: 'Format data tidak valid.' });
  } catch (err) {
    console.error('[API /api/save] Error:', err);
    return res.status(500).json({ success: false, error: 'Gagal menyimpan perubahan ke server.' });
  }
});

// Direct Image Upload endpoint: receives base64 string or binary and saves to /public/uploads/
app.post('/api/upload', (req, res) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ success: false, error: 'Data URL gambar diperlukan.' });
    }

    // Match data:[<mediatype>][;base64],<data>
    const matches = dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If it's already an external / normal URL, return as-is
      if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/')) {
        return res.json({ success: true, url: dataUrl });
      }
      return res.status(400).json({ success: false, error: 'Format base64 gambar tidak valid.' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
    const cleanName = (filename || 'upload').replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFilename = `${Date.now()}_${cleanName}.${ext}`;
    const targetPath = path.resolve(uploadsDir, safeFilename);

    fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64'));

    const publicUrl = `/uploads/${safeFilename}`;
    return res.json({
      success: true,
      url: publicUrl,
      filename: safeFilename,
      size: base64Data.length,
    });
  } catch (err) {
    console.error('[API /api/upload] Error:', err);
    return res.status(500).json({ success: false, error: 'Gagal mengunggah foto ke server.' });
  }
});

// -----------------------------------------------------------------------------
// VITE SPA & STATIC ASSETS
// -----------------------------------------------------------------------------

async function startServer() {
  if (!isProd) {
    // Development: integrate Vite dev middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
        allowedHosts: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Production: serve built static files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CirebonKita Server] Berjalan pada http://0.0.0.0:${PORT} (${isProd ? 'Production' : 'Development'})`);
  });
}

startServer().catch((err) => {
  console.error('[CirebonKita Server] Gagal memulai server:', err);
  process.exit(1);
});
