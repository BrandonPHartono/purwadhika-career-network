// backend/src/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// ── VALIDATION SCHEMAS ───────────────────────────
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .required()
    .messages({ "string.min": "Password minimal 8 karakter" }),
  role: Joi.string().valid("ALUMNI", "PARTNER").default("ALUMNI"),
  companyName: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// ── HELPERS ──────────────────────────────────────
function createToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

function formatUser(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// ── POST /api/auth/register ──────────────────────
router.post("/register", async (req, res) => {
  try {
    // 1. Validasi input dengan Joi
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { name, email, password, role, companyName } = value;

    // 2. Cek email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar. Silakan gunakan email lain.",
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Buat user
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name.trim(),
        role,
        ...(role === "ALUMNI" && {
          profile: {
            create: {
              status: "OPEN",
              profileCompletion: 20,
            },
          },
        }),
        ...(role === "PARTNER" && {
          company: {
            create: {
              name: companyName || name,
              status: "PENDING",
            },
          },
        }),
      },
      include: {
        profile: true,
        company: true,
      },
    });

    // 5. Buat token dan kirim response
    const token = createToken(newUser);

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil!",
      token,
      user: formatUser(newUser),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server. Silakan coba lagi.",
    });
  }
});

// ── POST /api/auth/login ─────────────────────────
router.post("/login", async (req, res) => {
  try {
    // 1. Validasi input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = value;

    // 2. Cari user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true, company: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password tidak sesuai.",
      });
    }

    // 3. Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Email atau password tidak sesuai.",
      });
    }

    // 4. Buat token dan kirim response
    const token = createToken(user);

    res.json({
      success: true,
      message: "Login berhasil!",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
    });
  }
});

// ── GET /api/auth/me ─────────────────────────────
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: { profile: true, company: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    res.json({
      success: true,
      user: formatUser(user),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
});

module.exports = router;
