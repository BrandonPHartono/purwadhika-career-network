// frontend/src/pages/partner/Schedule.jsx
import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function SchedulePage() {
  const [applications, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/applications/my");
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
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{app.job?.title}</h3>
                  <p className="text-sm text-gray-500">{app.user?.name}</p>
                </div>
                <span
                  className="px-2 py-1 bg-blue-100 text-blue-700
                                 rounded-full text-xs font-medium"
                >
                  {app.interview.status}
                </span>
              </div>
              <div className="mt-3 bg-blue-50 rounded-lg p-3 text-sm">
                <p className="text-blue-700">
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
                    className="text-blue-600 underline text-xs mt-1 inline-block"
                  >
                    Buka Google Meet
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
