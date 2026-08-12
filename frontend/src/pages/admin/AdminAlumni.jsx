// frontend/src/pages/admin/AdminAlumni.jsx
import { useEffect, useState } from "react";
import axios from "../../utils/axios";

export default function AdminAlumni() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("/admin/users?role=ALUMNI").then((r) => setUsers(r.data));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleActive = async (id, current) => {
    await axios.patch(`/admin/users/${id}`, { isActive: !current });
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: !current } : u)),
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-800">
          Kelola Alumni ({users.length})
        </h1>
        <input
          placeholder="Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Batch</th>
              <th className="px-4 py-3 text-center">Profil %</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3 text-gray-500">
                  {u.profile?.batch ?? "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-bold text-blue-600">
                    {u.profile?.profileCompletion ?? 0}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {u.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleActive(u.id, u.isActive)}
                    className="text-xs text-gray-500 hover:text-red-600 underline"
                  >
                    {u.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            Tidak ada alumni yang ditemukan
          </div>
        )}
      </div>
    </div>
  );
}
