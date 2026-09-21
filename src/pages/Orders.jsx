import { CheckCircle2, Clock, DollarSign, Filter, PackageSearch, Plus, Truck } from 'lucide-react'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import ProgressBar from '../components/ProgressBar'
import Avatar from '../components/Avatar'
import { orders } from '../data/crmData'

function Orders() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Revenue operations"
        title="Orders"
        description="Track active customer orders from handoff through invoicing with clear owners and fulfillment progress."
      >
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
          <Filter size={16} />
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus size={15} /> New Order
        </button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile icon={PackageSearch} label="Active Orders" value="24" detail="4 need attention" tone="indigo" />
        <MetricTile icon={DollarSign} label="Order Value" value="$284K" detail="18% above last month" tone="emerald" />
        <MetricTile icon={Truck} label="In Fulfillment" value="11" detail="Median cycle: 8 days" tone="orange" />
        <MetricTile icon={CheckCircle2} label="Ready to Invoice" value="6" detail="$42K awaiting finance" tone="sky" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Order Pipeline" description="Live fulfillment board">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-3 font-medium">Order</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Owner</th>
                  <th className="pb-3 font-medium">Stage</th>
                  <th className="pb-3 font-medium">Due</th>
                  <th className="pb-3 font-medium">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-4 pr-4">
                      <p className="font-semibold text-slate-800">{order.id}</p>
                      <p className="text-xs text-slate-400">{order.package}</p>
                    </td>
                    <td className="py-4 pr-4 text-slate-600">{order.customer}</td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={order.owner} size={30} />
                        <span className="text-slate-600">{order.owner}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600">
                        {order.stage}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-500">{order.due}</td>
                    <td className="min-w-36 py-4">
                      <ProgressBar value={order.progress} color="bg-orange-500" />
                      <p className="mt-1 text-xs text-slate-400">{order.progress}% complete</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Fulfillment Queue" description="Today's operational focus">
          <div className="space-y-4">
            {['Contract countersign', 'Provision workspace', 'Collect billing contact', 'Book onboarding'].map((item, i) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Clock size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{item}</p>
                  <p className="text-xs text-slate-500">{i + 2} orders waiting</p>
                </div>
                <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600">
                  P{i + 1}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  )
}

export default Orders
