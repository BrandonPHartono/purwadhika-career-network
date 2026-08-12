// frontend/src/pages/alumni/Profile.jsx
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import toast from "react-hot-toast";

const SKILL_OPTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Vue.js",
  "Next.js",
  "Node.js",
  "Express",
  "Python",
  "FastAPI",
  "Django",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Prisma",
  "SQLAlchemy",
  "Docker",
  "Git",
  "REST API",
  "GraphQL",
  "Tailwind CSS",
];

export default function ProfilePage() {
  const [form, setForm] = useState({
    batch: "",
    program: "",
    graduationYear: "",
    currentTitle: "",
    currentCompany: "",
    yearsExp: "",
    skills: [],
    workType: "ONSITE",
    city: "",
    bio: "",
    linkedinUrl: "",
    portfolioUrl: "",
    cvUrl: "",
  });
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/alumni/profile");
        if (res.data) {
          setForm((prev) => ({ ...prev, ...res.data }));
          setScore(res.data.profileCompletion || 0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/api/alumni/profile", form);
      setScore(res.data.profileCompletion || 0);
      toast.success("Profil berhasil disimpan!");
    } catch (err) {
      toast.error("Gagal menyimpan profil");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const barColor =
    score >= 80 ? "bg-green-500" : score >= 50 ? "bg-blue-500" : "bg-amber-400";

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Profil Saya</h1>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-gray-700">Kelengkapan Profil</span>
          <span className="font-bold text-gray-800">{score}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${score}%` }}
          />
        </div>
        {score < 80 ? (
          <p className="text-xs text-gray-500 mt-2">
            Lengkapi profil untuk meningkatkan peluang ditemukan recruiter
          </p>
        ) : (
          <p className="text-xs text-green-600 mt-2 font-medium">
            Profil sudah Job Ready! Recruiter bisa menemukan kamu.
          </p>
        )}
      </div>

      <div className="space-y-5">
        {/* Informasi Pendidikan */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
            Informasi Pendidikan
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Batch"
              value={form.batch}
              onChange={(v) => setForm({ ...form, batch: v })}
              placeholder="contoh: BATCH-12"
            />
            <Field
              label="Program"
              value={form.program}
              onChange={(v) => setForm({ ...form, program: v })}
              placeholder="Full Stack Web Developer"
            />
            <Field
              label="Tahun Lulus"
              type="number"
              value={form.graduationYear}
              onChange={(v) => setForm({ ...form, graduationYear: v })}
              placeholder="2024"
            />
          </div>
        </section>

        {/* Karir */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
            Karir Saat Ini
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Jabatan"
              value={form.currentTitle}
              onChange={(v) => setForm({ ...form, currentTitle: v })}
              placeholder="Frontend Developer"
            />
            <Field
              label="Perusahaan"
              value={form.currentCompany}
              onChange={(v) => setForm({ ...form, currentCompany: v })}
              placeholder="PT Tokopedia"
            />
            <Field
              label="Lama Pengalaman (tahun)"
              type="number"
              value={form.yearsExp}
              onChange={(v) => setForm({ ...form, yearsExp: v })}
              placeholder="2"
            />
          </div>
        </section>

        {/* Preferensi Kerja */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
            Preferensi Kerja
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Tipe Kerja
              </label>
              <select
                value={form.workType}
                onChange={(e) => setForm({ ...form, workType: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="ONSITE">Onsite</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
            <Field
              label="Kota Preferensi"
              value={form.city}
              onChange={(v) => setForm({ ...form, city: v })}
              placeholder="Jakarta"
            />
          </div>
        </section>

        {/* Skills */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
            Skills ({form.skills.length} dipilih)
          </h2>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map((skill) => (
              <button
                type="button"
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1 rounded-full text-sm border font-medium transition-colors ${
                  form.skills.includes(skill)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </section>

        {/* Bio & Links */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
            Bio &amp; Links
          </h2>
          <textarea
            rows={4}
            value={form.bio || ""}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Ceritakan sedikit tentang dirimu..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="LinkedIn URL"
              value={form.linkedinUrl || ""}
              onChange={(v) => setForm({ ...form, linkedinUrl: v })}
              placeholder="https://linkedin.com/in/nama"
            />
            <Field
              label="Portfolio URL"
              value={form.portfolioUrl || ""}
              onChange={(v) => setForm({ ...form, portfolioUrl: v })}
              placeholder="https://portfolio.com"
            />
            <Field
              label="Link CV"
              value={form.cvUrl || ""}
              onChange={(v) => setForm({ ...form, cvUrl: v })}
              placeholder="https://drive.google.com/..."
            />
          </div>
        </section>
      </div>

      {/* Tombol Simpan */}
      <div className="mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium
                     hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
