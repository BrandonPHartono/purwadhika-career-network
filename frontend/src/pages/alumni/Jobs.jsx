// frontend/src/pages/alumni/Jobs.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";

const LEVELS = ["junior", "mid", "senior"];
const WORKTYPES = ["remote", "hybrid", "onsite"];

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    level: "",
    workType: "",
    city: "",
  });

  const fetchJobs = async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v)),
      ).toString();
      const res = await api.get(`/api/jobs${query ? "?" + query : ""}`);
      setJobs(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadJobs = async () => {
      await fetchJobs();
    };
    loadJobs();
  }, []);

  const handleFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchJobs(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(filters);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Lowongan Kerja</h1>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3 mb-3">
          <input
            value={filters.search}
            onChange={(e) => handleFilter("search", e.target.value)}
            placeholder="Cari judul atau deskripsi..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium
                       hover:bg-blue-700"
          >
            Cari
          </button>
        </form>

        <div className="flex gap-3 flex-wrap">
          <select
            value={filters.level}
            onChange={(e) => handleFilter("level", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="">Semua Level</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filters.workType}
            onChange={(e) => handleFilter("workType", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="">Semua Tipe</option>
            {WORKTYPES.map((w) => (
              <option key={w} value={w}>
                {w.charAt(0).toUpperCase() + w.slice(1)}
              </option>
            ))}
          </select>

          <input
            value={filters.city}
            onChange={(e) => handleFilter("city", e.target.value)}
            placeholder="Filter kota..."
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-36"
          />

          {(filters.search ||
            filters.level ||
            filters.workType ||
            filters.city) && (
            <button
              onClick={() => {
                setFilters({ search: "", level: "", workType: "", city: "" });
                fetchJobs();
              }}
              className="text-sm text-red-500 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Job List */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p>Tidak ada lowongan yang sesuai filter</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Link to={`/jobs/${job.id}`} key={job.id}>
              <div
                className="bg-white rounded-xl border border-gray-200 p-5
                              hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{job.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {job.company?.name}
                    </p>
                  </div>
                  {job.matchScore != null && (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
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

                <div className="flex gap-3 mt-3 text-xs text-gray-400">
                  <span>📍 {job.city || "Tidak disebutkan"}</span>
                  <span>⏱ {job.workType}</span>
                  <span>🎯 {job.level}</span>
                </div>

                {job.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.skills.slice(0, 5).map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        {s}
                      </span>
                    ))}
                    {job.skills.length > 5 && (
                      <span className="text-xs text-gray-400">
                        +{job.skills.length - 5} lagi
                      </span>
                    )}
                  </div>
                )}

                {(job.salaryMin || job.salaryMax) && (
                  <p className="text-sm font-medium text-green-700 mt-3">
                    Rp {job.salaryMin?.toLocaleString("id-ID")}
                    {job.salaryMax
                      ? ` - ${job.salaryMax?.toLocaleString("id-ID")}`
                      : "+"}
                    /bulan
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {jobs.length > 0 && (
        <p className="text-center text-sm text-gray-400 mt-6">
          Menampilkan {jobs.length} lowongan
        </p>
      )}
    </div>
  );
}
