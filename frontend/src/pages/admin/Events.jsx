// frontend/src/pages/admin/Events.jsx
import { useEffect, useState } from "react";
import api from "../../utils/axios";
import toast from "react-hot-toast";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "WORKSHOP",
    date: "",
    location: "",
    maxParticipants: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/events", form);
      setEvents((prev) => [res.data, ...prev]);
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        type: "WORKSHOP",
        date: "",
        location: "",
        maxParticipants: "",
      });
      toast.success("Event berhasil dibuat!");
    } catch (err) {
      toast.error("Gagal membuat event");
      console.error(err);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Events</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          {showForm ? "Batal" : "+ Buat Event"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Judul *
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipe
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="WORKSHOP">Workshop</option>
                <option value="WEBINAR">Webinar</option>
                <option value="NETWORKING">Networking</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi *
            </label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal *
              </label>
              <input
                required
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi
              </label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Online / Jakarta"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Peserta
              </label>
              <input
                type="number"
                value={form.maxParticipants}
                onChange={(e) =>
                  setForm({ ...form, maxParticipants: e.target.value })
                }
                placeholder="50"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
          >
            Buat Event
          </button>
        </form>
      )}

      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📅</p>
            <p>Belum ada event</p>
          </div>
        ) : (
          events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center"
            >
              <div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  {ev.type}
                </span>
                <h3 className="font-semibold text-gray-800 mt-1">{ev.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(ev.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {ev._count?.registrations || 0} peserta terdaftar
                  {ev.maxParticipants && ` / ${ev.maxParticipants}`}
                </p>
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
          ))
        )}
      </div>
    </div>
  );
}
