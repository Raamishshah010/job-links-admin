import { useMemo, useState } from 'react'
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock3,
  Eye,
  GraduationCap,
  Layers,
  MapPin,
  Plus,
  Search,
  Star,
  Trash2,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react'
import Modal from '../components/Modal'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import Avatar from '../components/Avatar'
import { useToast } from '../hooks/useToast'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { addDocument, removeDocument, updateDocument } from '../utils/firestoreCrud'
import { normalizeJob } from '../utils/jobPortalHelpers'
import {
  educationLevels,
  experienceLevels,
  jobCategories,
  jobStatusStyles,
  jobTypes,
  workModes,
} from '../data/jobPortalData'

const STATUS_TABS = ['All', 'Active', 'Pending', 'Draft', 'Closed']

function formatSalary(min, max) {
  if (!min && !max) return 'Not disclosed'
  const fmt = (n) => `${Math.round(n / 1000)}K`
  return `PKR ${fmt(min)} - ${fmt(max)}`
}

const emptyForm = {
  title: '',
  companyId: '',
  location: '',
  type: jobTypes[0],
  category: jobCategories[0],
  workMode: workModes[0],
  experienceLevel: experienceLevels[0],
  education: educationLevels[0],
  vacancies: '1',
  salaryMin: '',
  salaryMax: '',
  deadline: '',
  description: '',
  requirements: '',
  skills: '',
}

