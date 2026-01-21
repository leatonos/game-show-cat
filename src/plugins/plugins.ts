import { io, Socket } from 'socket.io-client';

// Use environment variable
const SOCKET_SERVER = import.meta.env.VITE_SOCKET_SERVER;

export const socket: Socket = io(SOCKET_SERVER, {
  transports: ['websocket'], // optional: force websocket only
});


/**
 * Generates a random string of a specified length.
 * @param length - The number of characters in the resulting string.
 * @returns A random string.
 */
export const getRandomString = (length: number) => {
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result: string = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}