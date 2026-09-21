import { Building2, Filter, HeartPulse, Plus, Search, Users } from 'lucide-react'
import Avatar from '../components/Avatar'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import ProgressBar from '../components/ProgressBar'
import { customers } from '../data/crmData'

function Customers() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Customer success"
        title="Customers"
        description="A complete account view for customer health, renewals, segments, and expansion opportunities."
      >
        <div className="relative w-64 max-w-full">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search accounts"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-300"
          />
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
          <Filter size={16} />
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus size={15} /> Add Customer
        </button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile icon={Users} label="Total Customers" value="1,284" detail="86 added this quarter" tone="indigo" />
        <MetricTile icon={HeartPulse} label="Avg Health" value="82%" detail="Up 5 points this month" tone="emerald" />
        <MetricTile icon={Building2} label="Enterprise" value="248" detail="$1.8M managed ARR" tone="orange" />
        <MetricTile icon={Plus} label="Expansion Plays" value="37" detail="12 in proposal stage" tone="sky" />
      </div>

      <Panel title="Account Portfolio" description="Health, ownership, renewal, and value">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {customers.map((customer) => (
            <div key={customer.id} className="rounded-xl border border-slate-100 p-4">
              <div className="flex items-start gap-3">
                <Avatar name={customer.name} size={44} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-800">{customer.company}</h3>
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                      {customer.segment}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">{customer.name} - {customer.email}</p>
                </div>
                <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                  {customer.status}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Owner</p>
                  <p className="font-medium text-slate-700">{customer.owner}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Value</p>
                  <p className="font-medium text-slate-700">{customer.value}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Renewal</p>
                  <p className="font-medium text-slate-700">{customer.renewal}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Health score</span>
                  <span>{customer.health}%</span>
                </div>
                <ProgressBar value={customer.health} color={customer.health > 75 ? 'bg-emerald-500' : 'bg-amber-500'} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </main>
  )
}

export default Customers
