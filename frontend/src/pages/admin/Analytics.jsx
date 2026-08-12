// frontend/src/pages/admin/Analytics.jsx
import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Analytics</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard
            label="Total Alumni"
            value={stats.totalAlumni}
            color="blue"
          />
          <StatCard
            label="Hiring Partner"
            value={stats.totalPartners}
            color="purple"
          />
          <StatCard
            label="Lowongan Aktif"
            value={stats.totalJobs}
            color="green"
          />
          <StatCard
            label="Total Lamaran"
            value={stats.totalApps}
            color="amber"
          />
          <StatCard
            label="Placement Rate"
            value={`${stats.placementRate}%`}
            color="navy"
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    navy: "bg-gray-800 text-white",
  };
  return (
    <div className={`rounded-xl p-6 ${styles[color]}`}>
      <p className="text-sm opacity-70">{label}</p>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}
