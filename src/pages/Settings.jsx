import { Bell, CreditCard, Save, Shield, User, Users } from 'lucide-react'
import Avatar from '../components/Avatar'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { useAuth } from '../hooks/useAuth'

function Settings() {
  const { user } = useAuth()
  const name = user?.name || 'Aiden Hudson'
  const email = user?.email || 'ahudson@gmail.com'

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Admin"
        title="Settings"
        description="Manage profile details, workspace preferences, notifications, security, and billing readiness."
      >
        <button className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-orange-600">
          <Save size={15} /> Save Changes
        </button>
      </PageHeader>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <MetricTile icon={User} label="Profile" value="Ready" detail="Public details complete" tone="emerald" />
        <MetricTile icon={Users} label="Team Seats" value="18" detail="4 admins" tone="indigo" />
        <MetricTile icon={Shield} label="Security" value="Strong" detail="2FA recommended" tone="orange" />
        <MetricTile icon={CreditCard} label="Plan" value="Business" detail="Renews Feb 2026" tone="sky" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Panel title="Profile" description="Visible to teammates and shared workspaces">
          <div className="mb-5 flex items-center gap-4">
            <Avatar name={name} size={58} />
            <div>
              <p className="font-semibold text-slate-800">{name}</p>
              <p className="text-sm text-slate-500">{email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Full name</label>
              <input defaultValue={name} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Email</label>
              <input defaultValue={email} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Role</label>
              <input defaultValue="Sales Operations Manager" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-300" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Timezone</label>
              <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300">
                <option>Asia/Karachi</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
              </select>
            </div>
          </div>
        </Panel>

        <Panel title="Notifications" description="Choose what needs your attention">
          <div className="space-y-3">
            {[
              ['Lead assigned', true],
              ['Order blocked', true],
              ['Weekly digest', true],
              ['Product updates', false],
            ].map(([label, enabled]) => (
              <label key={label} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Bell size={15} className="text-slate-400" /> {label}
                </span>
                <input type="checkbox" defaultChecked={enabled} className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
              </label>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  )
}

export default Settings
