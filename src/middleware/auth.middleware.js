import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';

export const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const payload = jwttoken.verify(token);
    req.user = payload;
    next();
  } catch (error) {
    logger.warn('JWT verification failed', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireRole =
  (roles = []) =>
    (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({
            error: 'Access denied',
            message: 'User does not have required role',
          });
      }

      next();
    };
