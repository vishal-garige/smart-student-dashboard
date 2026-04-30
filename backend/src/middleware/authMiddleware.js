import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
   
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    
    const decoded = jwt.verify(token, 'secret123');

    
    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;