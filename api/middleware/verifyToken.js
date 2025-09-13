import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  
  // Debug logging
  console.log("Cookies received:", req.cookies);
  console.log("Token found:", !!token);
  console.log("Request headers:", req.headers);

  if (!token) return res.status(401).json({ message: "Not Authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      console.log("JWT verification error:", err);
      return res.status(403).json({ message: "Token is not Valid!" });
    }
    req.userId = payload.id;
    console.log("User authenticated:", payload.id);
    next();
  });
};