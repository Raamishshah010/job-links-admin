import { Archive, Mail, MessageSquare, Paperclip, Search, Send, Star } from 'lucide-react'
import Avatar from '../components/Avatar'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { conversations } from '../data/crmData'

function Messages() {
  const active = conversations[0]

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Shared inbox"
        title="Messages"
        description="Centralize email and chat conversations so every customer reply has an owner and next action."
      >
        <button className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          <Send size={15} /> Compose
        </button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricTile icon={Mail} label="Open Threads" value="38" detail="12 waiting on us" tone="indigo" />
        <MetricTile icon={MessageSquare} label="Team Replies" value="126" detail="Today across all channels" tone="emerald" />
        <MetricTile icon={Archive} label="Resolved" value="84%" detail="First response under SLA" tone="orange" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
        <Panel title="Inbox" description="Priority conversations">
          <div className="relative mb-4">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search messages"
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-300"
            />
          </div>
          <div className="space-y-2">
            {conversations.map((message) => (
              <button
                key={message.id}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  message.id === active.id
                    ? 'border-indigo-200 bg-indigo-50/60'
                    : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={message.from} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-800">{message.from}</p>
                      {message.unread && <span className="h-2 w-2 rounded-full bg-orange-500" />}
                    </div>
                    <p className="truncate text-xs text-slate-400">{message.company}</p>
                    <p className="mt-2 truncate text-sm font-medium text-slate-700">{message.subject}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{message.preview}</p>
                  </div>
                  <span className="text-xs text-slate-400">{message.time}</span>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel
          title={active.subject}
          description={`${active.from} at ${active.company}`}
          action={<span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">Assigned</span>}
        >
          <div className="space-y-5">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-3">
                <Avatar name={active.from} size={38} />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{active.from}</p>
                  <p className="text-xs text-slate-400">{active.time} via {active.channel}</p>
                </div>
                <Star size={16} className="ml-auto text-amber-400" />
              </div>
              <p className="text-sm leading-6 text-slate-600">
                {active.preview} We also need a final owner for analytics validation and a list of
                stakeholders who should receive weekly rollout summaries.
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="mb-3 text-sm font-semibold text-slate-800">Reply</p>
              <textarea
                rows={6}
                defaultValue="Hi Emma, thanks for confirming. Feb 2 works on our side. I will send the rollout owner list and weekly summary schedule before end of day."
                className="w-full resize-none rounded-lg border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-indigo-300"
              />
              <div className="mt-3 flex items-center justify-between">
                <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  <Paperclip size={15} /> Attach
                </button>
                <button className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                  <Send size={15} /> Send Reply
                </button>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </main>
  )
}

export default Messages
