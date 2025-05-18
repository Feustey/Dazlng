import { authenticatedLndGrpc } from 'ln-service';
import fs from 'fs';

function safeReadFile(path?: string) {
  if (!path) return '';
  try {
    return fs.readFileSync(path).toString();
  } catch (e) {
    console.warn(`[LND] Fichier manquant ou illisible: ${path}`);
    return '';
  }
}

const cert = safeReadFile(process.env.LND_CERT_PATH);
const macaroon = safeReadFile(process.env.LND_MACAROON_PATH);
const socket = process.env.LND_SOCKET as string;

export const { lnd } = authenticatedLndGrpc({
  cert,
  macaroon,
  socket,
}); 