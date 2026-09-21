import { ArrowUp, ArrowDown } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

function SparkStatCard({ label, value, trend, trendDirection = 'up', color, data }) {
  const isUp = trendDirection === 'up'
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-800">{value}</span>
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold ${
              isUp ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {trend}
          </span>
        </div>
      </div>
      <div className="h-12 w-24 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SparkStatCard
