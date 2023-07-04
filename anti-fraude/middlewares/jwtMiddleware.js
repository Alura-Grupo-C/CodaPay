import jwt from 'jsonwebtoken';

const JWT_SECRET = 'codaycoda';
//
const JWT_CONFIG = { expiresIn: '0.5h', algorithm: 'HS256' };

class tokenHandler {
  static tokenCreator(payload) {
    const token = jwt.sign({ payload }, JWT_SECRET, JWT_CONFIG);
    return token;
  }

  static tokenVerifier = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).send({ message: 'Token not found' });
    }

    const token = authorization.split(' ');
    try {
      jwt.verify(token[1], JWT_SECRET, JWT_CONFIG);
      return next();
    } catch (err) {
      return res.status(401).send({ message: 'Expired or invalid token' });
    }
  };
}

export default tokenHandler;
