// frontend/src/components/MatchBadge.jsx
export default function MatchBadge({ score }) {
  const config =
    score >= 75
      ? {
          bg: "bg-green-100",
          text: "text-green-700",
          ring: "ring-green-200",
          label: "Sangat Cocok",
        }
      : score >= 50
        ? {
            bg: "bg-blue-100",
            text: "text-blue-700",
            ring: "ring-blue-200",
            label: "Cocok",
          }
        : score >= 30
          ? {
              bg: "bg-amber-100",
              text: "text-amber-700",
              ring: "ring-amber-200",
              label: "Cukup Cocok",
            }
          : {
              bg: "bg-gray-100",
              text: "text-gray-500",
              ring: "ring-gray-200",
              label: "Kurang Cocok",
            };

  return (
    <div
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full
      ring-1 ${config.bg} ${config.text} ${config.ring}`}
    >
      {/* Bar indikator mini */}
      <div className="flex gap-0.5 items-end h-3">
        {[25, 50, 75].map((threshold) => (
          <div
            key={threshold}
            className={`w-1 rounded-sm ${
              score >= threshold
                ? config.bg.replace("100", "500")
                : "bg-gray-200"
            }`}
            style={{ height: `${(threshold / 75) * 10 + 4}px` }}
          />
        ))}
      </div>

      <span className="text-xs font-bold">{score}%</span>
      <span className="text-xs hidden sm:inline">{config.label}</span>
    </div>
  );
}
