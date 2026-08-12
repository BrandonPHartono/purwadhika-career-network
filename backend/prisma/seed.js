const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seed database...");

  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.alumniProfile.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@purwadhika.com",
      password: await bcrypt.hash("admin123", 12),
      name: "Admin Purwadhika",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin dibuat:", adminUser.email);

  const alumniUser = await prisma.user.create({
    data: {
      email: "rizky@alumni.com",
      password: await bcrypt.hash("alumni123", 12),
      name: "Rizky Ananda",
      role: "ALUMNI",
      profile: {
        create: {
          batch: "2024",
          skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
          level: "junior",
          workType: "remote",
          city: "Jakarta",
          status: "OPEN",
          bio: "Fullstack Developer lulusan Purwadhika Batch 2024",
          profileCompletion: 80,
        },
      },
    },
  });
  console.log("✅ Alumni dibuat:", alumniUser.email);

  const partnerUser = await prisma.user.create({
    data: {
      email: "hr@tokopedia.com",
      password: await bcrypt.hash("partner123", 12),
      name: "HR Tokopedia",
      role: "PARTNER",
      company: {
        create: {
          name: "Tokopedia",
          industry: "E-commerce",
          description: "Platform e-commerce terbesar di Indonesia",
          picName: "Budi Santoso",
          picEmail: "hr@tokopedia.com",
          feePerHire: 8500000,
          status: "ACTIVE",
        },
      },
    },
  });
  console.log("✅ Partner dibuat:", partnerUser.email);

  const company = await prisma.company.findFirst({
    where: { userId: partnerUser.id },
  });

  if (!company) {
    throw new Error("Company tidak ditemukan!");
  }

  const jobs = await Promise.all([
    prisma.job.create({
      data: {
        title: "Frontend Developer",
        description:
          "Kami mencari Frontend Developer yang passionate untuk bergabung dengan tim produk kami.",
        requirements: [
          "Minimal 1 tahun pengalaman React",
          "Familiar dengan TypeScript",
          "Mengerti Git workflow",
        ],
        responsibilities: [
          "Membangun UI dengan React",
          "Berkolaborasi dengan designer",
          "Code review",
        ],
        skills: ["React", "TypeScript", "Git", "REST API"],
        level: "junior",
        workType: "remote",
        city: "Jakarta",
        salaryMin: 7000,
        salaryMax: 10000,
        status: "ACTIVE",
        companyId: company.id,
      },
    }),
    prisma.job.create({
      data: {
        title: "Fullstack Engineer",
        description:
          "Tim Engineering Tokopedia membuka posisi Fullstack Engineer.",
        requirements: [
          "2+ tahun pengalaman",
          "Profisien Node.js dan React",
          "Familiar Docker",
        ],
        responsibilities: [
          "Develop fitur end-to-end",
          "Optimasi performa",
          "Mentoring junior",
        ],
        skills: ["Node.js", "React", "PostgreSQL", "Docker"],
        level: "mid",
        workType: "hybrid",
        city: "Jakarta",
        salaryMin: 10000,
        salaryMax: 15000,
        status: "ACTIVE",
        companyId: company.id,
      },
    }),
  ]);

  console.log(`✅ ${jobs.length} lowongan dibuat`);
  console.log("🎉 Seed selesai!");
  console.log("Akun testing:");
  console.log("  Admin:   admin@purwadhika.com / admin123");
  console.log("  Alumni:  rizky@alumni.com / alumni123");
  console.log("  Partner: hr@tokopedia.com / partner123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
