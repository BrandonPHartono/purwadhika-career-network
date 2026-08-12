// frontend/src/pages/alumni/Events.jsx
import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import useAuthStore from "../../store/authStore";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return (
    d.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    " • " +
    d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) +
    " WIB"
  );
}

const EVENT_ICONS = {
  WORKSHOP: "W",
  WEBINAR: "V",
  NETWORKING: "N",
};

export default function Events() {
  const user = useAuthStore((s) => s.user);
  const [events, setEvents] = useState([]);
  const [myRegs, setMyRegs] = useState(new Set());
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    axios.get("/events").then((r) => setEvents(r.data));

    if (user) {
      axios.get("/events/my-registrations").then((r) => {
        setMyRegs(new Set(r.data.map((reg) => reg.eventId)));
      });
    }
  }, [user]);

  const register = async (eventId) => {
    setLoadingId(eventId);
    try {
      await axios.post(`/events/${eventId}/register`);
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
      await axios.delete(`/events/${eventId}/register`);
      setMyRegs((prev) => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Events &amp; Workshop
      </h1>

      {events.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">[ ]</div>
          <p>Belum ada event yang akan datang</p>
        </div>
      )}

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
              {/* Ikon tipe event */}
              <div
                className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center
                              justify-center font-bold text-lg flex-shrink-0"
              >
                {EVENT_ICONS[ev.type] || "E"}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {ev.type}
                    </span>
                    <h3 className="text-base font-bold text-gray-800 mt-1">
                      {ev.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {formatDate(ev.date)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Lokasi: {ev.location}
                    </p>
                  </div>

                  {/* Tombol daftar/batal */}
                  {user && (
                    <button
                      disabled={isLoading || (full && !registered)}
                      onClick={() =>
                        registered ? unregister(ev.id) : register(ev.id)
                      }
                      className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 ${
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
