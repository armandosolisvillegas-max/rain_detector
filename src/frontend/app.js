/**
 * Rain Detector — Frontend Application Logic
 * Telemetría ambiental y registro histórico de eventos de lluvia.
 */

// Intervalo de sondeo periódico (en milisegundos)
const POLLING_INTERVAL_MS = 2000;
const UMBRAL_LLUVIA = 300;

// Elementos del DOM
const connectionBadge = document.getElementById('connectionBadge');
const connectionText = document.getElementById('connectionText');

const statusCard = document.getElementById('statusCard');
const stateBadge = document.getElementById('stateBadge');
const weatherGraphic = document.getElementById('weatherGraphic');
const statusHeadline = document.getElementById('statusHeadline');
const statusSubline = document.getElementById('statusSubline');

const rainAlertBanner = document.getElementById('rainAlertBanner');
const alertTimeBadge = document.getElementById('alertTimeBadge');
const alertDescription = document.getElementById('alertDescription');

const sensorReadingVal = document.getElementById('sensorReadingVal');
const readingChip = document.getElementById('readingChip');
const meterBar = document.getElementById('meterBar');
const lastUpdatedVal = document.getElementById('lastUpdatedVal');

const eventCountChip = document.getElementById('eventCountChip');
const eventsTableBody = document.getElementById('eventsTableBody');
const btnRefresh = document.getElementById('btnRefresh');

// SVGs elegantes para el estado principal
const SVG_ICON_RAIN = `
  <svg class="weather-svg icon-rain" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path d="M37 27.5A6.5 6.5 0 0 0 34.5 15h-1.5A9.5 9.5 0 1 0 14.5 25" stroke-width="2.5"></path>
    <line class="drop-1" x1="18" y1="31" x2="16" y2="39" stroke="currentColor" stroke-width="2.5"></line>
    <line class="drop-2" x1="26" y1="31" x2="24" y2="39" stroke="currentColor" stroke-width="2.5"></line>
    <line class="drop-3" x1="34" y1="31" x2="32" y2="39" stroke="currentColor" stroke-width="2.5"></line>
  </svg>
`;

const SVG_ICON_DRY = `
  <svg class="weather-svg icon-dry" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="24" cy="24" r="8.5" stroke-width="2.5"></circle>
    <path d="M24 5v5" stroke-width="2.5"></path>
    <path d="M24 38v5" stroke-width="2.5"></path>
    <path d="M5 24h5" stroke-width="2.5"></path>
    <path d="M38 24h5" stroke-width="2.5"></path>
    <path d="M10.6 10.6l3.5 3.5" stroke-width="2.5"></path>
    <path d="M33.9 33.9l3.5 3.5" stroke-width="2.5"></path>
    <path d="M10.6 37.4l3.5-3.5" stroke-width="2.5"></path>
    <path d="M33.9 14.1l3.5-3.5" stroke-width="2.5"></path>
  </svg>
`;

/**
 * Formatea una fecha ISO a formato local legible.
 * Ejemplo: 29 oct 2026
 */
function formatDate(isoString) {
  if (!isoString) return '--';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '--';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
}

/**
 * Formatea una fecha ISO a hora local exacta con segundos (formato 24h).
 * Ejemplo: 14:25:10
 */
