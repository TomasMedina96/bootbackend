import { io } from 'socket.io-client';
import readline from 'readline';
const socket = io('http://localhost:3000');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

socket.on('connect', () => {
  console.log('Conectado al servidor');
  rl.question('Tú: ', (message) => {
    socket.emit('mensajeUsuario', message);
  });
});

socket.on('respuestaBot', (response) => {
  console.log('Bot:', response);
  rl.question('Tú: ', (message) => {
    socket.emit('mensajeUsuario', message);
  });
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor');
});