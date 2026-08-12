// frontend/src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
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

  if (loading) return <div className="p-6 text-gray-500">Memuat data...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">
        Overview platform Purwadhika Career Network
      </p>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            label="Alumni Terdaftar"
            value={stats.totalAlumni}
            icon="A"
            color="blue"
          />
          <StatCard
            label="Hiring Partner"
            value={stats.totalPartners}
            icon="P"
            color="purple"
          />
          <StatCard
            label="Lowongan Aktif"
            value={stats.totalJobs}
            icon="J"
            color="green"
          />
          <StatCard
            label="Total Lamaran"
            value={stats.totalApps}
            icon="L"
            color="amber"
          />
          <StatCard
            label="Placement Rate"
            value={`${stats.placementRate}%`}
            icon="%"
            color="navy"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <QuickMenu
          to="/admin/alumni"
          icon="A"
          label="Kelola Alumni"
          desc="Lihat profil dan status alumni"
        />
        <QuickMenu
          to="/admin/partners"
          icon="P"
          label="Kelola Partner"
          desc="Approve dan monitor Hiring Partner"
        />
        <QuickMenu
          to="/admin/broadcast"
          icon="B"
          label="Broadcast"
          desc="Kirim notifikasi ke semua alumni"
        />
        <QuickMenu
          to="/admin/events"
          icon="E"
          label="Kelola Events"
          desc="Buat dan kelola workshop / webinar"
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-purple-50 text-purple-700",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    navy: "bg-gray-800 text-white",
  };
  return (
    <div className={`rounded-xl p-4 ${styles[color] || "bg-gray-50"}`}>
      <div
        className="w-8 h-8 rounded-lg bg-white bg-opacity-30 flex items-center
                      justify-center font-bold text-sm mb-2"
      >
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs mt-0.5 opacity-70">{label}</div>
    </div>
  );
}

function QuickMenu({ to, icon, label, desc }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 p-4 bg-white border border-gray-200
      rounded-xl hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div
        className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center
                      justify-center font-bold text-lg flex-shrink-0"
      >
        {icon}
      </div>
      <div>
        <p className="font-semibold text-gray-800 text-sm">{label}</p>
        <p className="text-gray-500 text-xs">{desc}</p>
      </div>
    </Link>
  );
}
