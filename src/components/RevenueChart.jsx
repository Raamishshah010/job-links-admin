import { MoreHorizontal } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { month: 'Jan', revenue: 122, pipeline: 183 },
  { month: 'Feb', revenue: 199, pipeline: 141 },
  { month: 'Mar', revenue: 128, pipeline: 231 },
  { month: 'Apr', revenue: 180, pipeline: 163 },
  { month: 'May', revenue: 130, pipeline: 206 },
  { month: 'Jun', revenue: 209, pipeline: 122 },
  { month: 'Jul', revenue: 132, pipeline: 200 },
  { month: 'Aug', revenue: 184, pipeline: 126 },
  { month: 'Sep', revenue: 156, pipeline: 138 },
  { month: 'Oct', revenue: 232, pipeline: 202 },
  { month: 'Nov', revenue: 158, pipeline: 208 },
  { month: 'Dec', revenue: 210, pipeline: 121 },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-slate-600">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

function RevenueChart() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">Revenue</h3>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="mb-6 flex items-center gap-5 text-sm text-slate-500">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
          Total Revenue
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
          Total Pipeline
        </span>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -12 }}>
            <CartesianGrid stroke="#eef1f6" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis
              domain={[100, 240]}
              ticks={[100, 120, 140, 160, 180, 200, 220, 240]}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Total Revenue"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="pipeline"
              name="Total Pipeline"
              stroke="#fb923c"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RevenueChart
