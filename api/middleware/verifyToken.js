import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  
  // Debug logging
  console.log("=== AUTH DEBUG ===");
  console.log("Request URL:", req.originalUrl);
  console.log("Request method:", req.method);
  console.log("Cookies received:", req.cookies);
  console.log("Token found:", !!token);
  console.log("Token value:", token ? token.substring(0, 20) + "..." : "none");
  console.log("Request headers:", {
    'cookie': req.headers.cookie,
    'origin': req.headers.origin,
    'referer': req.headers.referer
  });
  console.log("==================");

  if (!token) {
    console.log("No token found, returning 401");
    return res.status(401).json({ message: "Not Authenticated!" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      console.log("JWT verification error:", err);
      return res.status(403).json({ message: "Token is not Valid!" });
    }
    req.userId = payload.id;
    console.log("User authenticated successfully:", payload.id);
    next();
  });
};