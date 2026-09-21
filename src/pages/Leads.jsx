import { useMemo, useRef, useState } from 'react'
import {
  Info,
  Settings as SettingsIcon,
  Bell,
  Share2,
  Search,
  Filter,
  ArrowUpDown,
  SlidersHorizontal,
  UploadCloud,
  List,
  LayoutGrid,
  MoreHorizontal,
  Pencil,
  UserCog,
  Trash2,
  X,
  Star,
} from 'lucide-react'
import Avatar from '../components/Avatar'
import Modal from '../components/Modal'
import SparkStatCard from '../components/SparkStatCard'
import CustomerProfilePanel from '../components/CustomerProfilePanel'
import { useToast } from '../hooks/useToast'
import { initialLeads, managers, statusStyles } from '../data/leadsData'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'favourite', label: 'Favourite' },
  { key: 'new', label: 'New' },
  { key: 'assigned', label: 'Assigned to me' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'hot', label: 'Hot' },
]

const STATS = [
  { label: 'New Leads', value: '42', trend: '12%', dir: 'up', color: '#f97316' },
  { label: 'Qualified Leads', value: '18', trend: '4.2%', dir: 'up', color: '#f97316' },
  { label: 'Avg Response Time', value: '1.8h', trend: '15%', dir: 'up', color: '#f97316' },
  { label: 'Hot Leads', value: '9', trend: '2%', dir: 'down', color: '#f97316' },
]

function sparkData(seed) {
  let n = seed
  return Array.from({ length: 8 }, () => {
    n = (n * 9301 + 49297) % 233280
    return { v: 20 + (n % 40) }
  })
}

function ScoreBars({ score }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 10 }, (_, i) => {
        const filled = i < score
        const isLast = i === score - 1
        return (
          <span
            key={i}
            className="inline-block h-3 w-1 rounded-full"
            style={{
              backgroundColor: filled ? (isLast ? '#22c55e' : '#f59e0b') : '#e2e8f0',
            }}
          />
        )
      })}
      <span className="ml-1.5 text-xs font-medium text-slate-500">{score}/10</span>
    </div>
  )
}

const TEAM_AVATARS = ['Aiden Hudson', 'Olivia Davis', 'Jacob Muller', 'James Smith']

