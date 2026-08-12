// frontend/src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import useAuthStore from "../store/authStore";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ALUMNI",
    companyName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/auth/register", formData);
      setAuth(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Gagal registrasi. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
            <span className="text-white text-xl font-bold">P</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Buat Akun Baru</h1>
          <p className="text-slate-500 mt-1">Purwadhika Career Network</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Nama Lengkap
              </label>
              <input
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama lengkap kamu"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 8 karakter"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Daftar sebagai
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm"
              >
                <option value="ALUMNI">Alumni Purwadhika</option>
                <option value="PARTNER">Hiring Partner</option>
              </select>
            </div>

            {formData.role === "PARTNER" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nama Perusahaan
                </label>
                <input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="PT Nama Perusahaan"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold
                         hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
