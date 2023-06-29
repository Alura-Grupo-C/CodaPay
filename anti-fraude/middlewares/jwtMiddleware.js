import jwt from 'jsonwebtoken';

const JWT_SECRET = 'codaycoda';
//
const JWT_CONFIG = { expiresIn: '0.5h', algorithm: 'HS256' };

class tokenHandler {
  static tokenCreator(payload) {
    const token = jwt.sign({ payload }, JWT_SECRET, JWT_CONFIG);
    return token;
  }

  static tokenVerifier = (req, _res, next) => {
    const { authorization } = req.headers;
    if (!authorization) return next('401|Token not found');
    try {
      jwt.verify(authorization, JWT_SECRET, JWT_CONFIG);
      return next();
    } catch (err) {
      return next('401|Expired or invalid token');
    }
  };
}

export default tokenHandler;
