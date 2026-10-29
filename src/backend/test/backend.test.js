const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const dbModule = require('../database');

const TEST_DB_PATH = path.join(__dirname, 'temp_test_backend.db');

describe('Pruebas Unitarias del Backend (SQLite y Lógica de Eventos)', () => {
  before(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      try { fs.unlinkSync(TEST_DB_PATH); } catch (_) {}
    }
    dbModule.initDatabase(TEST_DB_PATH);
  });

  after(() => {
    dbModule.closeDatabase();
    if (fs.existsSync(TEST_DB_PATH)) {
      try { fs.unlinkSync(TEST_DB_PATH); } catch (_) {}
    }
  });

  test('La base de datos se inicializa con estado "Sin lluvia" por defecto', () => {
    const state = dbModule.getCurrentState();
    assert.equal(state.isRaining, false);
    assert.equal(state.lastEventType, 'none');
  });

  test('Transición a lluvia: registra evento rain_start y actualiza estado', () => {
    const res = dbModule.processRainReport(true, 550);
    assert.equal(res.stateChanged, true);
    assert.equal(res.isRaining, true);
    assert.ok(res.event);
    assert.equal(res.event.eventType, 'rain_start');
    assert.equal(res.event.reading, 550);

    const currentState = dbModule.getCurrentState();
    assert.equal(currentState.isRaining, true);
    assert.equal(currentState.lastReading, 550);
  });

  test('Lluvia continua: NO genera eventos duplicados en la base de datos', () => {
    const eventsBefore = dbModule.getEvents(100).length;

    // Reportes idénticos en estado de lluvia
    const rep1 = dbModule.processRainReport(true, 560);
    const rep2 = dbModule.processRainReport(true, 570);

    assert.equal(rep1.stateChanged, false);
    assert.equal(rep1.event, null);
    assert.equal(rep2.stateChanged, false);
    assert.equal(rep2.event, null);

    const eventsAfter = dbModule.getEvents(100).length;
    assert.equal(eventsBefore, eventsAfter);
  });

  test('Transición a seco: registra evento rain_stop y actualiza estado', () => {
    const res = dbModule.processRainReport(false, 90);
    assert.equal(res.stateChanged, true);
    assert.equal(res.isRaining, false);
    assert.ok(res.event);
    assert.equal(res.event.eventType, 'rain_stop');
    assert.equal(res.event.reading, 90);

    const currentState = dbModule.getCurrentState();
    assert.equal(currentState.isRaining, false);
    assert.equal(currentState.lastReading, 90);
  });

  test('Consulta de historial ordenado cronológicamente (más recientes primero)', () => {
    const events = dbModule.getEvents(10);
    assert.equal(events.length, 2);
    assert.equal(events[0].eventType, 'rain_stop');
    assert.equal(events[1].eventType, 'rain_start');
  });

  test('getEvents respeta límites de paginación', () => {
    const singleEvent = dbModule.getEvents(1);
    assert.equal(singleEvent.length, 1);
  });
});
