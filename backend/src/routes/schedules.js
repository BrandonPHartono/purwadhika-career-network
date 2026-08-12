const express = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const { createCalendarEvent } = require("../utils/calendar");

const router = express.Router();

router.post("/propose", requireAuth, async (req, res) => {
  try {
    const { applicationId, slots } = req.body;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { user: true, job: { include: { company: true } } },
    });

    if (!application) {
      return res.status(404).json({ message: "Lamaran tidak ditemukan" });
    }

    await prisma.notification.create({
      data: {
        userId: application.userId,
        title: "Pilih Slot Interview",
        body: `${application.job.company.name} mengundang kamu interview. Pilih slot yang tersedia!`,
        type: "interview_invite",
        link: "/interviews",
      },
    });

    await prisma.application.update({
      where: { ud: applicationId },
      data: { status: "INTERVIEW" },
    });
    res.json({
      success: true,
      message: "Slot interview berhasil dipropose ke alumni.",
      slots,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/confirm", requireAuth, async (req, res) => {
  try {
    const { applicationId, selectedSlot } = req.body;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        user: true,
        job: {
          include: {
            company: { include: { user: true } },
          },
        },
      },
    });

    let meetLink = null;
    let calendarEventId = null;

    try {
      const calEvent = await createCalendarEvent({
        summary: `Interview: ${application.user.name} x ${application.job.company.name}`,
        description: `Posisi: ${application.job.title}`,
        startTime: selectedSlot,
        endTime: new Date(
          new Date(selectedSlot).getTime() + 60 * 60 * 1000,
        ).toISOString(),
        attendees: [application.user.email, application.job.company.user.email],
      });
      meetLink = calEvent.meetLink;
      calendarEventId = calEvent.eventId;
    } catch (calError) {
      console.warn("Google Calendar gagal:", calError.message);
    }

    const interview = await prisma.interview.create({
      data: {
        applicationId,
        scheduleAt: new Date(selectedSlot),
        status: "CONFIRMED",
        meetLink,
        calendarEventId,
      },
    });

    await prisma.notification.create({
      data: {
        userId: application.job.company.userId,
        title: "Interview Dikonfirmasi",
        body: `${application.user.name} sudah konfirmasi slot interview.`,
        type: "interview_confirmed",
        link: "/partner/schedule",
      },
    });
    res.json({
      success: true,
      message: "Interview berhasil dijadwalkan!",
      data: interview,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
module.exports = router;
