/**
 * RAIN DETECTOR
 * Puente Serial USB (Arduino UNO -> Backend API)
 *
 * Arduino UNO: COM5
 * ESP32:       COM4 (no utilizado por este puente)
 * Baud rate:   9600
 * Backend:     http://localhost:3000/api/events
 */

const { spawn } = require('child_process');
const http = require('http');

// ============================================================
// CONFIGURACIÓN DE PUERTOS Y BACKEND
// ============================================================

// PUERTO DEL ARDUINO UNO
const COM_PORT = process.env.COM_PORT || process.argv[2] || 'COM5';

// VELOCIDAD SERIAL
const BAUD_RATE = Number(process.env.BAUD_RATE || process.argv[3] || 9600);

// BACKEND NODE.JS
const BACKEND_HOST = process.env.BACKEND_HOST || 'localhost';
const BACKEND_PORT = Number(process.env.BACKEND_PORT || 3000);
const BACKEND_PATH = '/api/events';

// Intervalo de actualización de lecturas
const READING_UPDATE_INTERVAL_MS = 2000;

let hasSentInitial = false;
let lastIsRaining = null;
let lastReading = null;
let lastSentTime = 0;
let isSending = false;

// ============================================================
// INTERPRETAR DATOS DEL ARDUINO
// ============================================================

function parseArduinoLine(line) {
    const trimmed = line.trim();

    if (!trimmed) return null;

    // Formato: Lectura: 420 | Lluvia: SI | Ropa: ADENTRO
    const matchMonitor = trimmed.match(
        /Lectura:\s*(\d+)\s*\|\s*Lluvia:\s*(SI|NO)/i
    );

    if (matchMonitor) {
        return {
            reading: parseInt(matchMonitor[1], 10),
            isRaining: matchMonitor[2].toUpperCase() === 'SI'
        };
    }

    // Formato: ESTADO,420,1,1
    const matchEstado = trimmed.match(
        /^ESTADO,(\d+),(0|1),(0|1)$/i
    );

    if (matchEstado) {
        return {
            reading: parseInt(matchEstado[1], 10),
            isRaining: matchEstado[2] === '1'
        };
    }

    return null;
}

// ============================================================
// ENVIAR INFORMACIÓN AL BACKEND
// ============================================================

function sendToBackend(isRaining, reading, reason) {
    return new Promise((resolve) => {

        const payload = JSON.stringify({
            isRaining,
            reading
        });

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
                            `✅ [POST ${BACKEND_PATH}] (${reason}) -> ` +
                            `Lectura: ${reading} ADC | Lluvia: ` +
                            `${isRaining ? 'SÍ' : 'NO'} ` +
                            `(HTTP ${res.statusCode})`
                        );

                        resolve(true);

                    } else {

                        console.error(
                            `⚠️ Error Backend HTTP ${res.statusCode}: ${responseBody}`
                        );

                        resolve(false);
                    }
                });
            }
        );

        req.on('error', (err) => {

            console.error(
                `❌ Error de conexión con Backend: ${err.message}. ` +
                `Verificá que npm start esté ejecutándose.`
            );

            resolve(false);
        });

        req.on('timeout', () => {

            req.destroy();

            console.error(
                '❌ Tiempo de espera agotado al enviar datos al backend.'
            );

            resolve(false);
        });

        req.write(payload);
        req.end();
    });
}

// ============================================================
// PROCESAR LECTURAS DEL SENSOR
// ============================================================

async function handleParsedData({ isRaining, reading }) {

    const now = Date.now();

    const isInitial = !hasSentInitial;

    const rainStateChanged =
        hasSentInitial && isRaining !== lastIsRaining;

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
        reason = isRaining
            ? '🌧️ INICIO DE LLUVIA'
            : '☀️ FIN DE LLUVIA';

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

// ============================================================
// CONEXIÓN SERIAL CON ARDUINO UNO
// ============================================================

function startSerialReader() {

    console.log('====================================================');
    console.log('🔌 RAIN DETECTOR - PUENTE SERIAL USB -> BACKEND');
    console.log('====================================================');

    console.log(`📡 Arduino UNO: ${COM_PORT}`);
    console.log(`📶 ESP32: COM4 (no utilizado por este puente)`);
    console.log(`⚡ Velocidad: ${BAUD_RATE} baudios`);

    console.log(
        `🌐 Backend: http://${BACKEND_HOST}:${BACKEND_PORT}${BACKEND_PATH}`
    );

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

            if ($port.IsOpen) {
                $port.Close()
            }
        }
    `;

    const ps = spawn(
        'powershell.exe',
        [
            '-NoProfile',
            '-NonInteractive',
            '-Command',
            psScript
        ],
        {
            stdio: ['ignore', 'pipe', 'pipe']
        }
    );

    let stdoutBuffer = '';

    // RECIBIR INFORMACIÓN SERIAL

    ps.stdout.on('data', (chunk) => {

        stdoutBuffer += chunk.toString('utf8');

        const lines = stdoutBuffer.split(/\r?\n/);

        stdoutBuffer = lines.pop();

        for (const rawLine of lines) {

            const line = rawLine.trim();

            if (!line) continue;

            if (line === 'SERIAL_OPENED') {

                console.log(
                    `🟢 Puerto ${COM_PORT} abierto correctamente.`
                );

                console.log(
                    '📡 Escuchando lecturas del Arduino UNO...'
                );

                continue;
            }

            const parsed = parseArduinoLine(line);

            if (parsed) {

                handleParsedData(parsed);

            } else {

                console.log(
                    `📟 [Arduino ${COM_PORT}]: ${line}`
                );
            }
        }
    });

    // MANEJAR ERRORES SERIAL

    ps.stderr.on('data', (chunk) => {

        const msg = chunk.toString('utf8').trim();

        if (!msg) return;

        if (msg.includes('SERIAL_OPEN_ERROR')) {

            console.error(
                `\n❌ No se pudo abrir ${COM_PORT}.`
            );

            console.error(
                'Verificá que el Arduino UNO esté conectado.'
            );

            console.error(
                'Cerrá el Monitor Serial de Arduino IDE.'
            );

            console.error(msg);

        } else if (msg.includes('SERIAL_READ_ERROR')) {

            console.error(
                `❌ Error leyendo ${COM_PORT}: ${msg}`
            );

        } else {

            console.error(`⚠️ Error Serial: ${msg}`);
        }
    });

    // REINTENTAR CONEXIÓN SI SE DESCONECTA

    ps.on('close', (code) => {

        if (code !== 0) {

            console.log(
                `🔄 Reintentando conexión con ${COM_PORT} en 3 segundos...`
            );

            setTimeout(startSerialReader, 3000);
        }
    });
}

// ============================================================
// INICIAR PUENTE
// ============================================================

startSerialReader();