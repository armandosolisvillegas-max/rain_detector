/**
 * Rain Detector — Puente Serial USB (Arduino UNO -> Backend API)
 *
 * Lee los datos enviados por el Arduino UNO a través del puerto USB (COM3, 9600 baudios)
 * y los transmite mediante HTTP POST a http://localhost:3000/api/events.
 */

const { spawn } = require('child_process');
const http = require('http');

const COM_PORT = process.env.COM_PORT || process.argv[2] || 'COM3';
const BAUD_RATE = Number(process.env.BAUD_RATE || process.argv[3] || 9600);
const BACKEND_HOST = process.env.BACKEND_HOST || 'localhost';
const BACKEND_PORT = Number(process.env.BACKEND_PORT || 3000);
const BACKEND_PATH = '/api/events';

// Intervalo mínimo para refrescar cambios de lectura analógica (sin cambio de estado de lluvia)
const READING_UPDATE_INTERVAL_MS = 2000;

let hasSentInitial = false;
let lastIsRaining = null;
let lastReading = null;
let lastSentTime = 0;
let isSending = false;

/**
 * Analiza una línea de texto proveniente del Arduino UNO.
 * Soporta tanto la salida del Monitor Serial ("Lectura: X | Lluvia: SI/NO | Ropa: ...")
 * como la trama del protocolo ("ESTADO,lectura,lluvia,ropa").
 */
function parseArduinoLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Formato 1: "Lectura: 420 | Lluvia: SI | Ropa: ADENTRO"
  const matchMonitor = trimmed.match(/Lectura:\s*(\d+)\s*\|\s*Lluvia:\s*(SI|NO)/i);
  if (matchMonitor) {
    return {
      reading: parseInt(matchMonitor[1], 10),
      isRaining: matchMonitor[2].toUpperCase() === 'SI'
    };
  }

  // Formato 2: "ESTADO,420,1,1"
  const matchEstado = trimmed.match(/^ESTADO,(\d+),(0|1),(0|1)/i);
  if (matchEstado) {
    return {
      reading: parseInt(matchEstado[1], 10),
      isRaining: matchEstado[2] === '1'
    };
  }

  return null;
}

/**
 * Envía el estado y la lectura al servidor Backend mediante HTTP POST.
 */
