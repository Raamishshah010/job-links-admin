import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  ChevronsUpDown,
  ChevronDown,
  ChevronUp,
  Plus,
  MoreHorizontal,
  LogOut,
  Settings,
  X,
} from 'lucide-react'
import Avatar from './Avatar'
import { useAuth } from '../hooks/useAuth'
import {
  salesOperations,
  jobPortal,
  insightsManagement,
  support,
} from '../data/navData'

function NavItem({ icon: Icon, label, path, badge, onNavigate }) {
  return (
    <li>
      <NavLink
        to={path}
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
            isActive
              ? 'bg-indigo-50 text-indigo-600 font-semibold'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
          }`
        }
      >
        <Icon size={18} strokeWidth={1.8} />
        <span className="flex-1 text-left">{label}</span>
        {badge ? (
          <span className="rounded-md bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
            {badge}
          </span>
        ) : null}
      </NavLink>
    </li>
  )
}

function CollapsibleGroup({ title, defaultOpen = false, children, onAdd }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-600"
      >
        <span className="flex-1 text-left">{title}</span>
        {onAdd && (
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation()
              onAdd()
            }}
            className="rounded-md p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <Plus size={13} />
          </span>
        )}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && <div className="mt-1">{children}</div>}
    </div>
  )
}

function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const displayName = user?.name || 'Aiden Hudson'
  const displayEmail = user?.email || 'ahudson@gmail.com'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const content = (
    <>
      {/* Logo / workspace switcher */}
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
          JL
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold leading-tight text-slate-800">
            Job Links
          </p>
          {/* <p className="truncate text-xs text-slate-400">Free Workflow</p> */}
        </div>
        <button className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
          <ChevronsUpDown size={16} />
        </button>
        <button
          onClick={onClose}
          className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* Search */}
      {/* <button
        onClick={onSearchClick}
        className="mb-6 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-400 hover:border-slate-300"
      >
        <Search size={16} className="text-slate-400" />
        <span className="flex-1 text-left">Search</span>
        <kbd className="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
          /
        </kbd>
      </button> */}

      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto pb-4">
        <div>
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Sales Operations
          </p>
          <ul className="space-y-1">
            {salesOperations.map((item) => (
              <NavItem key={item.label} {...item} onNavigate={onClose} />
            ))}
          </ul>
        </div>

        <CollapsibleGroup title="Super Admin" defaultOpen>
          <ul className="space-y-1">
            {jobPortal.map((item) => (
              <NavItem key={item.label} {...item} onNavigate={onClose} />
            ))}
          </ul>
        </CollapsibleGroup>

        <CollapsibleGroup title="Insights & Management">
          <ul className="space-y-1">
            {insightsManagement.map((item) => (
              <NavItem key={item.label} {...item} onNavigate={onClose} />
            ))}
          </ul>
        </CollapsibleGroup>

        {/* <CollapsibleGroup
          title="Workspaces"
          defaultOpen
          onAdd={() => navigate('/workspaces/new')}
        >
          <ul className="space-y-1">
            {workspaces.map((ws) => (
              <li key={ws.label}>
                <NavLink
                  to={ws.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 font-semibold'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`
                  }
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: ws.dot }}
                  />
                  <span className="flex-1 text-left">{ws.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </CollapsibleGroup> */}

        {/* <CollapsibleGroup title="Productivity">
          <ul className="space-y-1">
            {productivity.map((item) => (
              <NavItem key={item.label} {...item} onNavigate={onClose} />
            ))}
          </ul>
        </CollapsibleGroup> */}

        <div className="h-px bg-slate-100" />

        <div>
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Support
          </p>
          <ul className="space-y-1">
            {support.map((item) => (
              <NavItem key={item.label} {...item} onNavigate={onClose} />
            ))}
          </ul>
        </div>
      </nav>

      {/* User profile */}
      <div className="relative mt-2 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2.5 px-2">
          <div className="relative shrink-0">
            <Avatar name={displayName} size={38} />
            <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight text-slate-800">
              {displayName}
            </p>
            <p className="truncate text-xs text-slate-400">{displayEmail}</p>
          </div>
          <button
            onClick={() => setProfileMenuOpen((v) => !v)}
            className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>

        {profileMenuOpen && (
          <div className="absolute bottom-14 left-2 right-2 z-10 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg">
            <button
              onClick={() => {
                setProfileMenuOpen(false)
                onClose?.()
                navigate('/settings')
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <Settings size={16} /> Account settings
            </button>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-500 hover:bg-rose-50"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col overflow-visible border-r border-slate-100 bg-white px-4 py-6 lg:flex">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col overflow-y-auto bg-white px-4 py-6 shadow-xl">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}

export default Sidebar