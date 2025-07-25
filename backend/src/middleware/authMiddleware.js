const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  console.log('verifyToken middleware - Headers:', req.headers.authorization ? 'Authorization header present' : 'No authorization header');
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('verifyToken middleware - Invalid authorization format');
    return res.status(403).json({ message: 'No token provided or invalid format' });
  }

  const token = authHeader.split(' ')[1];
  console.log('verifyToken middleware - Token extracted, length:', token ? token.length : 0);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('verifyToken middleware - Token verified successfully, user:', { id: decoded.id, email: decoded.email, role: decoded.role });
    req.user = decoded;
    next();
  } catch (err) {
    console.log('verifyToken middleware - Token verification failed:', err.name, err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(401).json({ message: 'Token verification failed' });
    }
  }
};

module.exports = { verifyToken };