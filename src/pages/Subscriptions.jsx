import { useState } from 'react'
import { CheckCircle2, Clock3, Search, XCircle } from 'lucide-react'
import {
  Timestamp,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { useToast } from '../hooks/useToast'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'

const STATUS_TABS = ['pending', 'approved', 'rejected', 'all']
const PLAN_DURATIONS_DAYS = { sixmonth: 182, year: 365 }

function toDate(value) {
  return value && typeof value.toDate === 'function' ? value.toDate() : null
}

function addDaysFromNow(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}

// Mirrors the approval logic on the website's own /admin page — this is
// the same `paymentRequests` collection, just viewed from inside the
// richer admin panel. Approving here is the only code path (besides the
// website's own admin page) that can activate a subscription; the client
// itself can never write `subscription.status` directly (see
// firestore.rules on the website project).
function Subscriptions() {
  const { showToast } = useToast()
  const { items: requests, loading } = useFirestoreCollection('paymentRequests', { orderByField: 'createdAt' })
  const [statusTab, setStatusTab] = useState('pending')
  const [search, setSearch] = useState('')
  const [busyId, setBusyId] = useState(null)

  const filtered = requests.filter((r) => {
    if (statusTab !== 'all' && r.status !== statusTab) return false
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      return `${r.name || ''} ${r.email || ''} ${r.phone || ''}`.toLowerCase().includes(q)
    }
    return true
  })

  const totals = {
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    revenue: requests.filter((r) => r.status === 'approved').reduce((sum, r) => sum + (r.amount || 0), 0),
  }

  const approve = async (req) => {
    setBusyId(req.id)
    try {
      const batch = writeBatch(db)
      const reqRef = doc(db, 'paymentRequests', req.id)
      const userRef = doc(db, 'users', req.userId)

      batch.update(reqRef, { status: 'approved', resolvedAt: serverTimestamp() })

      if (req.type === 'subscription') {
        const days = req.durationDays || PLAN_DURATIONS_DAYS[req.plan] || 365
        const expires = addDaysFromNow(days)
        batch.update(userRef, {
          'subscription.status': 'active',
          'subscription.plan': req.plan,
          'subscription.activatedAt': serverTimestamp(),
          'subscription.expiresAt': Timestamp.fromDate(expires),
        })
      } else if (req.type === 'cv_unlock') {
        batch.update(userRef, { cvUnlocked: true })
      }

      await batch.commit()
      showToast('Request approved — access granted on the website.')
    } catch (err) {
      showToast(err.message || 'Could not approve this request.', 'info')
    } finally {
      setBusyId(null)
    }
  }

  const reject = async (req) => {
    setBusyId(req.id)
    try {
      const batch = writeBatch(db)
      batch.update(doc(db, 'paymentRequests', req.id), { status: 'rejected', resolvedAt: serverTimestamp() })
      await batch.commit()
      showToast('Request rejected.')
    } catch (err) {
      showToast(err.message || 'Could not reject this request.', 'info')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Subscriptions"
        description="Approve or reject website subscription and CV-unlock payment requests."
      >
        <div className="relative w-60 max-w-full">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or phone"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-300"
          />
        </div>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricTile icon={Clock3} label="Pending" value={loading ? '—' : totals.pending} tone="amber" />
        <MetricTile icon={CheckCircle2} label="Approved" value={loading ? '—' : totals.approved} tone="emerald" />
        <MetricTile
          icon={CheckCircle2}
          label="Approved Revenue"
          value={loading ? '—' : `PKR ${totals.revenue.toLocaleString()}`}
          tone="indigo"
        />
      </div>

      <Panel
        title="Payment Requests"
        description={`Showing ${filtered.length} of ${requests.length} requests`}
        action={
          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  statusTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-2 pb-3">Requester</th>
                <th className="px-2 pb-3">Type</th>
                <th className="px-2 pb-3">Amount</th>
                <th className="px-2 pb-3">Method</th>
                <th className="px-2 pb-3">Date</th>
                <th className="px-2 pb-3">Status</th>
                <th className="px-2 pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-2 py-10 text-center text-sm text-slate-400">
                    Loading requests…
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((r) => {
                  const created = toDate(r.createdAt)
                  return (
                    <tr key={r.id} className="align-middle hover:bg-slate-50/60">
                      <td className="px-2 py-3">
                        <p className="font-medium text-slate-800">{r.name || r.email || r.userId}</p>
                        <p className="text-xs text-slate-400">{r.email} · {r.phone}</p>
                      </td>
                      <td className="px-2 py-3 text-slate-600">
                        {r.type === 'subscription' ? `Subscription (${r.plan})` : 'CV Unlock'}
                      </td>
                      <td className="px-2 py-3 text-slate-600">PKR {r.amount}</td>
                      <td className="px-2 py-3 capitalize text-slate-600">{r.method}</td>
                      <td className="px-2 py-3 text-slate-500">{created ? created.toLocaleDateString() : '—'}</td>
                      <td className="px-2 py-3">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold capitalize ${
                            r.status === 'approved'
                              ? 'bg-emerald-50 text-emerald-600'
                              : r.status === 'rejected'
                                ? 'bg-rose-50 text-rose-500'
                                : 'bg-amber-50 text-amber-600'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        {r.status === 'pending' ? (
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => approve(r)}
                              disabled={busyId === r.id}
                              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                            >
                              <CheckCircle2 size={13} /> Approve
                            </button>
                            <button
                              onClick={() => reject(r)}
                              disabled={busyId === r.id}
                              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-50 disabled:opacity-50"
                            >
                              <XCircle size={13} /> Reject
                            </button>
                          </div>
                        ) : (
                          <p className="text-right text-xs text-slate-400">
                            {toDate(r.resolvedAt)?.toLocaleDateString() || '—'}
                          </p>
                        )}
                      </td>
                    </tr>
                  )
                })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-2 py-10 text-center text-sm text-slate-400">
                    No requests match this filter.
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

export default Subscriptions
