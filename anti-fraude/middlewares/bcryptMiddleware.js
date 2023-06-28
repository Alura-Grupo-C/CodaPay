import bcryptjs from 'bcryptjs';

const saltRounds = 12;

class criptografia {
  static protegeSenha(senha) {
    return bcryptjs.hash(senha, saltRounds);
  };
};

export default criptografia;
