const express = require("express");
const { prisma } = require("../lib/prisma");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { date: { gte: new Date() } },
      include: { _count: { select: { registrations: true } } },
      orderBy: { date: "asc" },
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { title, description, date, location, maxParticipants, type } =
    req.body;
  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        type,
        date: new Date(date),
        location: location || "Online",
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
      },
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/register", requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { _count: { select: { registrations: true } } },
    });
    if (!event)
      return res.status(404).json({ error: "Event tidak ditemukan " });

    if (
      event.maxParticipants &&
      event._count.registrations >= event.maxParticipants
    ) {
      return res.status(400).json({ error: "Event sudah penuh" });
    }

    const existing = await prisma.eventRegistration.findFirst({
      where: { eventId: id, userId: req.user.id },
    });

    if (existing) return res.status(400).json({ error: "Sudah terdaftar" });
    const reg = await prisma.eventRegistration.create({
      data: { eventId: id, userId: req.user.id },
    });
    res.status(201).json(reg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id/register", requireAuth, async (req, res) => {
  try {
    await prisma.eventRegistration.deleteMany({
      where: { eventId: req.params.id, userId: req.user.id },
    });
    res.json({ message: "Pendaftaran dibatalkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/my-registrations", requireAuth, async (req, res) => {
  try {
    const regs = await prisma.eventRegistration.findMany({
      where: { userId: req.user.userId },
    });
    res.json(regs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
