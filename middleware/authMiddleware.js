const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer token"

  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

 try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "mySecretKey");
  console.log("Decoded token:", decoded);
  req.user = decoded;
  next();
} catch (error) {
  console.error("JWT Error:", error);
  return res.status(403).json({ message: "Invalid or expired token" });
}

};

module.exports = authMiddleware;
