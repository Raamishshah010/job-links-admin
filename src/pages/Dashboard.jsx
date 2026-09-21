import { useMemo } from 'react'
import {
  Briefcase,
  Building2,
  MapPin,
  Megaphone,
  MousePointerClick,
  Users,
  Wallet,
} from 'lucide-react'
import Avatar from '../components/Avatar'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { useAuth } from '../hooks/useAuth'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { normalizeJob, formatTimestamp } from '../utils/jobPortalHelpers'

// Fixed palette so category bars stay visually consistent across renders
const CATEGORY_COLORS = ['#4f46e5', '#16a34a', '#f97316', '#0ea5e9', '#e11d48', '#9333ea', '#0d9488', '#d97706', '#64748b']

const JOB_STATUS_COLORS = {
  Active: '#10b981',
  Pending: '#f59e0b',
  Draft: '#94a3b8',
  Closed: '#f43f5e',
}

const COMPANY_STATUS_COLORS = {
  Verified: '#10b981',
  Pending: '#f59e0b',
  Suspended: '#f43f5e',
}

function parseDate(str) {
  const d = new Date(str)
  return Number.isNaN(d.getTime()) ? new Date(0) : d
}

function timeAgo(str) {
  const diffDays = Math.round((Date.now() - parseDate(str).getTime()) / 86400000)
  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  return str
}

