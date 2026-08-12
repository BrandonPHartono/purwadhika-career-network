// frontend/src/pages/alumni/Notifications.jsx
import { useEffect, useState } from "react";
import api from "../../utils/axios";

const TYPE_ICONS = {
  application: "📋",
  status_update: "🔔",
  interview: "📅",
  broadcast: "📢",
  job_match: "✨",
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/users/notifications");
        setNotifs(res.data.data || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const markAllRead = async () => {
    try {
      await api.patch("/api/users/notifications/read-all");
      setNotifs((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );

  const unreadCount = notifs.filter((n) => !n.isRead).length;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifikasi</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              {unreadCount} belum dibaca
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-blue-600 hover:underline"
          >
            Tandai semua dibaca
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔔</p>
          <p>Belum ada notifikasi</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map((notif) => (
            <div
              key={notif.id}
              className={`rounded-xl border p-4 transition-colors ${
                notif.isRead
                  ? "bg-white border-gray-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">
                  {TYPE_ICONS[notif.type] || "🔔"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">
                    {notif.title}
                  </p>
                  <p className="text-gray-600 text-sm mt-0.5">{notif.body}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(notif.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {!notif.isRead && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
