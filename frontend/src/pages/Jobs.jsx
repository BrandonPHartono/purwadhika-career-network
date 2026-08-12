// frontend/src/components/JobCard.jsx
import { Link } from "react-router-dom";
import MatchBadge from "./MatchBadge";

export default function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job.id}`}>
      <div
        className="bg-white rounded-xl border border-gray-200 p-5
                      hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
      >
        {/* Header: judul + badge */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-800">{job.title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{job.company?.name}</p>
          </div>
          {/* Tampilkan badge hanya kalau ada score dari backend */}
          {job.score != null && <MatchBadge score={job.score} />}
        </div>

        {/* Info row */}
        <div className="flex gap-3 mt-3 text-xs text-gray-400">
          <span>📍 {job.city || "Tidak disebutkan"}</span>
          <span>⏱ {job.workType}</span>
          <span>🎯 {job.level}</span>
        </div>

        {/* Skills chips */}
        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.skills.slice(0, 5).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {s}
              </span>
            ))}
            {job.skills.length > 5 && (
              <span className="text-xs text-gray-400">
                +{job.skills.length - 5} lagi
              </span>
            )}
          </div>
        )}

        {/* Gaji */}
        {(job.salaryMin || job.salaryMax) && (
          <p className="text-sm font-medium text-green-700 mt-3">
            Rp {job.salaryMin?.toLocaleString("id-ID")}
            {job.salaryMax
              ? ` - ${job.salaryMax?.toLocaleString("id-ID")}`
              : "+"}
            /bulan
          </p>
        )}
      </div>
    </Link>
  );
}
