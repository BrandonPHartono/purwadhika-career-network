// backend/src/routes/applications.js
const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// ── POST /api/applications ───────────────────────
router.post("/", requireAuth, async (req, res) => {
  try {
    const { jobId, coverLetter, availability, salaryExpected } = req.body;

    if (req.user.role !== "ALUMNI") {
      return res
        .status(403)
        .json({ message: "Hanya alumni yang bisa melamar." });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.status !== "ACTIVE") {
      return res
        .status(404)
        .json({ message: "Lowongan tidak ditemukan atau sudah tutup." });
    }

    const existing = await prisma.application.findFirst({
      where: { userId: req.user.userId, jobId },
    });

    if (existing) {
      return res
        .status(409)
        .json({ message: "Kamu sudah melamar ke lowongan ini." });
    }

    const application = await prisma.application.create({
      data: {
        userId: req.user.userId,
        jobId,
        coverLetter: coverLetter || null,
        availability: availability || null,
        salaryExpected: salaryExpected ? Number(salaryExpected) : null,
        status: "APPLIED",
      },
      include: {
        job: { include: { company: true } },
        user: { select: { name: true, email: true } },
      },
    });

    await prisma.notification.create({
      data: {
        userId: req.user.userId,
        title: "Lamaran Terkirim!",
        body: `Lamaranmu untuk posisi ${job.title} sudah dikirim. Tim HR akan mereview dalam 2-5 hari kerja.`,
        type: "application",
        link: "/applications",
      },
    });

    res.status(201).json({
      success: true,
      message: "Lamaran berhasil dikirim!",
      data: application,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── GET /api/applications/my ─────────────────────
router.get("/my", requireAuth, async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.userId },
      include: {
        job: { include: { company: true } },
        interview: true,
      },
      orderBy: { appliedAt: "desc" },
    });

    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── PATCH /api/applications/:id/status ──────────
router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "REVIEWED",
      "INTERVIEW",
      "OFFERED",
      "HIRED",
      "REJECTED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid." });
    }

    const application = await prisma.application.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        user: { select: { id: true, name: true } },
        job: true,
      },
    });

    const statusMessages = {
      REVIEWED: "Lamaranmu sedang direview lebih lanjut.",
      INTERVIEW: "Selamat! Kamu dipanggil interview.",
      OFFERED: "Selamat! Kamu mendapat penawaran kerja!",
      HIRED: "Selamat! Kamu resmi diterima!",
      REJECTED: "Maaf, lamaranmu belum berhasil kali ini. Semangat!",
    };

    await prisma.notification.create({
      data: {
        userId: application.user.id,
        title: `Update Lamaran: ${application.job.title}`,
        body: statusMessages[status] || "Status lamaranmu diupdate.",
        type: "status_update",
        link: "/applications",
      },
    });

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
