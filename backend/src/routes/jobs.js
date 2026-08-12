// backend/src/routes/jobs.js
const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requirePartner } = require("../middleware/auth");
const { calculateMatchScore } = require("../utils/matching");

const router = express.Router();

// ── GET /api/jobs ────────────────────────────────
router.get("/", requireAuth, async (req, res) => {
  try {
    const {
      skills,
      level,
      workType,
      city,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const where = {
      status: "ACTIVE",
    };

    if (level) where.level = level;
    if (workType) where.workType = workType;
    if (city) where.city = { contains: city, mode: "insensitive" };

    if (skills) {
      const skillsArray = skills.split(",");
      where.skills = { hasSome: skillsArray };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const total = await prisma.job.count({ where });

    const jobs = await prisma.job.findMany({
      where,
      include: {
        company: {
          select: { name: true, logoUrl: true, industry: true },
        },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    let jobsWithScore = jobs;
    if (req.user.role === "ALUMNI") {
      const profile = await prisma.alumniProfile.findUnique({
        where: { userId: req.user.userId },
      });
      if (profile) {
        jobsWithScore = jobs.map((job) => ({
          ...job,
          matchScore: calculateMatchScore(profile, job),
        }));
        jobsWithScore.sort((a, b) => b.matchScore - a.matchScore);
      }
    }

    res.json({
      success: true,
      data: jobsWithScore,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── GET /api/jobs/:id ────────────────────────────
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
      include: { company: true },
    });

    if (!job)
      return res.status(404).json({ message: "Lowongan tidak ditemukan" });

    let matchScore = null;
    if (req.user.role === "ALUMNI") {
      const profile = await prisma.alumniProfile.findUnique({
        where: { userId: req.user.userId },
      });
      if (profile) matchScore = calculateMatchScore(profile, job);
    }

    let hasApplied = false;
    if (req.user.role === "ALUMNI") {
      const existing = await prisma.application.findFirst({
        where: { userId: req.user.userId, jobId: job.id },
      });
      hasApplied = !!existing;
    }

    res.json({ success: true, data: { ...job, matchScore, hasApplied } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── POST /api/jobs ───────────────────────────────
router.post("/", requirePartner, async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      responsibilities,
      skills,
      level,
      workType,
      city,
      salaryMin,
      salaryMax,
    } = req.body;

    const company = await prisma.company.findUnique({
      where: { userId: req.user.userId },
    });

    if (!company) {
      return res.status(400).json({ message: "Company tidak ditemukan" });
    }

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        requirements: requirements || [],
        responsibilities: responsibilities || [],
        skills: skills || [],
        level,
        workType,
        city: city || null,
        salaryMin: salaryMin ? Number(salaryMin) : null,
        salaryMax: salaryMax ? Number(salaryMax) : null,
        companyId: company.id,
      },
      include: { company: true },
    });

    res.status(201).json({ success: true, data: newJob });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
