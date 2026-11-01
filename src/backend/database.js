const path = require('path');
const Database = require('better-sqlite3');

// Ruta predeterminada del archivo de base de datos SQLite
const DEFAULT_DB_PATH = path.join(__dirname, 'rain_detector.db');

let db = null;
let currentDbPath = null;

/**
 * Inicializa la base de datos y crea las tablas si no existen.
 * Permite especificar una ruta personalizada (útil para pruebas aisladas sin tocar datos reales).
 *
 * @param {string} [customPath] - Ruta opcional del archivo SQLite o ':memory:'
 */
function initDatabase(customPath = null) {
  const targetPath = customPath || process.env.DB_PATH || DEFAULT_DB_PATH;

  // Si ya está abierta en la misma ruta, reutilizar la conexión
  if (db && currentDbPath === targetPath) {
    return db;
  }

  // Si había otra conexión abierta con ruta distinta, cerrarla primero
  if (db) {
    try { db.close(); } catch (_) {}
  }

  currentDbPath = targetPath;
  db = new Database(targetPath);

  // Habilitar modo WAL para mejor concurrencia y rendimiento (salvo en bases en memoria)
  if (targetPath !== ':memory:') {
    db.pragma('journal_mode = WAL');
  }

  // Tabla de eventos históricos (inicio y fin de lluvia)
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      title TEXT NOT NULL,
      reading INTEGER DEFAULT NULL,
      created_at TEXT NOT NULL
    )
  `);

  // Tabla para persistir el último estado global del sistema
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      is_raining INTEGER NOT NULL DEFAULT 0,
      last_reading INTEGER DEFAULT NULL,
      last_event_type TEXT DEFAULT NULL,
      last_updated TEXT NOT NULL
    )
  `);

  // Asegurar registro inicial único para el estado
  const existingState = db.prepare('SELECT id FROM system_state WHERE id = 1').get();
  if (!existingState) {
    db.prepare(`
      INSERT INTO system_state (id, is_raining, last_reading, last_event_type, last_updated)
      VALUES (1, 0, 0, 'none', ?)
    `).run(new Date().toISOString());
  }

  return db;
}

/**
 * Cierra la conexión activa a la base de datos (útil para pruebas y reinicio limpio).
 */
function closeDatabase() {
  if (db) {
    try {
      db.close();
    } finally {
      db = null;
      currentDbPath = null;
    }
  }
}

/**
 * Obtiene el estado actual del sistema.
 */
function getCurrentState() {
  if (!db) initDatabase();
  const row = db.prepare('SELECT * FROM system_state WHERE id = 1').get();
  
  if (!row) {
    return {
      isRaining: false,
      lastReading: null,
      lastEventType: 'none',
      lastUpdated: new Date().toISOString()
    };
  }

  return {
    isRaining: Boolean(row.is_raining),
    lastReading: row.last_reading,
    lastEventType: row.last_event_type,
    lastUpdated: row.last_updated
  };
}

/**
 * Procesa un nuevo reporte de lluvia.
 * Si el estado cambia (seco -> lloviendo o lloviendo -> seco), registra el evento en el historial.
 * Evita registrar eventos duplicados si el estado no ha cambiado.
 * Utiliza una transacción atómica para garantizar consistencia entre eventos y estado.
 *
 * @param {boolean} isRaining - true si el sensor detecta lluvia, false si no.
 * @param {number|null} reading - Lectura analógica del sensor (0 - 1023)
 * @returns {object} { stateChanged: boolean, isRaining: boolean, event: object|null }
 */
function processRainReport(isRaining, reading = null) {
  if (!db) initDatabase();

  const currentState = getCurrentState();
  const now = new Date().toISOString();
  const stateChanged = currentState.isRaining !== isRaining;

  let createdEvent = null;

  if (stateChanged) {
    const eventType = isRaining ? 'rain_start' : 'rain_stop';
    const title = isRaining ? 'Inicio de lluvia' : 'Fin de lluvia';

    // Transacción atómica: inserción en historial y actualización del estado global
    const executeStateTransition = db.transaction(() => {
      const insertStmt = db.prepare(`
        INSERT INTO events (event_type, title, reading, created_at)
        VALUES (?, ?, ?, ?)
      `);
      const result = insertStmt.run(eventType, title, reading, now);

      db.prepare(`
        UPDATE system_state
        SET is_raining = ?, last_reading = ?, last_event_type = ?, last_updated = ?
        WHERE id = 1
      `).run(isRaining ? 1 : 0, reading, eventType, now);

      return Number(result.lastInsertRowid);
    });

    const eventId = executeStateTransition();

    createdEvent = {
      id: eventId,
      eventType,
      title,
      reading,
      createdAt: now
    };
  } else {
    // Si el estado no cambió, solo actualizamos lectura y fecha (heartbeat)
    db.prepare(`
      UPDATE system_state
      SET last_reading = ?, last_updated = ?
      WHERE id = 1
    `).run(reading, now);
  }

  return {
    stateChanged,
    isRaining,
    event: createdEvent,
    lastReading: reading,
    lastUpdated: now
  };
}

/**
 * Obtiene el historial de eventos ordenados de más reciente a más antiguo.
 * @param {number} [limit=100] - Límite de eventos a recuperar (clamped entre 1 y 500).
 */
function getEvents(limit = 100) {
  if (!db) initDatabase();

  const safeLimit = Math.max(1, Math.min(Number(limit) || 100, 500));

  const rows = db.prepare(`
    SELECT id, event_type AS eventType, title, reading, created_at AS createdAt
    FROM events
    ORDER BY id DESC
    LIMIT ?
  `).all(safeLimit);

  return rows;
}

module.exports = {
  initDatabase,
  closeDatabase,
  getCurrentState,
  processRainReport,
  getEvents
};
