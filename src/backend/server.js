const path = require('path');
const os = require('os');
const express = require('express');
const cors = require('cors');
const {
  initDatabase,
  getCurrentState,
  processRainReport,
  getEvents
} = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar la base de datos SQLite automáticamente
initDatabase();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para atrapar errores de parseo de JSON en el body
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Formato JSON inválido o malformado en el cuerpo de la petición.'
    });
  }
  next(err);
});

// Servir frontend estático
const FRONTEND_DIR = path.join(__dirname, '../frontend');
app.use(express.static(FRONTEND_DIR));

// -------------------------------------------------------------
// Rutas de la API REST
// -------------------------------------------------------------

/**
 * GET /api/status
 * Retorna el estado actual del sensor (lloviendo o sin lluvia),
 * la última lectura analógica y la fecha de última actualización.
 */
app.get('/api/status', (req, res) => {
  try {
    const state = getCurrentState();
    res.json({
      success: true,
      ...state
    });
  } catch (error) {
    console.error('[API] Error al obtener estado:', error.message);
    res.status(500).json({ success: false, error: 'Error interno al consultar estado' });
  }
});

/**
 * GET /api/events
 * Retorna el historial de eventos ordenados cronológicamente (más recientes primero).
 * Admite parámetro ?limit=N (por defecto 100, entre 1 y 500).
 */
app.get('/api/events', (req, res) => {
  try {
    const parsedLimit = parseInt(req.query.limit, 10);
    const limit = (!isNaN(parsedLimit) && parsedLimit > 0) ? parsedLimit : 100;
    const events = getEvents(limit);

    res.json({
      success: true,
      total: events.length,
      events
    });
  } catch (error) {
    console.error('[API] Error al consultar eventos:', error.message);
    res.status(500).json({ success: false, error: 'Error interno al consultar eventos' });
  }
});

/**
 * POST /api/events (o /api/telemetry)
 * Endpoint para recibir reportes de lluvia desde el ESP32 o pruebas locales.
 *
 * Acepta múltiples formatos en el cuerpo JSON:
 *   - { "isRaining": true, "reading": 520 }
 *   - { "lluvia": 1, "lectura": 520 }
 *   - { "rain": true, "reading": 520 }
 *   - { "type": "rain_start" } / { "type": "rain_stop" }
 */
app.post(['/api/events', '/api/telemetry', '/api/rain'], (req, res) => {
  try {
    const body = req.body || {};

    let isRaining = null;
    let reading = null;

    // Detectar si está lloviendo a partir de los diferentes nombres de propiedad posibles
    if (typeof body.isRaining === 'boolean') {
      isRaining = body.isRaining;
    } else if (body.lluvia !== undefined) {
      isRaining = body.lluvia === 1 || body.lluvia === true || body.lluvia === '1' || body.lluvia === 'true';
    } else if (body.rain !== undefined) {
      isRaining = body.rain === 1 || body.rain === true || body.rain === '1' || body.rain === 'true';
    } else if (typeof body.type === 'string') {
      const normalizedType = body.type.trim().toLowerCase();
      if (normalizedType === 'rain_start' || normalizedType === 'lluvia_inicio' || normalizedType === 'inicio') {
        isRaining = true;
      } else if (normalizedType === 'rain_stop' || normalizedType === 'lluvia_fin' || normalizedType === 'fin') {
        isRaining = false;
      }
    } else if (typeof body.estado === 'string') {
      const normalizedState = body.estado.trim().toLowerCase();
      if (normalizedState.includes('lluvia') || normalizedState.includes('rain')) {
        isRaining = true;
      } else if (normalizedState.includes('seco') || normalizedState.includes('dry')) {
        isRaining = false;
      }
    }

    // Extraer y sanitizar lectura si está presente (0 a 1023 ADC)
    const rawReading = body.reading !== undefined ? body.reading : body.lectura;
    if (rawReading !== undefined && rawReading !== null && !isNaN(Number(rawReading))) {
      const numericReading = Math.round(Number(rawReading));
      reading = Math.max(0, Math.min(numericReading, 1023));
    }

    if (isRaining === null) {
      return res.status(400).json({
        success: false,
        error: 'Debe especificar el estado de lluvia mediante "isRaining" (booleano), "lluvia" (0/1 o boolean), o "type" ("rain_start"/"rain_stop").'
      });
    }

    const result = processRainReport(isRaining, reading);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('[API] Error al procesar reporte de lluvia:', error.message);
    res.status(500).json({ success: false, error: 'Error interno al registrar reporte' });
  }
});

// Manejador 404 para cualquier ruta bajo /api/* que no exista
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Ruta de API no encontrada: ${req.method} ${req.path}`
  });
});

// Ruta comodín para servir el index.html en caso de rutas frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

// Helper para obtener las IPs locales de la máquina (útil para configurar el ESP32)
function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      // Ignorar direcciones internas (127.0.0.1) y no IPv4
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push(net.address);
      }
    }
  }
  return addresses;
}

// Iniciar servidor solo si este archivo se ejecuta directamente (permite importarlo en tests sin abrir puerto)
if (require.main === module) {
  app.listen(PORT, () => {
    const localIps = getLocalIpAddresses();
    console.log('====================================================');
    console.log(`🌧️  Rain Detector - Servidor Backend Activo`);
    console.log(`📡 Local:            http://localhost:${PORT}`);
    if (localIps.length > 0) {
      localIps.forEach(ip => {
        console.log(`🌐 En tu red (ESP32): http://${ip}:${PORT}`);
      });
    }
    console.log('====================================================');
  });
}

module.exports = app;
