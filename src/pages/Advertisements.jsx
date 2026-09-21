import { useMemo, useState } from 'react'
import {
  Calendar,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  MousePointerClick,
  Pause,
  Play,
  Plus,
  Search,
  Target,
  Users,
  Wallet,
} from 'lucide-react'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { useToast } from '../hooks/useToast'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { addDocument, updateDocument } from '../utils/firestoreCrud'
import {
  adPlacements,
  adStatusStyles,
  adTypes,
  targetAudiences,
} from '../data/jobPortalData'

const STATUS_TABS = ['All', 'Active', 'Pending Review', 'Scheduled', 'Paused', 'Ended']

function ctr(clicks, impressions) {
  if (!impressions) return '0.0%'
  return `${((clicks / impressions) * 100).toFixed(1)}%`
}

function cpc(spent, clicks) {
  if (!clicks) return 'PKR 0'
  return `PKR ${(spent / clicks).toFixed(0)}`
}

function budgetPercent(spent, total) {
  if (!total) return 0
  return Math.min(100, Math.round((spent / total) * 100))
}

function formatTimestamp(value) {
  const date = value && typeof value.toDate === 'function' ? value.toDate() : null
  if (!date) return null
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

const emptyForm = {
  title: '',
  companyId: '',
  adType: adTypes[0],
  placement: adPlacements[0],
  targetAudience: targetAudiences[0],
  targetLocation: '',
  linkedJobId: '',
  startDate: '',
  endDate: '',
  totalBudget: '',
  dailyBudget: '',
  description: '',
}

function Advertisements() {
  const { showToast } = useToast()
  const { items: ads, loading } = useFirestoreCollection('advertisements', { orderByField: 'createdAt' })
  const { items: companies } = useFirestoreCollection('companies', { orderByField: 'createdAt' })
  const { items: jobs } = useFirestoreCollection('jobs')
  const [search, setSearch] = useState('')
  const [statusTab, setStatusTab] = useState('All')
  const [placementFilter, setPlacementFilter] = useState('All')
  const [addOpen, setAddOpen] = useState(false)
  const [viewId, setViewId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const filtered = useMemo(() => {
    let list = [...ads]
    if (statusTab !== 'All') list = list.filter((a) => a.status === statusTab)
    if (placementFilter !== 'All') list = list.filter((a) => a.placement === placementFilter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((a) => a.title.toLowerCase().includes(q) || a.company.toLowerCase().includes(q))
    }
    return list
  }, [ads, statusTab, placementFilter, search])

  const totals = useMemo(
    () => ({
      active: ads.filter((a) => a.status === 'Active').length,
      pendingReview: ads.filter((a) => a.status === 'Pending Review').length,
      clicks: ads.reduce((sum, a) => sum + a.clicks, 0),
      spent: ads.reduce((sum, a) => sum + a.spent, 0),
    }),
    [ads]
  )

  const viewAd = ads.find((a) => a.id === viewId) || null
  const viewAdCompanyJobs = viewAd ? jobs.filter((j) => j.companyId === viewAd.companyId) : []
  const viewAdLinkedJob = viewAd ? jobs.find((j) => j.id === viewAd.linkedJobId) : null

  const updateStatus = async (id, status, extra = {}) => {
    try {
      await updateDocument('advertisements', id, { status, ...extra })
      showToast(`Campaign marked as ${status.toLowerCase()}.`)
    } catch (err) {
      showToast(err.message || 'Could not update this campaign.', 'info')
    }
  }

  const approveAd = (ad) => {
    const startsInFuture = ad.startDate && new Date(ad.startDate) > new Date()
    updateStatus(ad.id, startsInFuture ? 'Scheduled' : 'Active', {
      reviewedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    })
  }

  const rejectAd = (ad) => {
    updateStatus(ad.id, 'Rejected', {
      reviewedOn: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    })
  }

  const handleAdd = async () => {
    if (!form.title.trim()) return showToast('Ad title is required.', 'info')
    const company = companies.find((c) => c.id === form.companyId)
    const newAd = {
      title: form.title.trim(),
      company: company?.name || 'Unknown',
      companyId: form.companyId,
      adType: form.adType,
      placement: form.placement,
      status: 'Pending Review',
      targetAudience: form.targetAudience,
      targetLocation: form.targetLocation.trim() || 'Nationwide',
      linkedJobId: form.linkedJobId || null,
      reviewedOn: null,
      startDate: form.startDate || '—',
      endDate: form.endDate || '—',
      totalBudget: Number(form.totalBudget) || 0,
      dailyBudget: Number(form.dailyBudget) || 0,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      description: form.description.trim() || 'No creative brief provided yet.',
    }
    try {
      await addDocument('advertisements', newAd)
      setAddOpen(false)
      setForm(emptyForm)
      showToast('Campaign submitted for review.')
    } catch (err) {
      showToast(err.message || 'Could not create this campaign.', 'info')
    }
  }

  const companyJobsForForm = form.companyId ? jobs.filter((j) => j.companyId === form.companyId) : []

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Advertisements"
        description="Review, approve, and track sponsored campaigns that companies buy to reach more candidates."
      >
        <div className="relative w-60 max-w-full">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaign or company"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-300"
          />
        </div>
        <select
          value={placementFilter}
          onChange={(e) => setPlacementFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-indigo-300"
        >
          <option>All</option>
          {adPlacements.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          <Plus size={15} /> Add Ad
        </button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile icon={CheckCircle2} label="Active Campaigns" value={totals.active} detail="Currently running" tone="emerald" />
        <MetricTile icon={Clock3} label="Pending Review" value={totals.pendingReview} detail="Awaiting approval" tone="amber" />
        <MetricTile icon={MousePointerClick} label="Total Clicks" value={totals.clicks.toLocaleString()} detail="Across all campaigns" tone="orange" />
        <MetricTile icon={Wallet} label="Total Spend" value={`PKR ${totals.spent.toLocaleString()}`} detail="Utilised across campaigns" tone="indigo" />
      </div>

      <Panel
        title="Ad Campaigns"
        description={`Showing ${filtered.length} of ${ads.length} campaigns`}
        action={
          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
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
          <table className="w-full min-w-[980px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-2 pb-3">Campaign</th>
                <th className="px-2 pb-3">Target</th>
                <th className="px-2 pb-3">Budget</th>
                <th className="px-2 pb-3">Performance</th>
                <th className="px-2 pb-3">Status</th>
                <th className="px-2 pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-2 py-10 text-center text-sm text-slate-400">
                    Loading campaigns…
                  </td>
                </tr>
              )}
              {!loading && filtered.map((ad) => (
                <tr key={ad.id} className="align-middle hover:bg-slate-50/60">
                  <td className="px-2 py-3">
                    <p className="font-medium text-slate-800">{ad.title}</p>
                    <p className="text-xs text-slate-400">{ad.company}</p>
                    <span className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                      {ad.adType} · {ad.placement}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <p className="text-slate-600">{ad.targetAudience}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={11} /> {ad.targetLocation}
                    </p>
                  </td>
                  <td className="px-2 py-3">
                    <p className="text-slate-600">
                      PKR {ad.spent.toLocaleString()} <span className="text-slate-300">/ {ad.totalBudget.toLocaleString()}</span>
                    </p>
                    <div className="mt-1.5 h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${budgetPercent(ad.spent, ad.totalBudget)}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-2 py-3 text-slate-500">
                    <p>{ad.impressions.toLocaleString()} impr.</p>
                    <p className="text-xs text-slate-400">
                      {ad.clicks.toLocaleString()} clicks · {ctr(ad.clicks, ad.impressions)} CTR
                    </p>
                  </td>
                  <td className="px-2 py-3">
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${adStatusStyles[ad.status]}`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex flex-wrap justify-end gap-1">
                      <button
                        onClick={() => setViewId(ad.id)}
                        title="View details"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Eye size={16} />
                      </button>
                      {ad.status === 'Pending Review' && (
                        <>
                          <button
                            onClick={() => approveAd(ad)}
                            className="rounded-lg px-2 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectAd(ad)}
                            className="rounded-lg px-2 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {ad.status === 'Active' && (
                        <button
                          onClick={() => updateStatus(ad.id, 'Paused')}
                          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-amber-600 hover:bg-amber-50"
                        >
                          <Pause size={12} /> Pause
                        </button>
                      )}
                      {(ad.status === 'Paused' || ad.status === 'Scheduled') && (
                        <button
                          onClick={() => updateStatus(ad.id, 'Active')}
                          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
                        >
                          <Play size={12} /> Activate
                        </button>
                      )}
                      {!['Ended', 'Rejected', 'Pending Review'].includes(ad.status) && (
                        <button
                          onClick={() => updateStatus(ad.id, 'Ended')}
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                        >
                          End
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-2 py-10 text-center text-sm text-slate-400">
                    No ad campaigns match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Add Ad */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Create an Ad Campaign"
        widthClass="max-w-2xl"
        footer={
          <>
            <button
              onClick={() => setAddOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Submit for Review
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Campaign Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">Ad title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Nimbus Cloud - Hiring Engineers"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Company</label>
                <select
                  value={form.companyId}
                  onChange={(e) => setForm({ ...form, companyId: e.target.value, linkedJobId: '' })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                >
                  <option value="">Select a company…</option>
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Ad type</label>
                <select
                  value={form.adType}
                  onChange={(e) => setForm({ ...form, adType: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                >
                  {adTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Placement</label>
                <select
                  value={form.placement}
                  onChange={(e) => setForm({ ...form, placement: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                >
                  {adPlacements.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Linked job listing (optional)</label>
                <select
                  value={form.linkedJobId}
                  onChange={(e) => setForm({ ...form, linkedJobId: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                >
                  <option value="">None</option>
                  {companyJobsForForm.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Targeting</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Target audience</label>
                <select
                  value={form.targetAudience}
                  onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                >
                  {targetAudiences.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Target location</label>
                <input
                  value={form.targetLocation}
                  onChange={(e) => setForm({ ...form, targetLocation: e.target.value })}
                  placeholder="City or Nationwide"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Schedule & Budget</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Start date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">End date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Total budget (PKR)</label>
                <input
                  type="number"
                  value={form.totalBudget}
                  onChange={(e) => setForm({ ...form, totalBudget: e.target.value })}
                  placeholder="20000"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Daily budget (PKR)</label>
                <input
                  type="number"
                  value={form.dailyBudget}
                  onChange={(e) => setForm({ ...form, dailyBudget: e.target.value })}
                  placeholder="700"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Creative brief / description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="What should this ad say, and where should it point?"
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
            />
          </div>
        </div>
      </Modal>

      {/* View Ad Details */}
      <Modal
        open={!!viewAd}
        onClose={() => setViewId(null)}
        title="Campaign Details"
        widthClass="max-w-2xl"
        footer={
          viewAd && (
            <>
              {viewAd.status === 'Pending Review' && (
                <>
                  <button
                    onClick={() => rejectAd(viewAd)}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => approveAd(viewAd)}
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
                  >
                    Approve
                  </button>
                </>
              )}
              {viewAd.status === 'Active' && (
                <button
                  onClick={() => updateStatus(viewAd.id, 'Paused')}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-50"
                >
                  Pause Campaign
                </button>
              )}
              {(viewAd.status === 'Paused' || viewAd.status === 'Scheduled') && (
                <button
                  onClick={() => updateStatus(viewAd.id, 'Active')}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
                >
                  Activate
                </button>
              )}
              {!['Ended', 'Rejected', 'Pending Review'].includes(viewAd.status) && (
                <button
                  onClick={() => updateStatus(viewAd.id, 'Ended')}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50"
                >
                  End Campaign
                </button>
              )}
              <button
                onClick={() => setViewId(null)}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </>
          )
        }
      >
        {viewAd && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <Avatar name={viewAd.company} size={52} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-800">{viewAd.title}</h3>
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold ${adStatusStyles[viewAd.status]}`}>
                    {viewAd.status}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-slate-500">{viewAd.company}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">{viewAd.adType}</span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">{viewAd.placement}</span>
                </p>
              </div>
            </div>

            <p className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">{viewAd.description}</p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-indigo-50 p-3 text-center">
                <p className="text-lg font-bold text-indigo-600">{viewAd.impressions.toLocaleString()}</p>
                <p className="text-xs text-indigo-500">Impressions</p>
              </div>
              <div className="rounded-xl bg-orange-50 p-3 text-center">
                <p className="text-lg font-bold text-orange-600">{viewAd.clicks.toLocaleString()}</p>
                <p className="text-xs text-orange-500">Clicks</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-center">
                <p className="text-lg font-bold text-emerald-600">{ctr(viewAd.clicks, viewAd.impressions)}</p>
                <p className="text-xs text-emerald-500">CTR</p>
              </div>
              <div className="rounded-xl bg-sky-50 p-3 text-center">
                <p className="text-lg font-bold text-sky-600">{viewAd.conversions}</p>
                <p className="text-xs text-sky-500">Conversions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 p-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <Wallet size={13} /> Budget
                </p>
                <p className="text-sm font-medium text-slate-700">
                  PKR {viewAd.spent.toLocaleString()} spent of {viewAd.totalBudget.toLocaleString()}
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${budgetPercent(viewAd.spent, viewAd.totalBudget)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  Daily budget: PKR {viewAd.dailyBudget.toLocaleString()} · Cost per click: {cpc(viewAd.spent, viewAd.clicks)}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 p-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <Target size={13} /> Targeting
                </p>
                <p className="flex items-center gap-2 text-sm text-slate-700">
                  <Users size={14} className="text-slate-400" /> {viewAd.targetAudience}
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-700">
                  <MapPin size={14} className="text-slate-400" /> {viewAd.targetLocation}
                </p>
                {viewAdLinkedJob && (
                  <p className="mt-1.5 text-xs text-slate-400">Linked to job: {viewAdLinkedJob.title}</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 p-4">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Calendar size={13} /> Timeline
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 sm:grid-cols-4">
                <p>Created: {formatTimestamp(viewAd.createdAt) || '—'}</p>
                <p>Reviewed: {viewAd.reviewedOn || 'Pending'}</p>
                <p>Starts: {viewAd.startDate}</p>
                <p>Ends: {viewAd.endDate}</p>
              </div>
            </div>

            {viewAdCompanyJobs.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Other listings from {viewAd.company}</p>
                <ul className="divide-y divide-slate-50 rounded-xl border border-slate-100">
                  {viewAdCompanyJobs.map((job) => (
                    <li key={job.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <p className="truncate text-sm font-medium text-slate-800">{job.title}</p>
                      <span className="shrink-0 text-xs text-slate-400">{job.applicants} applicants</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>
    </main>
  )
}

export default Advertisements