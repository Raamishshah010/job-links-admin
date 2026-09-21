import { BarChart3, Download, FileText, Plus, RefreshCw, Share2 } from 'lucide-react'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { reports } from '../data/crmData'

function Reports() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Management"
        title="Reports"
        description="Build, schedule, and share CRM reports for pipeline, activity, source ROI, retention, and team operations."
      >
        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
          <Download size={15} /> Export
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus size={15} /> New Report
        </button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricTile icon={FileText} label="Saved Reports" value="28" detail="11 shared with leadership" tone="indigo" />
        <MetricTile icon={RefreshCw} label="Scheduled Runs" value="16" detail="Next run in 2 hours" tone="emerald" />
        <MetricTile icon={Share2} label="Shared Views" value="43" detail="7 external recipients" tone="orange" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Report Library" description="Reusable views and exports">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-3 font-medium">Report</th>
                  <th className="pb-3 font-medium">Owner</th>
                  <th className="pb-3 font-medium">Cadence</th>
                  <th className="pb-3 font-medium">Updated</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((report) => (
                  <tr key={report.name}>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <BarChart3 size={16} />
                        </div>
                        <span className="font-semibold text-slate-800">{report.name}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{report.owner}</td>
                    <td className="py-4 pr-4 text-slate-500">{report.cadence}</td>
                    <td className="py-4 pr-4 text-slate-500">{report.updated}</td>
                    <td className="py-4">
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${
                        report.status === 'Ready'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Report Builder" description="Preview configuration">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Dataset</label>
              <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300">
                <option>Pipeline and deals</option>
                <option>Lead source ROI</option>
                <option>Customer renewals</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Visualization</label>
              <div className="grid grid-cols-3 gap-2">
                {['Table', 'Bar', 'Line'].map((type) => (
                  <button
                    key={type}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                      type === 'Bar'
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Recipients</label>
              <input
                defaultValue="leadership@conceptzilla.io"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300"
              />
            </div>
            <button className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
              Save Report
            </button>
          </div>
        </Panel>
      </div>
    </main>
  )
}

export default Reports
