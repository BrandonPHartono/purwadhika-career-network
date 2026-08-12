// frontend/src/pages/alumni/Interview.jsx
import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function InterviewPage() {
  const [applications, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/applications/my");
        // Filter hanya yang punya interview
        const withInterview = (res.data.data || []).filter((a) => a.interview);
        setApps(withInterview);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Jadwal Interview
      </h1>

      {applications.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p>Belum ada jadwal interview</p>
          <p className="text-sm mt-1">
            Interview akan muncul di sini setelah dijadwalkan
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              {/* Info posisi */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-800">{app.job?.title}</h3>
                  <p className="text-sm text-gray-500">
                    {app.job?.company?.name}
                  </p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    app.interview.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : app.interview.status === "CANCELLED"
                        ? "bg-red-100 text-red-600"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {app.interview.status === "CONFIRMED"
                    ? "Dikonfirmasi"
                    : app.interview.status === "CANCELLED"
                      ? "Dibatalkan"
                      : "Dijadwalkan"}
                </span>
              </div>

              {/* Waktu interview */}
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-800 mb-1">
                  Waktu Interview
                </p>
                <p className="text-blue-700 text-sm">
                  {new Date(app.interview.scheduledAt).toLocaleDateString(
                    "id-ID",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
                <p className="text-blue-700 text-sm">
                  {new Date(app.interview.scheduledAt).toLocaleTimeString(
                    "id-ID",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}{" "}
                  WIB
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  Durasi: {app.interview.durationMinutes} menit
                </p>
              </div>

              {/* Meet link */}
              {app.interview.meetLink && (
                <div className="mt-3">
                  <a
                    href={app.interview.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 text-white
                               px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                  >
                    Buka Google Meet
                  </a>
                </div>
              )}

              {/* Notes */}
              {app.interview.notes && (
                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Catatan:
                  </p>
                  <p className="text-sm text-gray-700">{app.interview.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