function Leads() {
  const { showToast } = useToast()
  const [leads, setLeads] = useState(initialLeads)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(new Set())
  const [sortAsc, setSortAsc] = useState(null)
  const [statusFilter, setStatusFilter] = useState([])
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [showColumnMenu, setShowColumnMenu] = useState(false)
  const [columns, setColumns] = useState({ manager: true, source: true })
  const [view, setView] = useState('list')
  const [activeLead, setActiveLead] = useState(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [bulkEditOpen, setBulkEditOpen] = useState(false)
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false)
  const [bulkStatus, setBulkStatus] = useState('QUALIFIED')
  const [bulkManager, setBulkManager] = useState(managers[0])
  const fileInputRef = useRef(null)

  const filteredLeads = useMemo(() => {
    let list = [...leads]

    if (activeTab === 'favourite') list = list.filter((l) => l.favourite)
    else if (activeTab === 'new') list = list.filter((l) => l.status === 'NEW')
    else if (activeTab === 'assigned') list = list.filter((l) => l.manager === 'Aiden Hudson')
    else if (activeTab === 'overdue') list = list.filter((l) => l.overdue)
    else if (activeTab === 'hot') list = list.filter((l) => l.status === 'HOT')

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      )
    }

    if (statusFilter.length > 0) {
      list = list.filter((l) => statusFilter.includes(l.status))
    }

    if (sortAsc !== null) {
      list.sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))
    }

    return list
  }, [leads, activeTab, search, statusFilter, sortAsc])

  const allVisibleSelected =
    filteredLeads.length > 0 && filteredLeads.every((l) => selected.has(l.id))

  const toggleSelectAll = () => {
    setSelected((prev) => {
      if (allVisibleSelected) {
        const next = new Set(prev)
        filteredLeads.forEach((l) => next.delete(l.id))
        return next
      }
      const next = new Set(prev)
      filteredLeads.forEach((l) => next.add(l.id))
      return next
    })
  }

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const updateLead = (updated) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
    setActiveLead(updated)
  }

  const handleDelete = () => {
    setLeads((prev) => prev.filter((l) => !selected.has(l.id)))
    showToast(`${selected.size} lead${selected.size > 1 ? 's' : ''} deleted.`)
    setSelected(new Set())
  }

  const handleDiscard = () => setSelected(new Set())

  const applyBulkEdit = () => {
    setLeads((prev) =>
      prev.map((l) => (selected.has(l.id) ? { ...l, status: bulkStatus } : l))
    )
    showToast(`Status updated for ${selected.size} lead${selected.size > 1 ? 's' : ''}.`)
    setBulkEditOpen(false)
    setSelected(new Set())
  }

  const applyBulkAssign = () => {
    setLeads((prev) =>
      prev.map((l) => (selected.has(l.id) ? { ...l, manager: bulkManager } : l))
    )
    showToast(`${selected.size} lead${selected.size > 1 ? 's' : ''} assigned to ${bulkManager}.`)
    setBulkAssignOpen(false)
    setSelected(new Set())
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const handleFileSelected = (e) => {
    const file = e.target.files?.[0]
    if (file) showToast(`Imported leads from "${file.name}".`)
    e.target.value = ''
  }

  const toggleStatusFilter = (status) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">
          Leads <span className="text-slate-400">{leads.length}</span>
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Leads overview: track, qualify, and convert every incoming lead here.', 'info')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Info size={18} />
          </button>
          <button
            onClick={() => setShowColumnMenu((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <SettingsIcon size={18} />
          </button>
          <button
            onClick={() => showToast('You have no new notifications.', 'info')}
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </button>

          <div className="ml-1 flex -space-x-2">
            {TEAM_AVATARS.map((name) => (
              <div key={name} className="ring-2 ring-white rounded-full">
                <Avatar name={name} size={34} />
              </div>
            ))}
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 ring-2 ring-white">
              +5
            </div>
          </div>

          <button
            onClick={() => setShareOpen(true)}
            className="ml-2 flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            <Share2 size={15} /> Share Access
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s, i) => (
          <SparkStatCard
            key={s.label}
            label={s.label}
            value={s.value}
            trend={s.trend}
            trendDirection={s.dir}
            color={s.color}
            data={sparkData(i + 3)}
          />
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-1 border-b border-slate-100">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`-mb-px border-b-2 px-3.5 py-2.5 text-sm font-medium transition ${
              activeTab === tab.key
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
        {/* toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-4">
          <div className="relative max-w-xs flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-600 outline-none placeholder:text-slate-400 focus:border-indigo-300"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowFilterMenu((v) => !v)
                setShowColumnMenu(false)
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border text-slate-500 hover:bg-slate-50 ${
                statusFilter.length ? 'border-indigo-300 bg-indigo-50 text-indigo-600' : 'border-slate-200'
              }`}
              title="Filter by status"
            >
              <Filter size={16} />
            </button>
            {showFilterMenu && (
              <div className="absolute left-0 z-20 mt-2 w-48 rounded-xl border border-slate-100 bg-white p-2 shadow-lg">
                <p className="px-2 pb-1 text-xs font-semibold uppercase text-slate-400">Status</p>
                {Object.keys(statusStyles).map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={statusFilter.includes(status)}
                      onChange={() => toggleStatusFilter(status)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                    />
                    {status}
                  </label>
                ))}
                {statusFilter.length > 0 && (
                  <button
                    onClick={() => setStatusFilter([])}
                    className="mt-1 w-full rounded-lg px-2 py-1.5 text-left text-xs font-medium text-rose-500 hover:bg-rose-50"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setSortAsc((v) => (v === true ? false : true))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
            title="Sort by name"
          >
            <ArrowUpDown size={16} />
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowColumnMenu((v) => !v)
                setShowFilterMenu(false)
              }}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
              title="Manage columns"
            >
              <SlidersHorizontal size={16} />
            </button>
            {showColumnMenu && (
              <div className="absolute left-0 z-20 mt-2 w-48 rounded-xl border border-slate-100 bg-white p-2 shadow-lg">
                <p className="px-2 pb-1 text-xs font-semibold uppercase text-slate-400">Columns</p>
                {['manager', 'source'].map((col) => (
                  <label
                    key={col}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm capitalize text-slate-600 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={columns[col]}
                      onChange={() => setColumns((c) => ({ ...c, [col]: !c[col] }))}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                    />
                    {col}
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleImportClick}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <UploadCloud size={15} /> Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleFileSelected}
          />

          <div className="ml-auto flex items-center gap-1 rounded-lg border border-slate-200 p-1">
            <button
              onClick={() => setView('list')}
              className={`flex h-7 w-7 items-center justify-center rounded-md ${
                view === 'list' ? 'bg-slate-100 text-slate-700' : 'text-slate-400'
              }`}
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`flex h-7 w-7 items-center justify-center rounded-md ${
                view === 'grid' ? 'bg-slate-100 text-slate-700' : 'text-slate-400'
              }`}
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>

        {/* empty state */}
        {filteredLeads.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-sm font-semibold text-slate-600">No leads here yet</p>
            <p className="max-w-xs text-sm text-slate-400">
              {activeTab === 'assigned'
                ? "Leads assigned to you will show up here."
                : activeTab === 'overdue'
                ? "You're all caught up - nothing is overdue."
                : 'Try a different filter or search term.'}
            </p>
          </div>
        )}

        {/* list view */}
        {view === 'list' && filteredLeads.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                    />
                  </th>
                  <th className="px-2 py-3 font-medium">Customer</th>
                  <th className="px-2 py-3 font-medium">Company</th>
                  <th className="px-2 py-3 font-medium">Email</th>
                  <th className="px-2 py-3 font-medium">Status</th>
                  {columns.manager && <th className="px-2 py-3 font-medium">Manager</th>}
                  {columns.source && <th className="px-2 py-3 font-medium">Source</th>}
                  <th className="px-2 py-3 font-medium">Score</th>
                  <th className="px-2 py-3 font-medium">Date</th>
                  <th className="w-10 px-2 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="cursor-pointer border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
                    onClick={() => setActiveLead(lead)}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(lead.id)}
                        onChange={() => toggleSelect(lead.id)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
                      />
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={lead.name} size={32} />
                        <span className="flex items-center gap-1 font-medium text-slate-800">
                          {lead.name}
                          {lead.favourite && (
                            <Star size={12} className="fill-amber-400 text-amber-400" />
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-slate-500">{lead.company}</td>
                    <td className="px-2 py-3 text-slate-500">{lead.email}</td>
                    <td className="px-2 py-3">
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-semibold ${statusStyles[lead.status]}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    {columns.manager && (
                      <td className="px-2 py-3 text-slate-500">{lead.manager}</td>
                    )}
                    {columns.source && <td className="px-2 py-3 text-slate-500">{lead.source}</td>}
                    <td className="px-2 py-3">
                      <ScoreBars score={lead.score} />
                    </td>
                    <td className="px-2 py-3 text-slate-400">{lead.date}</td>
                    <td className="px-2 py-3" onClick={(e) => e.stopPropagation()}>
                      <button className="rounded-lg p-1.5 text-slate-300 hover:bg-slate-100 hover:text-slate-500">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* grid view */}
        {view === 'grid' && filteredLeads.length > 0 && (
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredLeads.map((lead) => (
              <button
                key={lead.id}
                onClick={() => setActiveLead(lead)}
                className="rounded-xl border border-slate-100 p-4 text-left hover:border-indigo-200 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={lead.name} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-800">{lead.name}</p>
                    <p className="truncate text-xs text-slate-400">{lead.company}</p>
                  </div>
                  <span className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${statusStyles[lead.status]}`}>
                    {lead.status}
                  </span>
                </div>
                <p className="mt-3 truncate text-xs text-slate-500">{lead.email}</p>
                <div className="mt-3 flex items-center justify-between">
                  <ScoreBars score={lead.score} />
                  <span className="text-xs text-slate-400">{lead.date}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-xl bg-slate-900 px-2 py-2 text-sm text-white shadow-2xl">
          <span className="px-3 font-medium">Selected: {selected.size}</span>
          <span className="h-5 w-px bg-white/20" />
          <button
            onClick={() => setBulkEditOpen(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium hover:bg-white/10"
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => setBulkAssignOpen(true)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium hover:bg-white/10"
          >
            <UserCog size={14} /> Assign to
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium text-rose-300 hover:bg-white/10"
          >
            <Trash2 size={14} /> Delete
          </button>
          <button
            onClick={handleDiscard}
            className="ml-1 flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 font-semibold text-rose-500 hover:bg-rose-50"
          >
            <X size={14} /> Discard
          </button>
        </div>
      )}

      {/* Customer profile side panel */}
      {activeLead && (
        <CustomerProfilePanel
          lead={activeLead}
          onClose={() => setActiveLead(null)}
          onUpdateLead={updateLead}
          onExpand={() => showToast('Full profile view is coming soon.', 'info')}
        />
      )}

      {/* Share access modal */}
      <Modal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title="Share Access to Leads"
        footer={
          <button
            onClick={() => {
              setShareOpen(false)
              showToast('Access updated for your team.')
            }}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
          >
            Done
          </button>
        }
      >
        <p className="mb-3 text-sm text-slate-500">
          Choose who on your team can view and edit this leads board.
        </p>
        <ul className="space-y-2">
          {[...TEAM_AVATARS, 'Zoe Lewis', 'Noah Garcia'].map((name, i) => (
            <li key={name} className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2">
              <Avatar name={name} size={32} />
              <span className="flex-1 text-sm font-medium text-slate-700">{name}</span>
              <select
                defaultValue={i === 0 ? 'Owner' : 'Editor'}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none"
              >
                <option>Owner</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>
            </li>
          ))}
        </ul>
      </Modal>

      {/* Bulk edit modal */}
      <Modal
        open={bulkEditOpen}
        onClose={() => setBulkEditOpen(false)}
        title={`Edit ${selected.size} Lead${selected.size > 1 ? 's' : ''}`}
        footer={
          <button
            onClick={applyBulkEdit}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Apply
          </button>
        }
      >
        <label className="mb-1 block text-xs font-medium text-slate-500">Set status to</label>
        <select
          value={bulkStatus}
          onChange={(e) => setBulkStatus(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
        >
          {Object.keys(statusStyles).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Modal>

      {/* Bulk assign modal */}
      <Modal
        open={bulkAssignOpen}
        onClose={() => setBulkAssignOpen(false)}
        title={`Assign ${selected.size} Lead${selected.size > 1 ? 's' : ''}`}
        footer={
          <button
            onClick={applyBulkAssign}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Assign
          </button>
        }
      >
        <label className="mb-1 block text-xs font-medium text-slate-500">Assign manager</label>
        <select
          value={bulkManager}
          onChange={(e) => setBulkManager(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
        >
          {managers.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Modal>
    </main>
  )
}

export default Leads
