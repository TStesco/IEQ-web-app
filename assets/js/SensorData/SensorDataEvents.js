'use strict';

const io = require('socket.io-client');

const listeners = new Map();
const pendingEmissions = [];

var connected = false;
var initialized = false;
var socket;

function initialize() {
  socket = io('http://api.atmena.com/v1/stream/sensorData', {
    transports: ['websocket', 'polling'],
  });
  socket.on('connect', handleConnect);
  socket.on('disconnect', handleDisconnect);
  socket.on('newdata', handleNewData);
  initialized = true;
}

const SensorDataEvents = {
  addListener(deviceID, listener) {
    if (!initialized) {
      initialize();
    }

    const currentListeners = listeners.get(deviceID);
    if (currentListeners) {
      currentListeners.push(listener);
    } else {
      listeners.set(deviceID, [listener]);
      if (connected) {
        socket.emit('select', deviceID);
      } else {
        pendingEmissions.push({type: 'select', value: deviceID});
      }
    }
  },

  removeListener(deviceID, listener) {
    const currentListeners = listeners.get(deviceID);
    if (!currentListeners) {
      return;
    }
    const listenerIndex = currentListeners.indexOf(listener);
    if (listenerIndex < 0) {
      return;
    }
    currentListeners.splice(listenerIndex, 1);
    if (!currentListeners.length) {
      listeners.delete(deviceID);
      if (connected) {
        socket.emit('deselect', deviceID);
      } else {
        pendingEmissions.push({type: 'deselect', value: deviceID});
      }
    }
  },
};

function handleConnect() {
  connected = true;

  for (var i = 0; i < pendingEmissions.length; i++) {
    const emission = pendingEmissions[i];
    socket.emit(emission.type, emission.value);
  }
  pendingEmissions.length = 0;
}

function handleDisconnect() {
  connected = false;
}

function handleNewData(newData) {
  const deviceID = newData.deviceID;
  const currentListeners = listeners.get(deviceID);
  if (!currentListeners) {
    return;
  }
  newData.created = new Date(newData.created); // created time must be a Date object for dygraphs
  for (var i = 0; i < currentListeners.length; i++) {
    currentListeners[i](newData);
  }
}

module.exports = SensorDataEvents;
