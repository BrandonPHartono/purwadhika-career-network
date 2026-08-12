// backend/src/middleware/auth.js
const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token tidak ditemukan. Silakan login terlebih dahulu.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Sesi telah berakhir. Silakan login ulang.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Token tidak valid.",
    });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Diperlukan role: ${roles.join(" atau ")}`,
      });
    }
    next();
  };
};

const requireAdmin = [requireAuth, requireRole("ADMIN")];
const requirePartner = [requireAuth, requireRole("ADMIN", "PARTNER")];

module.exports = { requireAuth, requireRole, requireAdmin, requirePartner };
