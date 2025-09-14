import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Try to get token from cookies first, then from Authorization header as fallback
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: "Not Authenticated!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      // Only log JWT errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error("JWT verification error:", err);
      }
      return res.status(403).json({ message: "Token is not Valid!" });
    }
    req.userId = payload.id;
    next();
  });
};