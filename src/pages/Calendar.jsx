import { CalendarDays, ChevronLeft, ChevronRight, Clock, Plus, Video } from 'lucide-react'
import Avatar from '../components/Avatar'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { calendarEvents } from '../data/crmData'

function Calendar() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Productivity"
        title="Calendar"
        description="See customer meetings, internal handoffs, follow-up blocks, and team availability."
      >
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
          <ChevronLeft size={16} />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
          <ChevronRight size={16} />
        </button>
        <button className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          <Plus size={15} /> New Event
        </button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricTile icon={CalendarDays} label="Meetings Today" value="9" detail="4 customer-facing" tone="indigo" />
        <MetricTile icon={Clock} label="Focus Time" value="3.5h" detail="Protected on your calendar" tone="emerald" />
        <MetricTile icon={Video} label="Calls Booked" value="26" detail="Across this week" tone="orange" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Week View" description="Jan 5-11, 2026">
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, i) => (
              <div key={day} className={`min-h-36 rounded-xl border p-3 ${i === 2 ? 'border-indigo-200 bg-indigo-50/60' : 'border-slate-100'}`}>
                <p className="text-xs font-semibold uppercase text-slate-400">{day}</p>
                <p className="mt-1 text-lg font-bold text-slate-800">{5 + i}</p>
                {i === 2 && (
                  <div className="mt-4 rounded-lg bg-indigo-600 p-2 text-xs font-medium text-white">
                    Nordic launch review
                  </div>
                )}
                {i === 4 && (
                  <div className="mt-4 rounded-lg bg-orange-500 p-2 text-xs font-medium text-white">
                    Forecast call
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Today" description="Wednesday, Jan 7">
          <div className="space-y-3">
            {calendarEvents.map((event) => (
              <div key={event.time} className="flex gap-3 rounded-xl border border-slate-100 p-3">
                <div className="w-12 shrink-0 text-sm font-semibold text-slate-500">{event.time}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Avatar name={event.owner} size={24} />
                    <span className="text-xs text-slate-500">{event.owner}</span>
                  </div>
                </div>
                <span className="h-fit rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  )
}

export default Calendar
