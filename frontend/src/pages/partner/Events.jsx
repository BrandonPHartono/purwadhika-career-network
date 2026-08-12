// frontend/src/pages/partner/Events.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/axios";

export default function PartnerEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/events");
        setEvents(res.data || []);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Events</h1>
      {events.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p>Belum ada event tersedia</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <Link to={`/events/${ev.id}`} key={ev.id}>
              <div
                className="bg-white rounded-xl border border-gray-200 p-4
                              hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {ev.type}
                    </span>
                    <h3 className="font-semibold text-gray-800 mt-1">
                      {ev.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {new Date(ev.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-500">📍 {ev.location}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ev.status === "OPEN"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
