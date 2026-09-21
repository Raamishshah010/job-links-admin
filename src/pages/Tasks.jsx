import { CheckSquare, Filter, ListTodo, Plus } from 'lucide-react'
import Avatar from '../components/Avatar'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { tasks } from '../data/crmData'

const columns = ['Today', 'This Week', 'Backlog']

function Tasks() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Productivity"
        title="Tasks"
        description="Plan follow-ups, renewals, handoffs, and internal work without leaving the CRM."
      >
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
          <Filter size={16} />
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus size={15} /> New Task
        </button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricTile icon={ListTodo} label="Open Tasks" value="57" detail="14 due this week" tone="indigo" />
        <MetricTile icon={CheckSquare} label="Completed" value="128" detail="Across the last 7 days" tone="emerald" />
        <MetricTile icon={Filter} label="Blocked" value="5" detail="Need manager review" tone="rose" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {columns.map((column) => (
          <Panel key={column} title={column} description={`${tasks.filter((task) => task.status === column).length} tasks`}>
            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === column)
                .map((task) => (
                  <div key={task.id} className="rounded-xl border border-slate-100 p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <p className="font-semibold text-slate-800">{task.title}</p>
                      <span className={`rounded-md px-2 py-1 text-xs font-semibold ${
                        task.priority === 'High'
                          ? 'bg-rose-50 text-rose-600'
                          : task.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name={task.owner} size={30} />
                        <span className="text-sm text-slate-500">{task.owner}</span>
                      </div>
                      <span className="text-xs font-medium text-slate-400">{task.due}</span>
                    </div>
                  </div>
                ))}
            </div>
          </Panel>
        ))}
      </div>
    </main>
  )
}

export default Tasks
