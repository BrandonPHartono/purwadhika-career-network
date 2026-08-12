// backend/src/routes/admin.js
const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/admin/stats
router.get("/stats", requireAuth, ...requireAdmin, async (req, res) => {
  try {
    const [totalAlumni, totalPartners, totalJobs, totalApps, totalHired] =
      await Promise.all([
        prisma.user.count({ where: { role: "ALUMNI" } }),
        prisma.user.count({ where: { role: "PARTNER" } }),
        prisma.job.count({ where: { status: "ACTIVE" } }),
        prisma.application.count(),
        prisma.application.count({ where: { status: "HIRED" } }),
      ]);

    res.json({
      totalAlumni,
      totalPartners,
      totalJobs,
      totalApps,
      placementRate:
        totalApps > 0 ? Math.round((totalHired / totalApps) * 100) : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/users
router.get("/users", requireAuth, ...requireAdmin, async (req, res) => {
  const { role } = req.query;
  try {
    const users = await prisma.user.findMany({
      where: role ? { role } : {},
      include: { profile: true, company: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/users/:id
router.patch("/users/:id", requireAuth, ...requireAdmin, async (req, res) => {
  const { isActive } = req.body;
  try {
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isActive },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
