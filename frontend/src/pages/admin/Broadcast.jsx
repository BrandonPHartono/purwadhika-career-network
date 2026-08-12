// frontend/src/pages/admin/Broadcast.jsx
import { useState } from "react";
import api from "../../utils/axios";
import toast from "react-hot-toast";

const SEGMENTS = [
  { id: "all", label: "Semua Alumni" },
  { id: "open_to_work", label: "Open to Work" },
  { id: "batch_2024", label: "Batch 2024" },
  { id: "batch_2023", label: "Batch 2023" },
  { id: "frontend", label: "Frontend Dev" },
  { id: "fullstack", label: "Fullstack Dev" },
  { id: "backend", label: "Backend Dev" },
];

export default function BroadcastPage() {
  const [form, setForm] = useState({
    title: "",
    message: "",
    segments: ["all"],
    channels: ["email", "in_app"],
  });
  const [loading, setLoading] = useState(false);

  const toggleSegment = (id) => {
    setForm((prev) => ({
      ...prev,
      segments: prev.segments.includes(id)
        ? prev.segments.filter((s) => s !== id)
        : [...prev.segments.filter((s) => s !== "all"), id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) {
      toast.error("Judul dan pesan wajib diisi");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/broadcast", form);
      toast.success(`Broadcast dikirim ke ${res.data.emailSent || 0} alumni!`);
      setForm({
        title: "",
        message: "",
        segments: ["all"],
        channels: ["email", "in_app"],
      });
    } catch (err) {
      toast.error("Gagal kirim broadcast");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Broadcast Notifikasi
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Judul *
          </label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="contoh: Lowongan Baru dari Tokopedia!"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pesan *
          </label>
          <textarea
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Tulis pesan broadcast di sini..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Penerima
          </label>
          <div className="flex flex-wrap gap-2">
            {SEGMENTS.map((seg) => (
              <button
                type="button"
                key={seg.id}
                onClick={() => toggleSegment(seg.id)}
                className={`px-3 py-1 rounded-full text-sm border font-medium transition-colors ${
                  form.segments.includes(seg.id)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Channel
          </label>
          <div className="flex gap-4">
            {[
              { id: "email", label: "Email" },
              { id: "in_app", label: "In-App Notification" },
            ].map((ch) => (
              <label
                key={ch.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.channels.includes(ch.id)}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      channels: prev.channels.includes(ch.id)
                        ? prev.channels.filter((c) => c !== ch.id)
                        : [...prev.channels, ch.id],
                    }))
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700">{ch.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium
                     hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Kirim Broadcast"}
        </button>
      </form>
    </div>
  );
}
