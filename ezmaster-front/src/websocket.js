import io from "socket.io-client";
const socket = io();

// socket.on('refreshInfosMachine', data => {console.log('refreshInfosMachine', data)});
// socket.on('refreshInfosMachine', data => {console.log('refreshInfosMachine2', data)});
// socket.on('statusPull', data => {console.log('statusPull', data)});
// socket.on('docker-event', data => {console.log('docker-event', data)});

export function subscribeToWS(eventName, fn) {
  socket.on(eventName, fn);
}
