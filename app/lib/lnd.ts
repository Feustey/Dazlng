import { authenticatedLndGrpc } from 'ln-service';
import fs from 'fs';

const cert = fs.readFileSync(process.env.LND_CERT_PATH as string).toString();
const macaroon = fs.readFileSync(process.env.LND_MACAROON_PATH as string).toString();
const socket = process.env.LND_SOCKET as string;

export const { lnd } = authenticatedLndGrpc({
  cert,
  macaroon,
  socket,
}); 