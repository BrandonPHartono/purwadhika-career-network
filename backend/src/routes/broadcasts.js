const express = require("express");
const prisma = require("../lib/prisma");
const { requireAdmin } = require("../middleware/auth");
const { sendBroadcastEmails } = require("../utils/email");

const router = express.Router();

router.post("/", ...requireAdmin, async (req, res) => {
  try {
    const { title, message, segments, channels } = req.body;

    let whereClause = { role: "ALUMNI" };
    let profileWhere = {};

    if (!segments.includes("all")) {
      const batchSegs = segments.filter((s) => s.startsWith("batch_"));
      if (batchSegs.length > 0) {
        const batches = batchSegs.map((s) => s.replace("batch_", ""));
        profileWhere.batch = { in: batches };
      }

      if (segements.includes("open_to_work")) {
        profileWhere.status = "OPEN";
      }

      const skillSegs = segments.filters((s) =>
        ["frontend", "fullstack", "backend"].includes(s),
      );
      if (skillSegs.length > 0) {
        const skilMap = {
          frontend: ["React", "Vue", "Angular"],
          fullstack: ["React", "Node.js"],
          backend: ["Node.js", "Express", "Go", "Python"],
        };
        const targetSkills = skillSegs.flatMap((s) => skillMap[s]);
        profileWhere.skills = { hasSome: targetSkills };
      }
    }

    if (Object.keys(profileWhere).length > 0) {
      whereClause.profile = { is: profileWhere };
    }

    const user = await prisma.user.findMany({
      where: whereClause,
      select: { id: true, name: true, email: true },
    });
    if (users.length === 0) {
      return res.json({
        success: true,
        message: "Tidak ada penerima.",
        sent: 0,
      });
    }

    let emailResult = { success: 0, failed: 0 };
    let notifCount = 0;

    if (channels.includes("email")) {
      emailResult = await sendBroadcastEmails({
        recipients: users,
        subject: title,
        title,
        body: message,
      });
    }

    if (channels.includes("in_app")) {
      await prisma.notification.createMany({
        data: users.map((u) => ({
          userId: u.id,
          title,
          body: message,
          type: "broadcast",
        })),
        skipDuplicates: true,
      });
      notifCount = users.length;
    }
    res.json({
      success: true,
      message: `Broadcast dikirim ke ${users.length} alumni`,
      emailSent: emailResult.success,
      emailFailed: emailResult.failed,
      notifCreated: notifCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: " Server error" });
  }
});

module.exports = router;
