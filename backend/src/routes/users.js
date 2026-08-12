// backend/src/routes/users.js
const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/users/notifications
router.get("/notifications", requireAuth, async (req, res) => {
  try {
    const notifs = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ data: notifs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/notifications/read-all
router.patch("/notifications/read-all", requireAuth, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.userId, isRead: false },
      data: { isRead: true },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
