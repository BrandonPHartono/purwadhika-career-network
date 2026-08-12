// frontend/src/pages/partner/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { Link } from "react-router-dom";

export default function PartnerDashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/partner/jobs")
      .then((r) => setJobs(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Partner
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola lowongan dan kandidat kamu
          </p>
        </div>
        <Link
          to="/partner/post-job"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Posting Lowongan
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Lowongan" value={jobs.length} color="blue" />
        <StatCard
          label="Lowongan Aktif"
          value={jobs.filter((j) => j.status === "ACTIVE").length}
          color="green"
        />
        <StatCard
          label="Total Pelamar"
          value={jobs.reduce((s, j) => s + (j._count?.applications || 0), 0)}
          color="purple"
        />
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Posisi</th>
              <th className="px-4 py-3 text-left">Level</th>
              <th className="px-4 py-3 text-left">Tipe</th>
              <th className="px-4 py-3 text-center">Pelamar</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {job.title}
                </td>
                <td className="px-4 py-3 text-gray-500">{job.level}</td>
                <td className="px-4 py-3 text-gray-500">{job.workType}</td>
                <td className="px-4 py-3 text-center font-bold text-blue-600">
                  {job._count?.applications || 0}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {job.status === "ACTIVE" ? "Aktif" : "Tutup"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <Link
                    to={`/partner/pipeline/${job.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Lihat Kandidat
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {jobs.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-3xl mb-2">💼</p>
            <p>Belum ada lowongan. Mulai posting sekarang!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <div className={`rounded-xl p-4 ${colors[color]}`}>
      <p className="text-sm opacity-70">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
