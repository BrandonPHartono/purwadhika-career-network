// frontend/src/pages/alumni/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import useAuthStore from "../../store/authStore";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [jobs, setJobs] = useState([]);
  const [applications, setApps] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/jobs"),
      api.get("/api/applications/my"),
      api.get("/api/alumni/profile"),
    ])
      .then(([jobsRes, appsRes, profileRes]) => {
        setJobs(jobsRes.data.data || []);
        setApps(appsRes.data.data || []);
        setProfile(profileRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );

  const score = profile?.profileCompletion || 0;
  const barColor =
    score >= 80 ? "bg-green-500" : score >= 50 ? "bg-blue-500" : "bg-amber-400";

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Halo, {user?.name?.split(" ")[0]}! 👋
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Selamat datang di Purwadhika Career Network
      </p>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Lowongan Tersedia" value={jobs.length} color="blue" />
        <StatCard
          label="Lamaran Aktif"
          value={applications.length}
          color="green"
        />
        <StatCard
          label="Interview"
          value={applications.filter((a) => a.status === "INTERVIEW").length}
          color="purple"
        />
      </div>

      {/* Profile Completion */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700">
            Kelengkapan Profil
          </span>
          <span className="font-bold text-gray-800">{score}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${score}%` }}
          />
        </div>
        {score < 80 ? (
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Lengkapi profil untuk meningkatkan peluang ditemukan recruiter
            </p>
            <Link
              to="/profile"
              className="text-xs text-blue-600 font-medium hover:underline ml-4 flex-shrink-0"
            >
              Lengkapi Sekarang →
            </Link>
          </div>
        ) : (
          <p className="text-xs text-green-600 font-medium">
            Profil sudah Job Ready! Recruiter bisa menemukan kamu.
          </p>
        )}
      </div>

      {/* Rekomendasi Lowongan */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-gray-800">Lowongan Rekomendasi</h2>
          <Link to="/jobs" className="text-sm text-blue-600 hover:underline">
            Lihat Semua →
          </Link>
        </div>

        {jobs.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            Belum ada lowongan tersedia
          </p>
        ) : (
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <Link to={`/jobs/${job.id}`} key={job.id}>
                <div
                  className="flex justify-between items-center p-3 rounded-lg
                                hover:bg-gray-50 border border-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {job.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {job.company?.name} • {job.city || "Remote"} •{" "}
                      {job.workType}
                    </p>
                  </div>
                  {job.matchScore != null && (
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        job.matchScore >= 75
                          ? "bg-green-100 text-green-700"
                          : job.matchScore >= 50
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {job.matchScore}%
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <div className={`rounded-xl p-4 ${styles[color]}`}>
      <p className="text-sm opacity-70">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
