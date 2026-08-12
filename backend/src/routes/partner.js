// backend/src/routes/partner.js
const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requirePartner } = require("../middleware/auth");
const { calculateMatchScore } = require("../utils/matching");

const router = express.Router();

// ── GET /api/partner/jobs ────────────────────────
router.get("/jobs", requireAuth, requirePartner, async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { userId: req.user.userId },
    });

    if (!company) {
      return res.status(404).json({ error: "Company tidak ditemukan" });
    }

    const jobs = await prisma.job.findMany({
      where: { companyId: company.id },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/partner/jobs ───────────────────────
router.post("/jobs", requireAuth, requirePartner, async (req, res) => {
  const {
    title,
    description,
    level,
    workType,
    city,
    salaryMin,
    salaryMax,
    skills,
    deadline,
  } = req.body;

  try {
    const company = await prisma.company.findUnique({
      where: { userId: req.user.userId },
    });

    if (!company) {
      return res.status(404).json({ error: "Company tidak ditemukan" });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        level,
        workType,
        city: city || null,
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
        skills: skills || [],
        status: "ACTIVE",
        companyId: company.id,
      },
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/partner/jobs/:id/candidates ─────────
router.get(
  "/jobs/:id/candidates",
  requireAuth,
  requirePartner,
  async (req, res) => {
    const { id } = req.params;

    try {
      const company = await prisma.company.findUnique({
        where: { userId: req.user.userId },
      });

      const job = await prisma.job.findFirst({
        where: { id, companyId: company?.id },
      });

      if (!job) {
        return res.status(404).json({ error: "Lowongan tidak ditemukan" });
      }

      const alumni = await prisma.user.findMany({
        where: { role: "ALUMNI" },
        include: { profile: true },
      });

      const candidates = alumni
        .filter((a) => a.profile)
        .map((a) => ({
          id: a.id,
          name: a.name,
          email: a.email,
          profile: a.profile,
          score: calculateMatchScore(a.profile, job),
        }))
        .filter((c) => c.score >= 30)
        .sort((a, b) => b.score - a.score);

      res.json(candidates);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// ── PATCH /api/partner/applications/:id ──────────
router.patch(
  "/applications/:id",
  requireAuth,
  requirePartner,
  async (req, res) => {
    const { status } = req.body;

    try {
      const updated = await prisma.application.update({
        where: { id: req.params.id },
        data: { status },
      });

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

module.exports = router;
