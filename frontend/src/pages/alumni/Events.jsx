// frontend/src/pages/alumni/Events.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import useAuthStore from "../../store/authStore";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }) +
    " • " +
    d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) +
    " WIB"
  );
}

export default function EventsPage() {
  const user = useAuthStore((s) => s.user);
  const [events, setEvents] = useState([]);
  const [myRegs, setMyRegs] = useState(new Set());
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [evRes, regRes] = await Promise.all([
          api.get("/api/events"),
          user
            ? api.get("/api/events/my-registrations")
            : Promise.resolve({ data: [] }),
        ]);
        setEvents(evRes.data || []);
        setMyRegs(new Set((regRes.data || []).map((r) => r.eventId)));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const register = async (eventId) => {
    setLoadingId(eventId);
    try {
      await api.post(`/api/events/${eventId}/register`);
      setMyRegs((prev) => new Set([...prev, eventId]));
    } catch (err) {
      alert(err.response?.data?.error || "Gagal mendaftar");
    } finally {
      setLoadingId(null);
    }
  };

  const unregister = async (eventId) => {
    setLoadingId(eventId);
    try {
      await api.delete(`/api/events/${eventId}/register`);
      setMyRegs((prev) => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });
    } finally {
      setLoadingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Events &amp; Workshop
      </h1>

      {events.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p>Belum ada event yang akan datang</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((ev) => {
            const registered = myRegs.has(ev.id);
            const full =
              ev.maxParticipants &&
              ev._count?.registrations >= ev.maxParticipants;
            const isLoading = loadingId === ev.id;

            return (
              <div
                key={ev.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4"
              >
                <div
                  className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex
                                items-center justify-center font-bold text-lg flex-shrink-0"
                >
                  {ev.type === "WORKSHOP"
                    ? "W"
                    : ev.type === "WEBINAR"
                      ? "V"
                      : "N"}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className="text-xs font-medium bg-blue-100 text-blue-700
                                       px-2 py-0.5 rounded-full"
                      >
                        {ev.type}
                      </span>
                      <h3 className="text-base font-bold text-gray-800 mt-1">
                        {ev.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {formatDate(ev.date)}
                      </p>
                      <p className="text-sm text-gray-500">📍 {ev.location}</p>
                    </div>

                    {user && (
                      <button
                        disabled={isLoading || (full && !registered)}
                        onClick={() =>
                          registered ? unregister(ev.id) : register(ev.id)
                        }
                        className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium
                          disabled:opacity-50 ${
                            registered
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : full
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                      >
                        {isLoading
                          ? "..."
                          : registered
                            ? "Batalkan"
                            : full
                              ? "Penuh"
                              : "Daftar"}
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {ev.description}
                  </p>

                  <Link
                    to={`/events/${ev.id}`}
                    className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Lihat Detail →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
