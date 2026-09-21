import { Briefcase, Building2, CreditCard, Megaphone, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MetricTile from '../components/MetricTile'
import Panel from '../components/Panel'
import Avatar from '../components/Avatar'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { companyStatusStyles, jobStatusStyles } from '../data/jobPortalData'
import { isSubscriptionActive } from '../utils/jobPortalHelpers'

function JobPortalOverview() {
  const navigate = useNavigate()
  const { items: companies, loading: companiesLoading } = useFirestoreCollection('companies', { orderByField: 'createdAt' })
  const { items: jobs, loading: jobsLoading } = useFirestoreCollection('jobs')
  const { items: ads, loading: adsLoading } = useFirestoreCollection('advertisements', { orderByField: 'createdAt' })
  const { items: users, loading: usersLoading } = useFirestoreCollection('users')
  const { items: paymentRequests, loading: requestsLoading } = useFirestoreCollection('paymentRequests')

  const loading = companiesLoading || jobsLoading || adsLoading || usersLoading || requestsLoading
  const pendingRequests = paymentRequests.filter((r) => r.status === 'pending').length
  const activeSubscribers = users.filter((u) => isSubscriptionActive(u.subscription)).length

  const recentCompanies = [...companies].slice(0, 5)
  const recentJobs = [...jobs].slice(0, 5)

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-500">Super Admin</p>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Live counts from Firestore — the same data the JobsLinks.pk website reads and writes.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <button onClick={() => navigate('/job-portal/companies')} className="text-left">
          <MetricTile icon={Building2} label="Companies" value={loading ? '—' : companies.length} tone="indigo" />
        </button>
        <button onClick={() => navigate('/job-portal/jobs')} className="text-left">
          <MetricTile icon={Briefcase} label="Job Listings" value={loading ? '—' : jobs.length} tone="emerald" />
        </button>
        <button onClick={() => navigate('/job-portal/ads')} className="text-left">
          <MetricTile icon={Megaphone} label="Advertisements" value={loading ? '—' : ads.length} tone="orange" />
        </button>
        <button onClick={() => navigate('/job-portal/subscriptions')} className="text-left">
          <MetricTile
            icon={CreditCard}
            label="Pending Requests"
            value={loading ? '—' : pendingRequests}
            detail="Awaiting approval"
            tone="amber"
          />
        </button>
        <button onClick={() => navigate('/job-portal/job-seekers')} className="text-left">
          <MetricTile
            icon={Users}
            label="Active Subscribers"
            value={loading ? '—' : activeSubscribers}
            detail={`of ${users.length} registered`}
            tone="sky"
          />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Recent Companies">
          {recentCompanies.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              {loading ? 'Loading…' : 'No companies registered yet.'}
            </p>
          ) : (
            <ul className="space-y-3">
              {recentCompanies.map((c) => (
                <li key={c.id} className="flex items-center gap-3">
                  <Avatar name={c.name} size={32} />
                  <span className="flex-1 truncate text-sm font-medium text-slate-800">{c.name}</span>
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold ${companyStatusStyles[c.status] || 'bg-slate-100 text-slate-500'}`}>
                    {c.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent Job Listings">
          {recentJobs.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">
              {loading ? 'Loading…' : 'No job listings yet — run the website scraper or add one manually.'}
            </p>
          ) : (
            <ul className="space-y-3">
              {recentJobs.map((j) => (
                <li key={j.id} className="flex items-center gap-3">
                  <span className="flex-1 truncate text-sm font-medium text-slate-800">{j.title}</span>
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold ${jobStatusStyles[j.status] || jobStatusStyles.Active}`}>
                    {j.status || 'Active'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </main>
  )
}

export default JobPortalOverview
