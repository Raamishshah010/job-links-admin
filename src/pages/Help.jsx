import { BookOpen, HelpCircle, LifeBuoy, MessageSquare, Search } from 'lucide-react'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'

function Help() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Support"
        title="Help Center"
        description="Find answers, product guides, and support resources for running sales and customer workflows."
      />

      <div className="mb-6 rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
        <p className="text-sm font-semibold text-orange-300">How can we help?</p>
        <div className="relative mt-4 max-w-2xl">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search help articles, workflows, and settings"
            className="w-full rounded-xl border border-white/10 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricTile icon={BookOpen} label="Articles" value="124" detail="Organized by CRM workflow" tone="indigo" />
        <MetricTile icon={LifeBuoy} label="Support SLA" value="2h" detail="Business plan response" tone="emerald" />
        <MetricTile icon={MessageSquare} label="Community" value="8.4K" detail="Active CRM operators" tone="orange" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {[
          ['Getting started', 'Set up workspaces, import leads, and invite your team.'],
          ['Sales workflows', 'Qualify leads, track orders, and build reports.'],
          ['Admin and security', 'Manage roles, account settings, and notifications.'],
        ].map(([title, description]) => (
          <Panel key={title} title={title}>
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <HelpCircle size={18} />
              </div>
              <div>
                <p className="text-sm text-slate-600">{description}</p>
                <button className="mt-3 text-sm font-semibold text-orange-600 hover:text-orange-700">
                  Browse articles
                </button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </main>
  )
}

export default Help
