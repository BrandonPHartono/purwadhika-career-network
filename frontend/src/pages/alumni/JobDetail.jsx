// frontend/src/pages/alumni/JobDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    coverLetter: "",
    availability: "",
    salaryExpected: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/jobs/${id}`);
        setJob(res.data.data);
      } catch {
        toast.error("Lowongan tidak ditemukan");
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    try {
      await api.post("/api/applications", {
        jobId: id,
        ...form,
        salaryExpected: form.salaryExpected
          ? Number(form.salaryExpected)
          : null,
      });
      toast.success("Lamaran berhasil dikirim!");
      setJob((prev) => ({ ...prev, hasApplied: true }));
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengirim lamaran");
    } finally {
      setApplying(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );

  if (!job) return null;

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
            <p className="text-gray-500 mt-1">{job.company?.name}</p>
            <div className="flex gap-3 mt-3 text-sm text-gray-400">
              <span>📍 {job.city || "Tidak disebutkan"}</span>
              <span>⏱ {job.workType}</span>
              <span>🎯 {job.level}</span>
            </div>
          </div>
          {job.matchScore != null && (
            <span
              className={`text-sm font-bold px-3 py-1.5 rounded-full ${
                job.matchScore >= 75
                  ? "bg-green-100 text-green-700"
                  : job.matchScore >= 50
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              {job.matchScore}% Match
            </span>
          )}
        </div>

        {(job.salaryMin || job.salaryMax) && (
          <p className="text-green-700 font-semibold mt-3">
            Rp {job.salaryMin?.toLocaleString("id-ID")}
            {job.salaryMax
              ? ` - ${job.salaryMax?.toLocaleString("id-ID")}`
              : "+"}
            /bulan
          </p>
        )}

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {job.skills.map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Tombol Apply */}
        <div className="mt-5">
          {job.hasApplied ? (
            <div className="bg-green-50 text-green-700 px-4 py-2.5 rounded-lg text-sm font-medium">
              Sudah melamar ke posisi ini
            </div>
          ) : (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold
                         hover:bg-blue-700 transition-colors"
            >
              {showForm ? "Batal" : "Lamar Sekarang"}
            </button>
          )}
        </div>

        {/* Form Apply */}
        {showForm && (
          <form onSubmit={handleApply} className="mt-5 space-y-4 border-t pt-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter (opsional)
              </label>
              <textarea
                rows={4}
                value={form.coverLetter}
                onChange={(e) =>
                  setForm({ ...form, coverLetter: e.target.value })
                }
                placeholder="Ceritakan mengapa kamu tertarik dengan posisi ini..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <input
                  value={form.availability}
                  onChange={(e) =>
                    setForm({ ...form, availability: e.target.value })
                  }
                  placeholder="contoh: 2 minggu lagi"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ekspektasi Gaji (Rp)
                </label>
                <input
                  type="number"
                  value={form.salaryExpected}
                  onChange={(e) =>
                    setForm({ ...form, salaryExpected: e.target.value })
                  }
                  placeholder="8000000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={applying}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold
                         hover:bg-blue-700 disabled:opacity-50"
            >
              {applying ? "Mengirim..." : "Kirim Lamaran"}
            </button>
          </form>
        )}
      </div>

      {/* Deskripsi */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">
          Deskripsi Pekerjaan
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {job.description}
        </p>
      </div>

      {/* Requirements */}
      {job.requirements?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <h2 className="font-semibold text-gray-800 mb-3">Requirements</h2>
          <ul className="space-y-2">
            {job.requirements.map((req, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="text-blue-500 mt-0.5">✓</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Responsibilities */}
      {job.responsibilities?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-3">Tanggung Jawab</h2>
          <ul className="space-y-2">
            {job.responsibilities.map((resp, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-600">
                <span className="text-blue-500 mt-0.5">•</span>
                {resp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
