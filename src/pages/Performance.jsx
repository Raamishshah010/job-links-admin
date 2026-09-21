import { Activity, Target, TrendingUp, Users } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import ProgressBar from '../components/ProgressBar'
import { performanceSeries } from '../data/crmData'

function Performance() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Insights"
        title="Performance Insights"
        description="Monitor pipeline quality, team output, conversion trends, and customer risk in one executive-ready view."
      >
        <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none">
          <option>Last 6 months</option>
          <option>Quarter to date</option>
          <option>Year to date</option>
        </select>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile icon={TrendingUp} label="Pipeline Growth" value="+32%" detail="$184K created in June" tone="emerald" />
        <MetricTile icon={Target} label="Win Rate" value="41%" detail="Up 6 points vs last quarter" tone="indigo" />
        <MetricTile icon={Users} label="Active Sellers" value="18" detail="14 above activity goal" tone="orange" />
        <MetricTile icon={Activity} label="Churn Risk" value="8%" detail="Lowest in 6 months" tone="rose" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Revenue Motion" description="Pipeline created, won revenue, and churn risk">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceSeries} margin={{ left: -18, right: 8 }}>
                <CartesianGrid stroke="#eef1f6" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="pipeline" stroke="#6366f1" fill="#c7d2fe" name="Pipeline" />
                <Area type="monotone" dataKey="won" stroke="#f97316" fill="#fed7aa" name="Won" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Team Scorecard" description="Goal progress by motion">
          <div className="space-y-5">
            {[
              ['Lead response SLA', 94, 'bg-emerald-500'],
              ['Discovery conversion', 76, 'bg-indigo-500'],
              ['Proposal acceptance', 58, 'bg-orange-500'],
              ['Renewal coverage', 83, 'bg-sky-500'],
            ].map(([label, value, color]) => (
              <div key={label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{label}</span>
                  <span className="text-slate-500">{value}%</span>
                </div>
                <ProgressBar value={value} color={color} />
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Conversion by Source" className="mt-6">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { source: 'Website', value: 42 },
              { source: 'LinkedIn', value: 34 },
              { source: 'Referral', value: 29 },
              { source: 'Instagram', value: 18 },
              { source: 'X', value: 14 },
            ]}>
              <CartesianGrid stroke="#eef1f6" vertical={false} />
              <XAxis dataKey="source" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </main>
  )
}

export default Performance