function JobListings() {
  const { showToast } = useToast()
  const { items: rawJobs, loading } = useFirestoreCollection('jobs')
  const { items: companies } = useFirestoreCollection('companies', { orderByField: 'createdAt' })
  const jobs = rawJobs.map(normalizeJob)
  const [search, setSearch] = useState('')
  const [statusTab, setStatusTab] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [addOpen, setAddOpen] = useState(false)
  const [viewId, setViewId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const filtered = useMemo(() => {
    let list = [...jobs]
    if (statusTab !== 'All') list = list.filter((j) => j.status === statusTab)
    if (categoryFilter !== 'All') list = list.filter((j) => j.category === categoryFilter)
    if (typeFilter !== 'All') list = list.filter((j) => j.type === typeFilter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q)
      )
    }
    return list
  }, [jobs, statusTab, categoryFilter, typeFilter, search])

  const totals = useMemo(
    () => ({
      total: jobs.length,
      active: jobs.filter((j) => j.status === 'Active').length,
      pending: jobs.filter((j) => j.status === 'Pending').length,
      applicants: jobs.reduce((sum, j) => sum + j.applicants, 0),
    }),
    [jobs]
  )

  const viewJob = jobs.find((j) => j.id === viewId) || null
  const viewJobCompany = viewJob ? companies.find((c) => c.id === viewJob.companyId) : null

  const updateStatus = async (id, status) => {
    try {
      await updateDocument('jobs', id, { status })
      showToast(`Job listing marked as ${status.toLowerCase()}.`)
    } catch (err) {
      showToast(err.message || 'Could not update this listing.', 'info')
    }
  }

  const removeJob = async (id) => {
    const job = jobs.find((j) => j.id === id)
    try {
      await removeDocument('jobs', id)
      if (viewId === id) setViewId(null)
      showToast(`"${job?.title}" removed.`)
    } catch (err) {
      showToast(err.message || 'Could not remove this listing.', 'info')
    }
  }

  const handleAdd = async () => {
    if (!form.title.trim() || !form.companyId) {
      return showToast('Job title and company are required.', 'info')
    }
    const company = companies.find((c) => c.id === form.companyId)
    const newJob = {
      source: 'employer',
      title: form.title.trim(),
      company: company?.name || 'Unknown',
      companyId: form.companyId,
      location: form.location.trim() || 'Not specified',
      type: form.type,
      category: form.category,
      workMode: form.workMode,
      experienceLevel: form.experienceLevel,
      education: form.education,
      vacancies: Number(form.vacancies) || 1,
      salaryMin: Number(form.salaryMin) || 0,
      salaryMax: Number(form.salaryMax) || 0,
      status: 'Pending',
      applicants: 0,
      shortlisted: 0,
      views: 0,
      clickCount: 0,
      deadline: form.deadline || '—',
      featured: false,
      description: form.description.trim() || 'No description provided yet.',
      responsibilities: [],
      requirements: form.requirements
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
      skills: form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      benefits: [],
    }
    try {
      await addDocument('jobs', newJob)
      setAddOpen(false)
      setForm(emptyForm)
      showToast(`"${newJob.title}" submitted for approval.`)
    } catch (err) {
      showToast(err.message || 'Could not create this listing.', 'info')
    }
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Job Listings"
        description="Publish new openings, approve pending posts, and keep the board up to date."
      >
        <div className="relative w-60 max-w-full">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, company, category"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-300"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-indigo-300"
        >
          <option>All</option>
          {jobCategories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-indigo-300"
        >
          <option>All</option>
          {jobTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
        >
          <Plus size={15} /> Add Job
        </button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile icon={Briefcase} label="Total Listings" value={totals.total} detail="Across all companies" tone="indigo" />
        <MetricTile icon={CheckCircle2} label="Active" value={totals.active} detail="Visible to job seekers" tone="emerald" />
        <MetricTile icon={Clock3} label="Pending Approval" value={totals.pending} detail="Awaiting review" tone="amber" />
        <MetricTile icon={Users} label="Total Applicants" value={totals.applicants} detail="Across active listings" tone="orange" />
      </div>

      <Panel
        title="Job Directory"
        description={`Showing ${filtered.length} of ${jobs.length} listings`}
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
          <table className="w-full min-w-[960px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-2 pb-3">Job Title</th>
                <th className="px-2 pb-3">Company</th>
                <th className="px-2 pb-3">Type / Mode</th>
                <th className="px-2 pb-3">Salary</th>
                <th className="px-2 pb-3">Applicants</th>
                <th className="px-2 pb-3">Status</th>
                <th className="px-2 pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-2 py-10 text-center text-sm text-slate-400">
                    Loading job listings…
                  </td>
                </tr>
              )}
              {!loading && filtered.map((job) => (
                <tr key={job.id} className="align-middle hover:bg-slate-50/60">
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-slate-800">{job.title}</p>
                      {job.featured && <Star size={12} className="fill-amber-400 text-amber-400" />}
                    </div>
                    <p className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={11} /> {job.location} · {job.category}
                    </p>
                  </td>
                  <td className="px-2 py-3 text-slate-500">{job.company}</td>
                  <td className="px-2 py-3">
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{job.type}</span>
                    <span className="ml-1 text-xs text-slate-400">{job.workMode}</span>
                  </td>
                  <td className="px-2 py-3 text-slate-500">{formatSalary(job.salaryMin, job.salaryMax)}</td>
                  <td className="px-2 py-3 text-slate-500">
                    {job.applicants} <span className="text-slate-300">/ {job.shortlisted} shortlisted</span>
                  </td>
                  <td className="px-2 py-3">
                    <span className={`rounded-md px-2 py-1 text-xs font-semibold ${jobStatusStyles[job.status]}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setViewId(job.id)}
                        title="View details"
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Eye size={16} />
                      </button>
                      {job.status !== 'Active' && (
                        <button
                          onClick={() => updateStatus(job.id, 'Active')}
                          className="rounded-lg px-2 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-50"
                        >
                          Activate
                        </button>
                      )}
                      {job.status !== 'Closed' && (
                        <button
                          onClick={() => updateStatus(job.id, 'Closed')}
                          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-50"
                        >
                          <XCircle size={12} /> Close
                        </button>
                      )}
                      <button
                        onClick={() => removeJob(job.id)}
                        className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-2 py-10 text-center text-sm text-slate-400">
                    No job listings match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Add Job */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Post a New Job"
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
              Submit Listing
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Job Info</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">Job title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">Company</label>
                <select
                  value={form.companyId}
                  onChange={(e) => setForm({ ...form, companyId: e.target.value })}
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
                <label className="mb-1 block text-xs font-medium text-slate-500">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                >
                  {jobCategories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="City, Country or Remote"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Job type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                >
                  {jobTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Work mode</label>
                <select
                  value={form.workMode}
                  onChange={(e) => setForm({ ...form, workMode: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                >
                  {workModes.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Requirements</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Experience level</label>
                <select
                  value={form.experienceLevel}
                  onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                >
                  {experienceLevels.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Education</label>
                <select
                  value={form.education}
                  onChange={(e) => setForm({ ...form, education: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                >
                  {educationLevels.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">Key skills (comma separated)</label>
                <input
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="React, Node.js, SQL"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-500">Requirements (one per line)</label>
                <textarea
                  value={form.requirements}
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  rows={3}
                  placeholder={'3+ years of relevant experience\nStrong communication skills'}
                  className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Compensation & Timeline</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Vacancies</label>
                <input
                  type="number"
                  min="1"
                  value={form.vacancies}
                  onChange={(e) => setForm({ ...form, vacancies: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Application deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Min salary (PKR)</label>
                <input
                  type="number"
                  value={form.salaryMin}
                  onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                  placeholder="80000"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Max salary (PKR)</label>
                <input
                  type="number"
                  value={form.salaryMax}
                  onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                  placeholder="120000"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Job description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Summarize the role and its purpose"
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
            />
          </div>
        </div>
      </Modal>

      {/* View Job Details */}
      <Modal
        open={!!viewJob}
        onClose={() => setViewId(null)}
        title="Job Details"
        widthClass="max-w-2xl"
        footer={
          viewJob && (
            <>
              {viewJob.status !== 'Active' && (
                <button
                  onClick={() => updateStatus(viewJob.id, 'Active')}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
                >
                  Activate
                </button>
              )}
              {viewJob.status !== 'Closed' && (
                <button
                  onClick={() => updateStatus(viewJob.id, 'Closed')}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50"
                >
                  Close Listing
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
        {viewJob && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <Avatar name={viewJob.company} size={52} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-800">{viewJob.title}</h3>
                  {viewJob.featured && <Star size={14} className="fill-amber-400 text-amber-400" />}
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold ${jobStatusStyles[viewJob.status]}`}>
                    {viewJob.status}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-slate-500">
                  {viewJob.company} {viewJobCompany && `· ${viewJobCompany.industry}`}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {viewJob.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers size={12} /> {viewJob.type} · {viewJob.workMode}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap size={12} /> {viewJob.education}
                  </span>
                </p>
              </div>
            </div>

            <p className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">{viewJob.description}</p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-indigo-50 p-3 text-center">
                <p className="text-lg font-bold text-indigo-600">{viewJob.applicants}</p>
                <p className="text-xs text-indigo-500">Applicants</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-center">
                <p className="text-lg font-bold text-emerald-600">{viewJob.shortlisted}</p>
                <p className="text-xs text-emerald-500">Shortlisted</p>
              </div>
              <div className="rounded-xl bg-orange-50 p-3 text-center">
                <p className="text-lg font-bold text-orange-600">{viewJob.views}</p>
                <p className="text-xs text-orange-500">Views</p>
              </div>
              <div className="rounded-xl bg-sky-50 p-3 text-center">
                <p className="text-lg font-bold text-sky-600">{viewJob.vacancies}</p>
                <p className="text-xs text-sky-500">Vacancies</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 p-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <Wallet size={13} /> Compensation
                </p>
                <p className="text-sm font-medium text-slate-700">{formatSalary(viewJob.salaryMin, viewJob.salaryMax)}</p>
                <p className="mt-1 text-xs text-slate-400">Experience: {viewJob.experienceLevel}</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <Calendar size={13} /> Timeline
                </p>
                <p className="text-sm text-slate-700">Posted {viewJob.posted}</p>
                <p className="mt-1 text-xs text-slate-400">Deadline: {viewJob.deadline}</p>
              </div>
            </div>

            {viewJob.responsibilities?.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Responsibilities</p>
                <ul className="list-disc space-y-1.5 pl-4 text-sm text-slate-600">
                  {viewJob.responsibilities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {viewJob.requirements?.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Requirements</p>
                <ul className="list-disc space-y-1.5 pl-4 text-sm text-slate-600">
                  {viewJob.requirements.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {viewJob.skills?.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Key Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {viewJob.skills.map((skill) => (
                    <span key={skill} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {viewJob.benefits?.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Benefits</p>
                <div className="flex flex-wrap gap-1.5">
                  {viewJob.benefits.map((b) => (
                    <span key={b} className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </main>
  )
}

export default JobListings