function sendToBackend(isRaining, reading, reason) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ isRaining, reading });

    const req = http.request(
      {
        hostname: BACKEND_HOST,
        port: BACKEND_PORT,
        path: BACKEND_PATH,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 3000
      },
      (res) => {
        let responseBody = '';
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(
              `✅ [POST ${BACKEND_PATH}] (${reason}) -> Lectura: ${reading} ADC | Lluvia: ${
                isRaining ? 'SÍ' : 'NO'
              } (HTTP ${res.statusCode})`
            );
            resolve(true);
          } else {
            console.error(
              `⚠️ [Error Backend] El servidor respondió con HTTP ${res.statusCode}: ${responseBody}`
            );
            resolve(false);
          }
        });
      }
    );

    req.on('error', (err) => {
      console.error(
        `❌ [Error de Conexión con Backend] No se pudo conectar a http://${BACKEND_HOST}:${BACKEND_PORT}${BACKEND_PATH} (${err.message}). Verifica que "npm start" esté corriendo.`
      );
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      console.error(
        `❌ [Timeout Backend] Tiempo de espera agotado al enviar datos a http://${BACKEND_HOST}:${BACKEND_PORT}${BACKEND_PATH}.`
      );
      resolve(false);
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Procesa cada lectura válida recibida desde el Arduino UNO,
 * enviando la lectura inicial, los cambios de lluvia y actualizaciones de nivel ADC
 * sin generar eventos duplicados.
 */
async function handleParsedData({ isRaining, reading }) {
  const now = Date.now();

  const isInitial = !hasSentInitial;
  const rainStateChanged = hasSentInitial && isRaining !== lastIsRaining;
  const readingChangedEnough =
    hasSentInitial &&
    !rainStateChanged &&
    reading !== lastReading &&
    now - lastSentTime >= READING_UPDATE_INTERVAL_MS;

  if (!isInitial && !rainStateChanged && !readingChangedEnough) {
    return;
  }

  if (isSending && !rainStateChanged && !isInitial) {
    return;
  }

  let reason = 'Lectura inicial';
  if (rainStateChanged) {
    reason = isRaining ? '🌧️ INICIO DE LLUVIA' : '☀️ FIN DE LLUVIA';
  } else if (readingChangedEnough) {
    reason = 'Actualización ADC';
  }

  isSending = true;
  const ok = await sendToBackend(isRaining, reading, reason);
  isSending = false;

  if (ok) {
    hasSentInitial = true;
    lastIsRaining = isRaining;
    lastReading = reading;
    lastSentTime = now;
  }
}

/**
 * Inicia el lector del puerto serial COM en Windows mediante System.IO.Ports.SerialPort.
 */
function startSerialReader() {
  console.log('====================================================');
  console.log('🔌 Rain Detector - Puente Serial USB -> Backend API');
  console.log(`📡 Puerto Arduino:   ${COM_PORT} (${BAUD_RATE} baudios)`);
  console.log(`🌐 Destino Backend:  http://${BACKEND_HOST}:${BACKEND_PORT}${BACKEND_PATH}`);
  console.log('====================================================');

  const psScript = `
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    $port = New-Object System.IO.Ports.SerialPort '${COM_PORT}', ${BAUD_RATE}, 'None', 8, 'One'
    $port.ReadTimeout = 1000
    try {
      $port.Open()
      Write-Output "SERIAL_OPENED"
    } catch {
      Write-Error ("SERIAL_OPEN_ERROR: " + $_.Exception.Message)
      exit 1
    }
    try {
      while ($port.IsOpen) {
        try {
          $line = $port.ReadLine()
          if ($null -ne $line) {
            Write-Output $line
          }
        } catch [System.TimeoutException] {
          # Continuar esperando datos
        }
      }
    } catch {
      Write-Error ("SERIAL_READ_ERROR: " + $_.Exception.Message)
      exit 2
    } finally {
      if ($port.IsOpen) { $port.Close() }
    }
  `;

  const ps = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', psScript], {
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let stdoutBuffer = '';

  ps.stdout.on('data', (chunk) => {
    stdoutBuffer += chunk.toString('utf8');
    const lines = stdoutBuffer.split(/\r?\n/);
    stdoutBuffer = lines.pop();

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      if (line === 'SERIAL_OPENED') {
        console.log(`🟢 Puerto ${COM_PORT} abierto correctamente. Escuchando al Arduino UNO...`);
        continue;
      }

      const parsed = parseArduinoLine(line);
      if (parsed) {
        handleParsedData(parsed);
      } else {
        console.log(`📟 [Arduino ${COM_PORT}]: ${line}`);
      }
    }
  });

  ps.stderr.on('data', (chunk) => {
    const msg = chunk.toString('utf8').trim();
    if (!msg) return;

    if (msg.includes('SERIAL_OPEN_ERROR')) {
      console.error(`\n❌ No se pudo abrir el puerto ${COM_PORT}.`);
      console.error('   Causas posibles:');
      console.error('   1. El Monitor Serial de Arduino IDE está abierto (ciérralo para liberar COM3).');
      console.error('   2. El Arduino UNO se desconectó o está en otro puerto COM.');
      console.error(`   Detalle técnico: ${msg}\n`);
    } else if (msg.includes('SERIAL_READ_ERROR')) {
      console.error(`\n❌ Se interrumpió la lectura en ${COM_PORT}: ${msg}\n`);
    } else {
      console.error(`⚠️ [Serial]: ${msg}`);
    }
  });

  ps.on('close', (code) => {
    if (code !== 0) {
      console.log(`🔄 Reintentando conexión con ${COM_PORT} en 3 segundos... (Ctrl+C para detener)`);
      setTimeout(startSerialReader, 3000);
    }
  });
}

startSerialReader();

