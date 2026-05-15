import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

export function ScoreRing({ score }) {
  const data = [{ name: "ATS Score", value: score, fill: "#32bfff" }];

  return (
    <div className="panel p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
        ATS match score
      </p>
      <div className="relative mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            innerRadius="70%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background dataKey="value" cornerRadius={20} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-5xl font-semibold">{Math.round(score)}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">out of 100</p>
        </div>
      </div>
    </div>
  );
}
