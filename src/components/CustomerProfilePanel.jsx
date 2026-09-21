import { useState } from 'react'
import {
  GripVertical,
  ExternalLink,
  X,
  Building2,
  Mail,
  Phone,
  PhoneCall,
  Pencil,
  Paperclip,
  Mic,
  AtSign,
  Share2,
  Send,
  MoreHorizontal,
  FileText,
  Activity as ActivityIcon,
  Handshake,
} from 'lucide-react'
import Avatar from './Avatar'
import Modal from './Modal'
import { useToast } from '../hooks/useToast'

const TABS = ['Activity', 'Notes', 'Deals', 'Docs']

function seedNotes(lead) {
  return [
    {
      id: 'n1',
      author: lead.manager,
      time: '15 mins ago',
      text: `Got it. I'll send the update after my meeting this afternoon.`,
      reaction: 1,
    },
    {
      id: 'n2',
      author: 'Aiden Hudson',
      time: 'Yesterday',
      text: `Please prepare an update for ${lead.name.split(' ')[0]} on the onboarding timeline.`,
      reaction: 2,
    },
  ]
}

function CustomerProfilePanel({ lead, onClose, onUpdateLead, onExpand }) {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('Notes')
  const [notes, setNotes] = useState(() => seedNotes(lead))
  const [draft, setDraft] = useState('')
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({ ...lead })
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')

  const sendNote = () => {
    if (!draft.trim()) return
    setNotes((prev) => [
      ...prev,
      { id: `n${prev.length + 1}`, author: 'You', time: 'Just now', text: draft.trim(), reaction: 0 },
    ])
    setDraft('')
  }

  const saveEdit = () => {
    onUpdateLead(form)
    setEditOpen(false)
    showToast(`${form.name}'s profile was updated.`)
  }

  const confirmSchedule = () => {
    if (!scheduleDate || !scheduleTime) {
      showToast('Pick a date and time for the call.', 'info')
      return
    }
    showToast(`Call with ${lead.name} scheduled for ${scheduleDate} at ${scheduleTime}.`)
    setScheduleOpen(false)
    setScheduleDate('')
    setScheduleTime('')
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-30 flex max-h-[calc(100vh-3rem)] w-[380px] flex-col rounded-2xl border border-slate-100 bg-white shadow-2xl ring-1 ring-black/5">
        {/* header */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <GripVertical size={16} className="text-slate-300" />
          <span className="text-sm font-semibold text-slate-700">Customer Profile</span>
          <div className="ml-auto flex items-center gap-1">
            <button
              onClick={onExpand}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              title="Open full profile"
            >
              <ExternalLink size={15} />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto">
          {/* profile summary */}
          <div className="px-4 pt-4">
            <div className="flex items-center gap-3">
              <Avatar name={lead.name} size={52} />
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-slate-800">{lead.name}</p>
                <p className="flex items-center gap-1.5 truncate text-xs text-slate-500">
                  <Building2 size={12} /> {lead.company}
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-1.5 text-sm text-slate-500">
              <p className="flex items-center gap-2 truncate">
                <Mail size={14} className="shrink-0 text-slate-400" /> {lead.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-slate-400" /> {lead.phone}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => setScheduleOpen(true)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-600"
              >
                <PhoneCall size={14} /> Schedule a Call
              </button>
              <button
                onClick={() => {
                  setForm({ ...lead })
                  setEditOpen(true)
                }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Pencil size={14} /> Edit Profile
              </button>
            </div>
          </div>

          {/* tabs */}
          <div className="mt-4 flex border-b border-slate-100 px-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${
                  activeTab === tab
                    ? 'border-orange-500 text-slate-800'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* tab content */}
          <div className="min-h-[180px] px-4 py-3">
            {activeTab === 'Notes' && (
              <ul className="space-y-4">
                {notes.map((n) => (
                  <li key={n.id} className="flex gap-2.5">
                    <Avatar name={n.author} size={30} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        <span className="font-semibold text-slate-800">{n.author}</span>{' '}
                        <span className="text-xs text-slate-400">{n.time}</span>
                      </p>
                      <p className="mt-0.5 text-sm text-slate-600">{n.text}</p>
                      {n.reaction > 0 && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-600">
                          Like {n.reaction}
                        </span>
                      )}
                    </div>
                    <button className="h-fit shrink-0 text-slate-300 hover:text-slate-500">
                      <MoreHorizontal size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'Activity' && (
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <ActivityIcon size={14} className="mt-0.5 shrink-0 text-indigo-500" />
                  Lead status set to <span className="font-medium">{lead.status}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ActivityIcon size={14} className="mt-0.5 shrink-0 text-indigo-500" />
                  Assigned to {lead.manager}
                </li>
                <li className="flex items-start gap-2">
                  <ActivityIcon size={14} className="mt-0.5 shrink-0 text-indigo-500" />
                  Captured from {lead.source} on {lead.date}
                </li>
              </ul>
            )}

            {activeTab === 'Deals' && (
              <div className="space-y-3">
                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Handshake size={14} className="text-emerald-500" />
                    {lead.company} - Onboarding Package
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Estimated value: ${(lead.score * 1250).toLocaleString()} - Stage: {lead.status}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'Docs' && (
              <ul className="space-y-2 text-sm text-slate-600">
                {['Discovery Notes.pdf', 'Proposal Draft.docx', 'Signed Contract.pdf'].map((doc) => (
                  <li
                    key={doc}
                    className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2"
                  >
                    <FileText size={14} className="text-slate-400" /> {doc}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* composer */}
        {activeTab === 'Notes' && (
          <div className="border-t border-slate-100 p-3">
            <div className="flex items-end gap-2 rounded-xl border border-slate-200 px-3 py-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendNote()
                }}
                placeholder="Write a note..."
                className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <div className="flex items-center gap-1.5 text-slate-300">
                <Paperclip size={15} />
                <Mic size={15} />
                <AtSign size={15} />
                <Share2 size={15} />
              </div>
              <button
                onClick={sendNote}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white hover:bg-orange-600"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        title={`Schedule a Call with ${lead.name}`}
        footer={
          <>
            <button
              onClick={() => setScheduleOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmSchedule}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Confirm Call
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Date</label>
            <input
              type="date"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Time</label>
            <input
              type="time"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Profile"
        footer={
          <>
            <button
              onClick={() => setEditOpen(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </>
        }
      >
        <div className="space-y-3">
          {['name', 'company', 'email', 'phone'].map((field) => (
            <div key={field}>
              <label className="mb-1 block text-xs font-medium capitalize text-slate-500">
                {field}
              </label>
              <input
                value={form[field]}
                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300"
              />
            </div>
          ))}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
            >
              {['HOT', 'OPEN', 'NEW', 'QUALIFIED', 'IN PROGRESS', 'PENDING'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default CustomerProfilePanel
