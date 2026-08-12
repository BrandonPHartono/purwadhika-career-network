// frontend/src/components/layout/Topbar.jsx
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function Topbar() {
  const user = useAuthStore((s) => s.user);

  return (
    <header
      className="h-14 bg-white border-b border-slate-200 flex items-center
                       justify-between px-6 flex-shrink-0"
    >
      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {/* Notifikasi */}
        <Link
          to="/notifications"
          className="w-8 h-8 flex items-center justify-center rounded-lg
                     hover:bg-slate-100 transition-colors relative"
        >
          <Bell size={16} className="text-slate-500" />
        </Link>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 text-xs font-bold">
            {user?.name
              ?.split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </span>
        </div>
      </div>
    </header>
  );
}
