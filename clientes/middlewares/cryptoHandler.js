import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';

class cryptoHandler {
  static criptografaDados = async (info) => {
    const chave = randomBytes(32);
    const vi = randomBytes(16);
    const cifra = createCipheriv('aes256', chave, vi);
    const mensagemCifrada = await cifra.update(info, 'utf-8', 'hex') + cifra.final('hex');
    console.log('senha_secreta', mensagemCifrada);
    return mensagemCifrada;
  };

  static decifraDados = async (info) => {
    const chave = randomBytes(32);
    const vi = randomBytes(16);
    const decifra = createDecipheriv('aes256', chave, vi);

    const mensagemDecifrada = await decifra.update(info, 'hex', 'utf-8') + decifra.final('utf-8');

    console.log(`Decifrado: ${mensagemDecifrada.toString('utf-8')} `);
    return mensagemDecifrada;
  };
}

export default cryptoHandler;
