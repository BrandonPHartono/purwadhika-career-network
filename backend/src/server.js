// backend/src/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const https = require("https");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const jobRoutes = require("./routes/jobs");
const applicationRoutes = require("./routes/applications");
const broadcastRoutes = require("./routes/broadcasts");
const eventRoutes = require("./routes/events");
const scheduleRoutes = require("./routes/schedules");
const messageRoutes = require("./routes/messages");
const partnerRoutes = require("./routes/partner");
const adminRoutes = require("./routes/admin");
const alumniRoutes = require("./routes/alumni");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/broadcast", broadcastRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/partner", partnerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/alumni", alumniRoutes);

// ── Health check ────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Purwadhika Career Network API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ── Global error handler ─────────────────────────
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ── Keep-alive ping untuk Render free tier ───────
if (process.env.NODE_ENV === "production") {
  setInterval(
    () => {
      try {
        https.get(
          process.env.RENDER_URL || "https://pcn-backend-rpj8.onrender.com",
        );
        console.log("Keep-alive ping sent");
      } catch {}
    },
    10 * 60 * 1000,
  ); // ping setiap 10 menit
}

// ── Start server ─────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
});
