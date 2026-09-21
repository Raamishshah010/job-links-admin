import { AlertCircle, CheckCircle2, MessageSquare, Plus, Smile } from 'lucide-react'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { feedback } from '../data/crmData'

function Feedback() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Voice of customer"
        title="Feedback"
        description="Capture product requests, support themes, sentiment, and customer-impact follow-through."
      >
        <button className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus size={15} /> Log Feedback
        </button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <MetricTile icon={Smile} label="NPS" value="54" detail="Up 7 points" tone="emerald" />
        <MetricTile icon={MessageSquare} label="New Items" value="31" detail="This week" tone="indigo" />
        <MetricTile icon={AlertCircle} label="Escalated" value="4" detail="Needs owner response" tone="rose" />
        <MetricTile icon={CheckCircle2} label="Closed Loop" value="78%" detail="Within 7 days" tone="orange" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Feedback Board" description="Themes connected to customers">
          <div className="space-y-3">
            {feedback.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.theme}</p>
                    <p className="text-xs text-slate-500">{item.id} - {item.customer}</p>
                  </div>
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold ${
                    item.sentiment === 'Positive'
                      ? 'bg-emerald-50 text-emerald-600'
                      : item.sentiment === 'Negative'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.sentiment}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                    {item.status}
                  </span>
                  <button className="text-sm font-semibold text-orange-600 hover:text-orange-700">
                    Open details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Top Themes" description="Last 30 days">
          <div className="space-y-3">
            {[
              ['CSV imports', 38],
              ['Report exports', 29],
              ['Mobile tables', 24],
              ['Renewal alerts', 19],
            ].map(([theme, count]) => (
              <div key={theme} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-3">
                <span className="text-sm font-medium text-slate-700">{theme}</span>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  )
}

export default Feedback
