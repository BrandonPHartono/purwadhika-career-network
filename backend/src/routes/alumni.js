// backend/src/routes/alumni.js
const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/alumni/profile
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const profile = await prisma.alumniProfile.findUnique({
      where: { userId: req.user.userId },
    });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/alumni/profile
router.put("/profile", requireAuth, async (req, res) => {
  const {
    batch,
    program,
    graduationYear,
    currentTitle,
    currentCompany,
    yearsExp,
    skills,
    workType,
    city,
    bio,
    linkedinUrl,
    portfolioUrl,
    cvUrl,
  } = req.body;

  const fields = [
    batch,
    program,
    currentTitle,
    skills?.length > 0,
    bio,
    linkedinUrl,
    cvUrl,
    city,
  ];
  const filled = fields.filter(Boolean).length;
  const profileCompletion = Math.round((filled / fields.length) * 100);

  try {
    const profile = await prisma.alumniProfile.upsert({
      where: { userId: req.user.userId },
      update: {
        batch,
        program,
        graduationYear: graduationYear ? parseInt(graduationYear) : null,
        currentTitle,
        currentCompany,
        yearsExp: yearsExp ? parseInt(yearsExp) : null,
        skills: skills || [],
        workType,
        city,
        bio,
        linkedinUrl,
        portfolioUrl,
        cvUrl,
        profileCompletion,
      },
      create: {
        userId: req.user.userId,
        batch,
        program,
        graduationYear: graduationYear ? parseInt(graduationYear) : null,
        currentTitle,
        currentCompany,
        yearsExp: yearsExp ? parseInt(yearsExp) : null,
        skills: skills || [],
        workType,
        city,
        bio,
        linkedinUrl,
        portfolioUrl,
        cvUrl,
        profileCompletion,
      },
    });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
