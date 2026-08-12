// frontend/src/pages/partner/Pipeline.jsx
import { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useParams } from "react-router-dom";

const STAGES = ["PENDING", "REVIEW", "INTERVIEW", "OFFER", "HIRED", "REJECTED"];

const STAGE_LABELS = {
  PENDING: "Menunggu",
  REVIEW: "Direview",
  INTERVIEW: "Interview",
  OFFER: "Penawaran",
  HIRED: "Diterima",
  REJECTED: "Ditolak",
};

const STAGE_COLORS = {
  PENDING: "bg-gray-100 text-gray-700",
  REVIEW: "bg-blue-100 text-blue-700",
  INTERVIEW: "bg-yellow-100 text-yellow-700",
  OFFER: "bg-purple-100 text-purple-700",
  HIRED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function Pipeline() {
  const { jobId } = useParams();
  const [applications, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/applications?jobId=${jobId}`)
      .then((r) => setApps(r.data))
      .finally(() => setLoading(false));
  }, [jobId]);

  const moveCard = async (appId, newStatus) => {
    await axios.patch(`/partner/applications/${appId}`, { status: newStatus });
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)),
    );
  };

  if (loading)
    return <div className="p-6 text-gray-500">Memuat pipeline...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-6">
        Pipeline Rekrutmen
      </h1>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const cards = applications.filter((a) => a.status === stage);
          const stageIndex = STAGES.indexOf(stage);

          return (
            <div key={stage} className="flex-shrink-0 w-56">
              {/* Header kolom */}
              <div
                className={`rounded-t-lg px-3 py-2 font-semibold text-sm ${STAGE_COLORS[stage]}`}
              >
                {STAGE_LABELS[stage]}
                <span className="ml-2 bg-white bg-opacity-60 px-1.5 rounded-full text-xs">
                  {cards.length}
                </span>
              </div>

              {/* Kartu pelamar */}
              <div className="bg-gray-50 rounded-b-lg min-h-40 p-2 space-y-2">
                {cards.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-lg shadow-sm p-3 text-sm"
                  >
                    <p className="font-medium text-gray-800">
                      {app.user?.name}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {app.user?.email}
                    </p>

                    {/* Tombol pindah ke stage berikutnya */}
                    {stageIndex < STAGES.length - 2 && (
                      <button
                        onClick={() => moveCard(app.id, STAGES[stageIndex + 1])}
                        className="mt-2 text-xs text-blue-600 hover:underline"
                      >
                        Pindah ke {STAGE_LABELS[STAGES[stageIndex + 1]]} &rarr;
                      </button>
                    )}

                    {/* Tombol tolak */}
                    {stage !== "HIRED" && stage !== "REJECTED" && (
                      <button
                        onClick={() => moveCard(app.id, "REJECTED")}
                        className="mt-1 text-xs text-red-500 hover:underline block"
                      >
                        Tolak
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
