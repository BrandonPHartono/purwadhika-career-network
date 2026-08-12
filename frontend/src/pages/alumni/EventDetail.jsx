// frontend/src/pages/alumni/EventDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [event, setEvent] = useState(null);
  const [registered, setReg] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [eventRes, regRes] = await Promise.all([
          api.get(`/api/events/${id}`),
          api.get("/api/events/my-registrations"),
        ]);
        setEvent(eventRes.data);
        setReg(regRes.data.some((r) => r.eventId === id));
      } catch {
        toast.error("Event tidak ditemukan");
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleRegister = async () => {
    setLoadingBtn(true);
    try {
      await api.post(`/api/events/${id}/register`);
      setReg(true);
      toast.success("Berhasil mendaftar event!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Gagal mendaftar");
    } finally {
      setLoadingBtn(false);
    }
  };

  const handleUnregister = async () => {
    setLoadingBtn(true);
    try {
      await api.delete(`/api/events/${id}/register`);
      setReg(false);
      toast.success("Pendaftaran dibatalkan");
    } finally {
      setLoadingBtn(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );

  if (!event) return null;

  const full =
    event.maxParticipants &&
    event._count?.registrations >= event.maxParticipants;

  return (
    <div className="p-6 max-w-2xl">
      <button
        onClick={() => navigate("/events")}
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
      >
        ← Kembali ke Events
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
            {event.type}
          </span>
          {user && (
            <button
              disabled={loadingBtn || (full && !registered)}
              onClick={registered ? handleUnregister : handleRegister}
              className={`px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 ${
                registered
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : full
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {loadingBtn
                ? "..."
                : registered
                  ? "Batalkan"
                  : full
                    ? "Penuh"
                    : "Daftar"}
            </button>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h1>

        <div className="space-y-2 mb-4 text-sm text-gray-500">
          <p>
            📅{" "}
            {new Date(event.date).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            WIB
          </p>
          <p>📍 {event.location}</p>
          {event.maxParticipants && (
            <p>
              👥 {event._count?.registrations || 0} / {event.maxParticipants}{" "}
              peserta
            </p>
          )}
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">
          {event.description}
        </p>

        {event.meetLink && (
          <div className="mt-4">
            <a
              href={event.meetLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white
                         px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
            >
              Buka Link Meeting
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