function Dashboard() {
  const { user } = useAuth()
  const firstName = (user?.name || 'Admin').split(' ')[0]

  const { items: rawJobs, loading: jobsLoading } = useFirestoreCollection('jobs')
  const { items: companies, loading: companiesLoading } = useFirestoreCollection('companies', { orderByField: 'createdAt' })
  const { items: ads, loading: adsLoading } = useFirestoreCollection('advertisements', { orderByField: 'createdAt' })
  const loading = jobsLoading || companiesLoading || adsLoading
  const jobs = useMemo(() => rawJobs.map(normalizeJob), [rawJobs])

  const stats = useMemo(() => {
    const totalApplicants = jobs.reduce((sum, j) => sum + j.applicants, 0)
    const totalShortlisted = jobs.reduce((sum, j) => sum + j.shortlisted, 0)
    const activeJobs = jobs.filter((j) => j.status === 'Active').length
    const activeAds = ads.filter((a) => a.status === 'Active').length
    const totalSpent = ads.reduce((sum, a) => sum + (a.spent || 0), 0)
    const totalClicks = ads.reduce((sum, a) => sum + (a.clicks || 0), 0)
    const verifiedCompanies = companies.filter((c) => c.status === 'Verified').length

    return {
      totalCompanies: companies.length,
      verifiedCompanies,
      activeJobs,
      totalJobs: jobs.length,
      totalApplicants,
      totalShortlisted,
      activeAds,
      totalSpent,
      totalClicks,
    }
  }, [jobs, companies, ads])

  // Applicants and job count grouped by category — drives the bar chart
  const categoryBreakdown = useMemo(() => {
    const map = new Map()
    jobs.forEach((j) => {
      const entry = map.get(j.category) || { name: j.category, jobs: 0, applicants: 0 }
      entry.jobs += 1
      entry.applicants += j.applicants
      map.set(j.category, entry)
    })
    const list = [...map.values()].sort((a, b) => b.applicants - a.applicants)
    const max = Math.max(...list.map((c) => c.applicants), 1)
    return list.map((c, i) => ({ ...c, percent: Math.round((c.applicants / max) * 100), color: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }))
  }, [jobs])

  // Status mix for jobs and companies — feeds the two donut-style breakdown bars
  const jobStatusBreakdown = useMemo(() => {
    if (jobs.length === 0) return []
    const map = new Map()
    jobs.forEach((j) => map.set(j.status, (map.get(j.status) || 0) + 1))
    return [...map.entries()].map(([status, count]) => ({ status, count, percent: Math.round((count / jobs.length) * 100) }))
  }, [jobs])

  const companyStatusBreakdown = useMemo(() => {
    if (companies.length === 0) return []
    const map = new Map()
    companies.forEach((c) => map.set(c.status, (map.get(c.status) || 0) + 1))
    return [...map.entries()].map(([status, count]) => ({ status, count, percent: Math.round((count / companies.length) * 100) }))
  }, [companies])

  // Top companies by total applicants received
  const topCompanies = useMemo(
    () => [...companies].sort((a, b) => (b.totalApplicants || 0) - (a.totalApplicants || 0)).slice(0, 5),
    [companies]
  )

  // Merge jobs posted, companies joined, and ads created into one recency-sorted feed
  const recentActivity = useMemo(() => {
    const jobItems = jobs.map((j) => ({
      type: 'job',
      date: j.posted,
      title: `${j.title} posted`,
      subtitle: `${j.company} · ${j.category}`,
    }))
    const companyItems = companies.map((c) => ({
      type: 'company',
      date: c.joined,
      title: `${c.name} registered`,
      subtitle: c.industry,
    }))
    const adItems = ads.map((a) => ({
      type: 'ad',
      date: formatTimestamp(a.createdAt) || '—',
      title: `${a.title} campaign created`,
      subtitle: a.company,
    }))
    return [...jobItems, ...companyItems, ...adItems]
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))
      .slice(0, 7)
  }, [jobs, companies, ads])

  const activityIcon = { job: Briefcase, company: Building2, ad: Megaphone }
  const activityTone = {
    job: 'bg-indigo-50 text-indigo-600',
    company: 'bg-emerald-50 text-emerald-600',
    ad: 'bg-orange-50 text-orange-600',
  }

  if (loading && jobs.length === 0 && companies.length === 0 && ads.length === 0) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4 text-sm text-slate-400">
        Loading dashboard…
      </main>
    )
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Super Admin"
        title={`Welcome back, ${firstName}`}
        description="Here's what's happening across companies, listings, and campaigns right now."
      >
        <Avatar name={user?.name || 'Aiden Hudson'} size={40} />
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile
          icon={Building2}
          label="Registered Companies"
          value={stats.totalCompanies}
          detail={`${stats.verifiedCompanies} verified`}
          tone="indigo"
        />
        <MetricTile
          icon={Briefcase}
          label="Active Listings"
          value={stats.activeJobs}
          detail={`${stats.totalJobs} total posted`}
          tone="emerald"
        />
        <MetricTile
          icon={Users}
          label="Total Applicants"
          value={stats.totalApplicants}
          detail={`${stats.totalShortlisted} shortlisted`}
          tone="orange"
        />
        <MetricTile
          icon={Megaphone}
          label="Active Campaigns"
          value={stats.activeAds}
          detail={`PKR ${stats.totalSpent.toLocaleString()} spent`}
          tone="amber"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Applicants by category" description="Where candidate demand is concentrated right now">
          <div className="space-y-4">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">{cat.name}</span>
                  <span className="text-slate-400">
                    {cat.applicants} applicants <span className="text-slate-300">· {cat.jobs} jobs</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-2 rounded-full" style={{ width: `${cat.percent}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Status mix">
          <div className="space-y-5">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Briefcase size={13} /> Job listings
              </p>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                {jobStatusBreakdown.map((s) => (
                  <div key={s.status} style={{ width: `${s.percent}%`, backgroundColor: JOB_STATUS_COLORS[s.status] }} />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                {jobStatusBreakdown.map((s) => (
                  <span key={s.status} className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: JOB_STATUS_COLORS[s.status] }} />
                    {s.status} ({s.count})
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Building2 size={13} /> Companies
              </p>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                {companyStatusBreakdown.map((s) => (
                  <div key={s.status} style={{ width: `${s.percent}%`, backgroundColor: COMPANY_STATUS_COLORS[s.status] }} />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                {companyStatusBreakdown.map((s) => (
                  <span key={s.status} className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COMPANY_STATUS_COLORS[s.status] }} />
                    {s.status} ({s.count})
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <div className="rounded-xl bg-sky-50 p-3 text-center">
                <p className="flex items-center justify-center gap-1 text-lg font-bold text-sky-600">
                  <MousePointerClick size={15} /> {stats.totalClicks.toLocaleString()}
                </p>
                <p className="text-xs text-sky-500">Ad clicks</p>
              </div>
              <div className="rounded-xl bg-indigo-50 p-3 text-center">
                <p className="flex items-center justify-center gap-1 text-lg font-bold text-indigo-600">
                  <Wallet size={15} /> {(stats.totalSpent / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-indigo-500">PKR spent</p>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Panel title="Top companies" description="Ranked by total applicants received">
          <div className="space-y-1">
            {topCompanies.map((company, i) => (
              <div key={company.id} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="w-4 text-center text-xs font-semibold text-slate-300">{i + 1}</span>
                  <Avatar name={company.name} size={38} />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{company.name}</p>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={11} /> {company.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700">{company.totalApplicants}</p>
                  <p className="text-xs text-slate-400">{company.activeJobs} active jobs</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent activity">
          <div className="space-y-1">
            {recentActivity.map((item, i) => {
              const Icon = activityIcon[item.type]
              return (
                <div key={i} className="flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-slate-50">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${activityTone[item.type]}`}>
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700">{item.title}</p>
                    <p className="truncate text-xs text-slate-400">{item.subtitle}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{timeAgo(item.date)}</span>
                </div>
              )
            })}
          </div>
        </Panel>
      </div>
    </main>
  )
}

export default Dashboard