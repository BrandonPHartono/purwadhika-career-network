// frontend/src/pages/partner/PostJob.jsx
import { useState } from "react";
import api from "../../utils/axios";
import { useNavigate } from "react-router-dom";

const SKILL_OPTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Express",
  "Python",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "Git",
  "Docker",
  "REST API",
  "GraphQL",
  "Tailwind CSS",
  "Vue.js",
  "Next.js",
  "FastAPI",
  "Spring Boot",
];

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    level: "JUNIOR",
    workType: "ONSITE",
    city: "",
    salaryMin: "",
    salaryMax: "",
    skills: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.skills.length === 0) {
      setError("Pilih minimal 1 skill yang dibutuhkan");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/partner/jobs", form);
      navigate("/partner/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Gagal posting lowongan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Posting Lowongan Baru
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Judul Posisi *
          </label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="contoh: Frontend Developer"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi & Requirements *
          </label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Jelaskan tanggung jawab, kualifikasi, dan benefit..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <select
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="JUNIOR">Junior (0-2 tahun)</option>
              <option value="MID">Mid (2-5 tahun)</option>
              <option value="SENIOR">Senior (5+ tahun)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kota / Lokasi
          </label>
          <input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder="Jakarta, Bandung, Remote, dst."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gaji Min (Rp)
            </label>
            <input
              type="number"
              value={form.salaryMin}
              onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
              placeholder="5000000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gaji Max (Rp)
            </label>
            <input
              type="number"
              value={form.salaryMax}
              onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
              placeholder="10000000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills yang Dibutuhkan * (pilih minimal 1)
          </label>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map((skill) => (
              <button
                type="button"
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  form.skills.includes(skill)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium
                     hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Memposting..." : "Post Lowongan"}
        </button>
      </form>
    </div>
  );
}
