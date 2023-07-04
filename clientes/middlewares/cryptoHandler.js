import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const key = process.env.CRYPTO_KEY;
const iv = process.env.CRYPTO_IV;

function base64ToArrayBuffer(base64) {
  var binary_string = atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

class cryptoHandler {
  static criptografaDados = async (info) => {
    const cifra = createCipheriv('aes256', base64ToArrayBuffer(key), base64ToArrayBuffer(iv));
    const mensagemCifrada = await cifra.update(info, 'utf-8', 'hex') + cifra.final('hex');
    return mensagemCifrada;
  };
  static decifraDados = async (info) => {
    const decifra = createDecipheriv('aes256', base64ToArrayBuffer(key), base64ToArrayBuffer(iv));

    const mensagemDecifrada = await decifra.update(info, 'hex', 'utf-8') + decifra.final('utf-8');

    return mensagemDecifrada;
  };
}

export default cryptoHandler;
