const API_BASE = import.meta.env.VITE_API_BASE;
import { io } from 'socket.io-client';
const socket = io(API_BASE, {
  path: '/socket.io',    // ← the default
  transports: ['websocket','polling'],
  withCredentials: true
});
export default socket;