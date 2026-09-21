import { useState } from 'react'
import { Search, Users } from 'lucide-react'
import Avatar from '../components/Avatar'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { isSubscriptionActive } from '../utils/jobPortalHelpers'

function toDate(value) {
  return value && typeof value.toDate === 'function' ? value.toDate() : null
}

// Read-only by design: job-seeker accounts and their subscription status
// live entirely on the website side (Firebase Auth + Firestore `users`).
// This page is a window into that data for support/visibility, not a
// second place to edit it — subscription changes always go through
// Subscriptions.jsx so there's exactly one approval code path.
function JobSeekers() {
  const { items: users, loading } = useFirestoreCollection('users', { orderByField: 'createdAt' })
  const [search, setSearch] = useState('')

  const filtered = users.filter((u) => {
    if (!search.trim()) return true
    const q = search.trim().toLowerCase()
    return `${u.name || ''} ${u.email || ''}`.toLowerCase().includes(q)
  })

  const activeCount = users.filter((u) => isSubscriptionActive(u.subscription)).length

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Job Seekers"
        description="Everyone registered on the JobsLinks.pk website, and their subscription status."
      >
        <div className="relative w-60 max-w-full">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-300"
          />
        </div>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricTile icon={Users} label="Registered Users" value={loading ? '—' : users.length} tone="indigo" />
        <MetricTile
          icon={Users}
          label="Active Subscribers"
          value={loading ? '—' : activeCount}
          detail={`${users.length ? Math.round((activeCount / users.length) * 100) : 0}% of users`}
          tone="emerald"
        />
      </div>

      <Panel title="Users" description={`Showing ${filtered.length} of ${users.length}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-2 pb-3">User</th>
                <th className="px-2 pb-3">Subscription</th>
                <th className="px-2 pb-3">CV Builder</th>
                <th className="px-2 pb-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && (
                <tr>
                  <td colSpan={4} className="px-2 py-10 text-center text-sm text-slate-400">
                    Loading users…
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((u) => {
                  const active = isSubscriptionActive(u.subscription)
                  const joined = toDate(u.createdAt)
                  return (
                    <tr key={u.id} className="align-middle hover:bg-slate-50/60">
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name || u.email || '?'} size={34} />
                          <div>
                            <p className="font-medium text-slate-800">{u.name || 'Unnamed'}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${
                            active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {active ? `Active (${u.subscription.plan})` : u.subscription?.status || 'None'}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${
                            u.cvUnlocked ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {u.cvUnlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-slate-500">{joined ? joined.toLocaleDateString() : '—'}</td>
                    </tr>
                  )
                })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-2 py-10 text-center text-sm text-slate-400">
                    No users match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </main>
  )
}

export default JobSeekers
