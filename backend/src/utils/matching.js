// backend/src/utils/matching.js

/**
 * Hitung match score antara profil alumni dan satu lowongan
 *
 * Komponen skor (total 100):
 *  - Skills match: 50 poin (bobot tertinggi)
 *  - Level match:  25 poin
 *  - Work type:    15 poin
 *  - Lokasi:       10 poin
 */

function calculateMatchScore(profile, job) {
  let totalScore = 0;

  // ── 1. SKILLS (50 poin) ──────────────────────
  if (profile.skills?.length > 0 && job.skills?.length > 0) {
    const profileSkills = profile.skills.map((s) => s.toLowerCase().trim());
    const jobSkills = job.skills.map((s) => s.toLowerCase().trim());

    const matchedSkills = jobSkills.filter((skill) =>
      profileSkills.includes(skill),
    );

    const skillRatio = matchedSkills.length / jobSkills.length;
    totalScore += Math.round(skillRatio * 50);
  }

  // ── 2. LEVEL (25 poin) ───────────────────────
  if (profile.level && job.level) {
    const profLevel = profile.level.toLowerCase();
    const jobLevel = job.level.toLowerCase();

    if (profLevel === jobLevel) {
      totalScore += 25;
    } else {
      const LEVELS = ["junior", "mid", "senior"];
      const diff = Math.abs(
        LEVELS.indexOf(profLevel) - LEVELS.indexOf(jobLevel),
      );
      if (diff === 1) totalScore += 12;
    }
  }

  // ── 3. WORK TYPE (15 poin) ───────────────────
  if (profile.workType && job.workType) {
    const profWork = profile.workType.toLowerCase();
    const jobWork = job.workType.toLowerCase();

    if (profWork === jobWork) {
      totalScore += 15;
    } else if (jobWork === "hybrid") {
      totalScore += 7;
    }
  }

  // ── 4. LOKASI (10 poin) ──────────────────────
  if (profile.city && job.city) {
    if (profile.city.toLowerCase() === job.city.toLowerCase()) {
      totalScore += 10;
    }
  } else if (job.workType?.toLowerCase() === "remote") {
    totalScore += 10;
  }

  return Math.min(totalScore, 100);
}

/**
 * Dapatkan top N alumni yang cocok untuk sebuah lowongan
 * Dipakai oleh hiring partner saat preview kandidat
 */
async function getTopMatchingAlumni(job, prisma, limit = 20) {
  const profiles = await prisma.alumniProfile.findMany({
    where: { status: "OPEN" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  const scored = profiles
    .map((profile) => ({
      ...profile,
      matchScore: calculateMatchScore(profile, job),
    }))
    .filter((p) => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);

  return scored;
}

module.exports = { calculateMatchScore, getTopMatchingAlumni };
