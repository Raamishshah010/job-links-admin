import { Plus, Settings, Users } from 'lucide-react'
import Avatar from '../components/Avatar'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import ProgressBar from '../components/ProgressBar'
import { workspaceCards } from '../data/crmData'

const config = {
  sales: {
    eyebrow: 'Workspace',
    title: 'Sales Workspace',
    description: 'Daily selling command center for leads, proposals, follow-ups, and closed-won momentum.',
    cards: workspaceCards.sales,
  },
  account: {
    eyebrow: 'Workspace',
    title: 'Account Management Workspace',
    description: 'Coordinate renewals, account health, expansion plays, and executive relationship plans.',
    cards: workspaceCards.account,
  },
  support: {
    eyebrow: 'Workspace',
    title: 'Support & Success Workspace',
    description: 'Keep customer issues, onboarding handoffs, and knowledge gaps visible across the team.',
    cards: workspaceCards.support,
  },
  new: {
    eyebrow: 'Workspace builder',
    title: 'Create Workspace',
    description: 'Design a focused workspace with the exact boards, metrics, and collaborators your team needs.',
    cards: [
      { title: 'Choose template', value: '6 templates', detail: 'Sales, success, support, finance, and ops', progress: 40 },
      { title: 'Invite team', value: '12 members', detail: 'Role-based access is ready', progress: 68 },
      { title: 'Connect views', value: '9 sources', detail: 'Leads, customers, tasks, reports', progress: 55 },
    ],
  },
}

function Workspace({ type = 'sales' }) {
  const page = config[type]

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader eyebrow={page.eyebrow} title={page.title} description={page.description}>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
          <Settings size={16} />
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus size={15} /> Add View
        </button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {page.cards.map((card) => (
          <div key={card.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>
                <p className="mt-1 text-2xl font-bold text-slate-800">{card.value}</p>
              </div>
              <span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600">
                Live
              </span>
            </div>
            <p className="mb-3 text-sm text-slate-500">{card.detail}</p>
            <ProgressBar value={card.progress} color="bg-indigo-500" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Pinned Work" description="High-priority views for this workspace">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {['Hot opportunities', 'Renewal watchlist', 'Implementation risks', 'Leadership summary'].map((view, i) => (
              <button key={view} className="rounded-xl border border-slate-100 p-4 text-left hover:border-indigo-200 hover:bg-indigo-50/40">
                <p className="font-semibold text-slate-800">{view}</p>
                <p className="mt-1 text-sm text-slate-500">{8 + i * 3} records updated today</p>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Collaborators" description="Active owners">
          <div className="space-y-3">
            {['Aiden Hudson', 'Olivia Davis', 'Jacob Muller', 'Zoe Lewis'].map((name, i) => (
              <div key={name} className="flex items-center gap-3">
                <Avatar name={name} size={34} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{name}</p>
                  <p className="text-xs text-slate-400">{i === 0 ? 'Owner' : 'Editor'}</p>
                </div>
                <Users size={15} className="text-slate-300" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  )
}

export default Workspace
