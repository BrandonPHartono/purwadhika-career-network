// frontend/src/pages/admin/Agreements.jsx
import { useEffect, useState } from "react";
import api from "../../utils/axios";

export default function AgreementsPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/admin/users?role=PARTNER");
        setPartners(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pending = partners.filter((p) => p.company?.status === "PENDING");
  const active = partners.filter((p) => p.company?.status === "ACTIVE");

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Perjanjian Partner ({partners.length})
      </h1>

      {pending.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-gray-700 mb-3">
            Menunggu Persetujuan ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-yellow-200 p-4 flex
                           justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{p.company?.name}</p>
                  <p className="text-sm text-gray-500">{p.email}</p>
                </div>
                <span
                  className="px-2 py-1 bg-yellow-100 text-yellow-700
                                 rounded-full text-xs font-medium"
                >
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {active.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-700 mb-3">
            Partner Aktif ({active.length})
          </h2>
          <div className="space-y-3">
            {active.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex
                           justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{p.company?.name}</p>
                  <p className="text-sm text-gray-500">{p.email}</p>
                </div>
                <span
                  className="px-2 py-1 bg-green-100 text-green-700
                                 rounded-full text-xs font-medium"
                >
                  Aktif
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
