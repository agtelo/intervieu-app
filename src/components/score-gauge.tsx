"use client";

interface ScoreGaugeProps {
  score: number;
  size?: number;
}

export function ScoreGauge({ score, size = 160 }: ScoreGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  const getColor = (score: number) => {
    if (score >= 75) return "#00b894";
    if (score >= 50) return "#fdcb6e";
    return "#e17055";
  };

  const getLabel = (score: number) => {
    if (score >= 80) return "Excelente";
    if (score >= 65) return "Buen fit";
    if (score >= 50) return "Aceptable";
    return "Bajo fit";
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#1e1e24"
          strokeWidth={8}
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="font-mono text-3xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-text-muted text-xs mt-1">{getLabel(score)}</span>
      </div>
    </div>
  );
}
