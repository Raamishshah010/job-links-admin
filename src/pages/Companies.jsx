import { useMemo, useState } from 'react'
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock3,
  Eye,
  Globe,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  ShieldOff,
  Star,
  Users,
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
  companyPlans,
  companySizes,
  companyStatusStyles,
  industries,
  jobStatusStyles,
} from '../data/jobPortalData'

const STATUS_TABS = ['All', 'Verified', 'Pending', 'Suspended']

const emptyForm = {
  name: '',
  industry: industries[0],
  location: '',
  address: '',
  website: '',
  email: '',
  phone: '',
  contactPerson: '',
  contactTitle: '',
  size: companySizes[0],
  founded: '',
  plan: companyPlans[0],
  description: '',
}

function Companies() {
  const { showToast } = useToast()
  const { items: companies, loading } = useFirestoreCollection('companies', { orderByField: 'createdAt' })
  const { items: jobs } = useFirestoreCollection('jobs')
  const [search, setSearch] = useState('')
  const [statusTab, setStatusTab] = useState('All')
  const [industryFilter, setIndustryFilter] = useState('All')
  const [addOpen, setAddOpen] = useState(false)
  const [viewId, setViewId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const filtered = useMemo(() => {
    let list = [...companies]
    if (statusTab !== 'All') list = list.filter((c) => c.status === statusTab)
    if (industryFilter !== 'All') list = list.filter((c) => c.industry === industryFilter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.contactPerson?.toLowerCase().includes(q)
      )
    }
    return list
  }, [companies, statusTab, industryFilter, search])

  const totals = useMemo(
    () => ({
      total: companies.length,
      verified: companies.filter((c) => c.status === 'Verified').length,
      pending: companies.filter((c) => c.status === 'Pending').length,
      activeJobs: companies.reduce((sum, c) => sum + c.activeJobs, 0),
    }),
    [companies]
  )

  const viewCompany = companies.find((c) => c.id === viewId) || null
  const viewCompanyJobs = viewCompany ? jobs.filter((j) => j.companyId === viewCompany.id) : []

  const updateStatus = async (id, status) => {
    const company = companies.find((c) => c.id === id)
    try {
      await updateDocument('companies', id, {
        status,
        verifiedOn:
          status === 'Verified'
            ? new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
            : company?.verifiedOn ?? null,
      })
      showToast(`${company?.name} marked as ${status.toLowerCase()}.`)
    } catch (err) {
      showToast(err.message || 'Could not update this company.', 'info')
    }
  }

  const handleAdd = async () => {
    if (!form.name.trim()) return showToast('Company name is required.', 'info')
    const newCompany = {
      name: form.name.trim(),
      industry: form.industry,
      location: form.location.trim() || 'Not specified',
      address: form.address.trim() || '—',
      website: form.website.trim() || '—',
      email: form.email.trim() || '—',
      phone: form.phone.trim() || '—',
      contactPerson: form.contactPerson.trim() || '—',
      contactTitle: form.contactTitle.trim() || '—',
      size: form.size,
      founded: form.founded.trim() || '—',
      plan: form.plan,
      description: form.description.trim() || 'No company description provided yet.',
      status: 'Pending',
      jobsPosted: 0,
      activeJobs: 0,
      totalApplicants: 0,
      rating: null,
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      verifiedOn: null,
    }
    try {
      await addDocument('companies', newCompany)
      setAddOpen(false)
      setForm(emptyForm)
      showToast(`${newCompany.name} registered and awaiting verification.`)
    } catch (err) {
      showToast(err.message || 'Could not register this company.', 'info')
    }
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Registered Companies"
        description="Review new registrations, verify employers, and manage who can post job listings and ads."
      >
        <div className="relative w-60 max-w-full">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, contact, city"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-300"
          />
        </div>
        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-indigo-300"
        >
          <option>All</option>
          {industries.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          <Plus size={15} /> Add Company
        </button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile icon={Building2} label="Total Companies" value={totals.total} detail="All-time registrations" tone="indigo" />
        <MetricTile icon={CheckCircle2} label="Verified" value={totals.verified} detail="Approved to post jobs" tone="emerald" />
        <MetricTile icon={Clock3} label="Pending Approval" value={totals.pending} detail="Awaiting review" tone="amber" />
        <MetricTile icon={Briefcase} label="Active Job Posts" value={totals.activeJobs} detail="Across all companies" tone="orange" />
      </div>

      <Panel
        title="Company Directory"
        description={`Showing ${filtered.length} of ${companies.length} companies`}
        action={
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
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
          <table className="w-full min-w-[920px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-2 pb-3">Company</th>
                <th className="px-2 pb-3">Contact</th>
                <th className="px-2 pb-3">Industry</th>
                <th className="px-2 pb-3">Plan</th>
                <th className="px-2 pb-3">Jobs</th>
                <th className="px-2 pb-3">Status</th>
                <th className="px-2 pb-3">Joined</th>
                <th className="px-2 pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && (
                <tr>
                  <td colSpan={8} className="px-2 py-10 text-center text-sm text-slate-400">
                    Loading companies…
                  </td>
                </tr>
              )}
              {!loading && filtered.map((company) => (
                <tr key={company.id} className="align-middle hover:bg-slate-50/60">
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={company.name} size={38} />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">{company.name}</p>
                        <p className="flex items-center gap-1 truncate text-xs text-slate-400">
                          <Globe size={11} /> {company.website} · {company.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <p className="text-slate-700">{company.contactPerson}</p>
                    <p className="text-xs text-slate-400">{company.contactTitle}</p>
                  </td>
                  <td className="px-2 py-3 text-slate-500">{company.industry}</td>
                  <td className="px-2 py-3">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                      {company.plan}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-slate-500">
                    {company.activeJobs} active <span className="text-slate-300">/ {company.jobsPosted} total</span>
                  </td>
                  <td className="px-2 py-3">
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${companyStatusStyles[company.status]}`}>
                      {company.status}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-slate-400">{company.joined}</td>
                  <td className="px-2 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setViewId(company.id)}
                        title="View details"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Eye size={16} />
                      </button>
                      {company.status !== 'Verified' && (
                        <button
                          onClick={() => updateStatus(company.id, 'Verified')}
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
                        >
                          Verify
                        </button>
                      )}
                      {company.status !== 'Suspended' && (
                        <button
                          onClick={() => updateStatus(company.id, 'Suspended')}
                          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-rose-500 hover:bg-rose-50"
                        >
                          <ShieldOff size={12} /> Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-2 py-10 text-center text-sm text-slate-400">
                    No companies match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Add Company */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Register a New Company"
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
              Add Company
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Company Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">Company name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Nimbus Cloud Systems"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Industry</label>
                <select
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                >
                  {industries.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Company size</label>
                <select
                  value={form.size}
                  onChange={(e) => setForm({ ...form, size: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                >
                  {companySizes.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Founded year</label>
                <input
                  value={form.founded}
                  onChange={(e) => setForm({ ...form, founded: e.target.value })}
                  placeholder="e.g. 2018"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Plan</label>
                <select
                  value={form.plan}
                  onChange={(e) => setForm({ ...form, plan: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                >
                  {companyPlans.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Location</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">City, Country</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Lahore, PK"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Office address</label>
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Street, area"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Contact Details</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Contact person</label>
                <input
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Designation</label>
                <input
                  value={form.contactTitle}
                  onChange={(e) => setForm({ ...form, contactTitle: e.target.value })}
                  placeholder="e.g. HR Manager"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="hr@company.com"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">Website</label>
                <input
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="company.com"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Company description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What does this company do?"
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
            />
          </div>
        </div>
      </Modal>

      {/* View Company Details */}
      <Modal
        open={!!viewCompany}
        onClose={() => setViewId(null)}
        title="Company Profile"
        widthClass="max-w-2xl"
        footer={
          viewCompany && (
            <>
              {viewCompany.status !== 'Verified' && (
                <button
                  onClick={() => updateStatus(viewCompany.id, 'Verified')}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
                >
                  Verify Company
                </button>
              )}
              {viewCompany.status !== 'Suspended' && (
                <button
                  onClick={() => updateStatus(viewCompany.id, 'Suspended')}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-50"
                >
                  Suspend Company
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
        {viewCompany && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <Avatar name={viewCompany.name} size={56} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-800">{viewCompany.name}</h3>
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold ${companyStatusStyles[viewCompany.status]}`}>
                    {viewCompany.status}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-slate-500">
                  {viewCompany.industry} · {viewCompany.size} employees · Founded {viewCompany.founded}
                </p>
                {viewCompany.rating != null && (
                  <p className="mt-1 flex items-center gap-1 text-sm font-medium text-amber-500">
                    <Star size={14} className="fill-amber-400 text-amber-400" /> {viewCompany.rating.toFixed(1)}
                    <span className="ml-1 font-normal text-slate-400">employer rating</span>
                  </p>
                )}
              </div>
            </div>

            <p className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
              {viewCompany.description}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Contact</p>
                <div className="space-y-2 text-sm text-slate-600">
                  <p className="font-medium text-slate-800">{viewCompany.contactPerson}</p>
                  <p className="text-xs text-slate-400">{viewCompany.contactTitle}</p>
                  <p className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" /> {viewCompany.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-400" /> {viewCompany.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <Globe size={14} className="text-slate-400" /> {viewCompany.website}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Location & Plan</p>
                <div className="space-y-2 text-sm text-slate-600">
                  <p className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
                    <span>
                      {viewCompany.address}
                      <br />
                      {viewCompany.location}
                    </span>
                  </p>
                  <p>
                    Plan:{' '}
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      {viewCompany.plan}
                    </span>
                  </p>
                  <p>Registered: {viewCompany.joined}</p>
                  <p>Verified on: {viewCompany.verifiedOn || 'Not yet verified'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-center">
                <p className="text-lg font-bold text-indigo-600">{viewCompany.jobsPosted}</p>
                <p className="text-xs text-indigo-500">Jobs Posted</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-center">
                <p className="text-lg font-bold text-emerald-600">{viewCompany.activeJobs}</p>
                <p className="text-xs text-emerald-500">Active Jobs</p>
              </div>
              <div className="rounded-xl bg-orange-50 p-3 text-center">
                <p className="text-lg font-bold text-orange-600">{viewCompany.totalApplicants}</p>
                <p className="text-xs text-orange-500">Total Applicants</p>
              </div>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Briefcase size={13} /> Job Listings from this company
              </p>
              {viewCompanyJobs.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-400">
                  No job listings posted yet.
                </p>
              ) : (
                <ul className="divide-y divide-slate-50 rounded-xl border border-slate-100">
                  {viewCompanyJobs.map((job) => (
                    <li key={job.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">{job.title}</p>
                        <p className="flex items-center gap-1 text-xs text-slate-400">
                          <Users size={11} /> {job.applicants} applicants
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${jobStatusStyles[job.status]}`}>
                        {job.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Modal>
    </main>
  )
}

export default Companies