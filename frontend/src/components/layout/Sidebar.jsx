// frontend/src/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  Send,
  Calendar,
  CalendarDays,
  Bell,
  User,
  Building,
  Users,
  Columns,
  MessageSquare,
  Megaphone,
  BarChart3,
  FileText,
  Network,
  LogOut,
} from "lucide-react";
import useAuthStore from "../../store/authStore";

const MENUS = {
  ALUMNI: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Sparkles, label: "Lowongan", path: "/jobs", badge: 12 },
    { icon: Send, label: "Lamaran Saya", path: "/applications" },
    { icon: Calendar, label: "Interview", path: "/interviews", badge: 1 },
    { icon: CalendarDays, label: "Events", path: "/events", badge: 3 },
    { icon: Bell, label: "Notifikasi", path: "/notifications", badge: 3 },
    { icon: User, label: "Profil Saya", path: "/profile" },
  ],
  PARTNER: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/partner/dashboard" },
    { icon: Sparkles, label: "Post Lowongan", path: "/partner/post-job" },
    {
      icon: Users,
      label: "Kandidat Cocok",
      path: "/partner/candidates",
      badge: 23,
    },
    { icon: Columns, label: "Pipeline", path: "/partner/pipeline" },
    {
      icon: Calendar,
      label: "Jadwal Interview",
      path: "/partner/schedule",
      badge: 2,
    },
    { icon: CalendarDays, label: "Events", path: "/partner/events" },
    {
      icon: MessageSquare,
      label: "Pesan",
      path: "/partner/messages",
      badge: 4,
    },
  ],
  ADMIN: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Alumni", path: "/admin/alumni", badge: 483 },
    { icon: Building, label: "Hiring Partner", path: "/admin/partners" },
    { icon: CalendarDays, label: "Events", path: "/admin/events" },
    { icon: Megaphone, label: "Broadcast", path: "/admin/broadcast" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    {
      icon: FileText,
      label: "Perjanjian",
      path: "/admin/agreements",
      badge: 3,
    },
  ],
};

const ACTIVE_COLORS = {
  ALUMNI: "bg-blue-50 text-blue-600",
  PARTNER: "bg-green-50 text-green-700",
  ADMIN: "bg-amber-50 text-amber-700",
};

const CHIP_COLORS = {
  ALUMNI: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-600" },
  PARTNER: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-700" },
  ADMIN: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-700" },
};

export default function Sidebar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const menuItems = MENUS[user?.role] || [];
  const activeColor = ACTIVE_COLORS[user?.role] || "";
  const chip = CHIP_COLORS[user?.role] || CHIP_COLORS.ALUMNI;

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
      {/* LOGO */}
      <div className="px-4 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Network size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 text-sm">
            Purwadhika CN
          </span>
        </div>
        <p className="text-xs text-slate-400 ml-10">Career Network</p>
      </div>

      {/* ROLE CHIP */}
      <div
        className={`mx-3 my-2 px-3 py-1.5 rounded-md ${chip.bg} flex items-center gap-2`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${chip.dot}`} />
        <span className={`text-xs font-semibold ${chip.text}`}>
          {user?.role} View
        </span>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
          Menu
        </p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium mb-0.5 transition-colors ${
                isActive
                  ? activeColor
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <item.icon size={16} className="flex-shrink-0" />
            <span className="flex-1">{item.label}</span>
            {/* Badge notifikasi */}
            {item.badge && (
              <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* USER CARD + LOGOUT */}
      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 text-xs font-bold">
              {user?.name
                ?.split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-slate-400">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-500
                     hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut size={13} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