function formatTime(isoString) {
  if (!isoString) return '--';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '--';
  return d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

/**
 * Actualiza el indicador de sincronización del sistema.
 */
function setConnectionState(isConnected) {
  if (!connectionBadge || !connectionText) return;
  if (isConnected) {
    connectionBadge.classList.remove('offline');
    connectionText.textContent = 'Sincronizado';
  } else {
    connectionBadge.classList.add('offline');
    connectionText.textContent = 'Sin conexión';
  }
}

/**
 * Actualiza la sección principal de Estado Actual.
 */
function updateStatusUI(data) {
  if (!statusCard) return;

  const isRaining = Boolean(data.isRaining);
  const reading = (data.lastReading !== null && data.lastReading !== undefined) ? Number(data.lastReading) : null;

  if (isRaining) {
    statusCard.className = 'hero-panel state-raining';

    if (stateBadge) {
      stateBadge.innerHTML = `
        <span class="microtag-dot"></span>
        <span class="microtag-label">Lluvia detectada</span>
      `;
    }

    if (weatherGraphic) {
      weatherGraphic.innerHTML = SVG_ICON_RAIN;
    }

    if (statusHeadline) {
      statusHeadline.textContent = 'Lluvia detectada';
    }

    if (statusSubline) {
      statusSubline.textContent = 'El sensor registra presencia de agua sobre la placa. El servomotor ha resguardado la ropa automáticamente.';
    }

    // Aviso destacado de lluvia
    if (rainAlertBanner) {
      rainAlertBanner.style.display = 'flex';
      if (alertTimeBadge) {
        alertTimeBadge.textContent = formatTime(data.lastUpdated);
      }
      if (alertDescription) {
        alertDescription.textContent = 'Precipitación activa detectada. El mecanismo del tendedero permanece resguardado para proteger la ropa.';
      }
    }
  } else {
    statusCard.className = 'hero-panel state-dry';

    if (stateBadge) {
      stateBadge.innerHTML = `
        <span class="microtag-dot"></span>
        <span class="microtag-label">Sin lluvia por el momento</span>
      `;
    }

    if (weatherGraphic) {
      weatherGraphic.innerHTML = SVG_ICON_DRY;
    }

    if (statusHeadline) {
      statusHeadline.textContent = 'Sin lluvia por el momento';
    }

    if (statusSubline) {
      statusSubline.textContent = 'La superficie del sensor se encuentra seca. El mecanismo protector del tendedero permanece en reposo.';
    }

    // Ocultar aviso de lluvia
    if (rainAlertBanner) {
      rainAlertBanner.style.display = 'none';
    }
  }

  // Métricas del sensor
  if (sensorReadingVal) {
    sensorReadingVal.textContent = (reading !== null) ? reading : '--';
  }

  // Barra medidora (0 a 1023)
  if (meterBar && reading !== null) {
    const percentage = Math.min(100, Math.max(0, (reading / 1023) * 100));
    meterBar.style.width = `${percentage}%`;
  }

  // Chip de lectura
  if (readingChip) {
    if (reading !== null) {
      if (reading >= UMBRAL_LLUVIA) {
        readingChip.textContent = 'Supera umbral lluvia';
        readingChip.style.color = 'var(--color-rain)';
      } else {
        readingChip.textContent = 'En umbral seco';
        readingChip.style.color = 'var(--color-dry)';
      }
    } else {
      readingChip.textContent = 'Sin datos';
      readingChip.style.color = 'var(--text-muted)';
    }
  }

  if (lastUpdatedVal) {
    lastUpdatedVal.textContent = formatTime(data.lastUpdated);
  }
}

/**
 * Renderiza la tabla de historial con iconos SVG.
 */
function updateEventsTable(events) {
  if (!eventsTableBody) return;

  if (eventCountChip) {
    const total = events ? events.length : 0;
    eventCountChip.textContent = `${total} ${total === 1 ? 'evento' : 'eventos'}`;
  }

  if (!events || events.length === 0) {
    eventsTableBody.innerHTML = `
      <tr class="empty-row">
        <td colspan="4">
          <div class="empty-notice">
            <svg class="empty-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 17h6M9 13h6M9 9h6M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10l6 6v10a2 2 0 0 1-2 2z"></path>
            </svg>
            <p class="empty-primary">No hay eventos de lluvia registrados aún</p>
            <p class="empty-secondary">Cuando el sensor detecte inicio o fin de lluvia, aparecerán aquí con su fecha y lectura.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  const rowsHtml = events.map(event => {
    const isStart = event.eventType === 'rain_start';
    const tagClass = isStart ? 'tag-start' : 'tag-stop';
    const tagLabel = isStart ? 'Inicio de lluvia' : 'Fin de lluvia';
    const readingValue = (event.reading !== null && event.reading !== undefined) ? event.reading : '--';

    // Icono SVG para inicio (gota) o fin (sol)
    const badgeIconSvg = isStart
      ? `<svg class="event-badge-icon" viewBox="0 0 16 16" fill="currentColor">
           <path d="M8 1.5c-2.4 3.2-5 6.7-5 9.2A5 5 0 0 0 8 15.5a5 5 0 0 0 5-4.8c0-2.5-2.6-6-5-9.2z"></path>
         </svg>`
      : `<svg class="event-badge-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
           <circle cx="8" cy="8" r="4.5"></circle>
           <path d="M8 1v2M8 13v2M1 8h2M13 8h2"></path>
         </svg>`;

    return `
      <tr>
        <td>
          <span class="event-badge ${tagClass}">
            ${badgeIconSvg}
            <span>${tagLabel}</span>
          </span>
        </td>
        <td class="col-date">${formatDate(event.createdAt)}</td>
        <td class="col-time">${formatTime(event.createdAt)}</td>
        <td class="col-reading">${readingValue} ADC</td>
      </tr>
    `;
  }).join('');

  eventsTableBody.innerHTML = rowsHtml;
}

/**
 * Consulta el estado actual y el historial desde la API del backend.
 */
async function fetchData() {
  try {
    const [statusRes, eventsRes] = await Promise.all([
      fetch('/api/status'),
      fetch('/api/events')
    ]);

    if (!statusRes.ok || !eventsRes.ok) {
      throw new Error('Respuesta anómala del servidor');
    }

    const statusData = await statusRes.json();
    const eventsData = await eventsRes.json();

    setConnectionState(true);
    updateStatusUI(statusData);
    updateEventsTable(eventsData.events || []);
  } catch (error) {
    console.warn('[Rain Detector] Error de sincronización con la API:', error);
    setConnectionState(false);
  }
}

// Botón de Actualizar con animación
if (btnRefresh) {
  btnRefresh.addEventListener('click', () => {
    btnRefresh.classList.add('spinning');
    fetchData().finally(() => {
      setTimeout(() => {
        btnRefresh.classList.remove('spinning');
      }, 600);
    });
  });
}

/**
 * Helper en consola para pruebas locales del equipo:
 * window.simulateRain(true, 680)  -> Simula inicio de lluvia
 * window.simulateRain(false, 90)  -> Simula fin de lluvia
 */
window.simulateRain = async function(isRaining, reading = 500) {
  try {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRaining, reading })
    });
    const result = await res.json();
    console.log('[Simulación] Resultado:', result);
    await fetchData();
    return result;
  } catch (err) {
    console.error('[Simulación] Error:', err);
  }
};

// Carga inicial y ciclo de actualización periódica
fetchData();
setInterval(fetchData, POLLING_INTERVAL_MS);
