// frontend/src/pages/alumni/Applications.jsx
import { useEffect, useState } from "react";
import api from "../../utils/axios";

const STATUS_CONFIG = {
  APPLIED: { label: "Dilamar", bg: "bg-blue-100", text: "text-blue-700" },
  REVIEWED: { label: "Direview", bg: "bg-yellow-100", text: "text-yellow-700" },
  INTERVIEW: {
    label: "Interview",
    bg: "bg-purple-100",
    text: "text-purple-700",
  },
  OFFERED: { label: "Penawaran", bg: "bg-green-100", text: "text-green-700" },
  HIRED: { label: "Diterima", bg: "bg-green-100", text: "text-green-700" },
  REJECTED: { label: "Ditolak", bg: "bg-red-100", text: "text-red-600" },
};

export default function ApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/applications/my");
        setApps(res.data.data || []);
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
        Lamaran Saya ({apps.length})
      </h1>

      {apps.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p>Belum ada lamaran. Mulai lamar lowongan sekarang!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => {
            const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.APPLIED;
            return (
              <div
                key={app.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {app.job?.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {app.job?.company?.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Dilamar:{" "}
                      {new Date(app.appliedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${status.bg} ${status.text}`}
                  >
                    {status.label}
                  </span>
                </div>

                {/* Progress bar status */}
                <div className="mt-4">
                  <div className="flex justify-between mb-1.5">
                    {Object.entries(STATUS_CONFIG)
                      .filter(([k]) => k !== "REJECTED")
                      .map(([key, val]) => (
                        <span
                          key={key}
                          className={`text-xs font-medium ${
                            app.status === key ? val.text : "text-gray-300"
                          }`}
                        >
                          {val.label}
                        </span>
                      ))}
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        app.status === "REJECTED" ? "bg-red-400" : "bg-blue-500"
                      }`}
                      style={{
                        width:
                          app.status === "REJECTED"
                            ? "100%"
                            : `${
                                ([
                                  "APPLIED",
                                  "REVIEWED",
                                  "INTERVIEW",
                                  "OFFERED",
                                  "HIRED",
                                ].indexOf(app.status) +
                                  1) *
                                20
                              }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Info interview kalau ada */}
                {app.interview && (
                  <div className="mt-3 bg-purple-50 rounded-lg p-3 text-sm">
                    <p className="font-medium text-purple-700">
                      Interview Dijadwalkan
                    </p>
                    <p className="text-purple-600 text-xs mt-0.5">
                      {new Date(app.interview.scheduledAt).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}{" "}
                      WIB
                    </p>
                    {app.interview.meetLink && (
                      <a
                        href={app.interview.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-600 underline text-xs mt-1 inline-block"
                      >
                        Buka Google Meet
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
