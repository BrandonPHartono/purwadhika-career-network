// frontend/src/pages/partner/Candidates.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/axios";

export default function CandidatesPage() {
  const { jobId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [candidatesRes, jobRes] = await Promise.all([
          api.get(`/api/partner/jobs/${jobId}/candidates`),
          api.get(`/api/jobs/${jobId}`),
        ]);
        setCandidates(candidatesRes.data || []);
        setJob(jobRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kandidat Cocok</h1>
        {job && (
          <p className="text-gray-500 text-sm mt-1">
            untuk posisi <span className="font-medium">{job.title}</span>
          </p>
        )}
      </div>

      {candidates.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">👥</p>
          <p>Belum ada kandidat yang cocok</p>
          <p className="text-sm mt-1">
            Coba lengkapi skills yang dibutuhkan di lowongan
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full bg-blue-100 flex items-center
                                  justify-center flex-shrink-0"
                  >
                    <span className="text-blue-600 font-bold">
                      {candidate.name
                        ?.split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {candidate.name}
                    </h3>
                    <p className="text-sm text-gray-500">{candidate.email}</p>
                    {candidate.profile?.currentTitle && (
                      <p className="text-sm text-gray-500">
                        {candidate.profile.currentTitle}
                        {candidate.profile.currentCompany &&
                          ` @ ${candidate.profile.currentCompany}`}
                      </p>
                    )}
                  </div>
                </div>

                {/* Match score */}
                <div className="text-right">
                  <span
                    className={`text-lg font-bold ${
                      candidate.score >= 75
                        ? "text-green-600"
                        : candidate.score >= 50
                          ? "text-blue-600"
                          : "text-gray-500"
                    }`}
                  >
                    {candidate.score}%
                  </span>
                  <p className="text-xs text-gray-400">Match</p>
                </div>
              </div>

              {/* Skills */}
              {candidate.profile?.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {candidate.profile.skills.slice(0, 6).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {/* Info row */}
              <div className="flex gap-4 mt-3 text-xs text-gray-400">
                {candidate.profile?.location && (
                  <span>📍 {candidate.profile.location}</span>
                )}
                {candidate.profile?.workType && (
                  <span>⏱ {candidate.profile.workType}</span>
                )}
                {candidate.profile?.yearsExp && (
                  <span>💼 {candidate.profile.yearsExp} tahun exp</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
