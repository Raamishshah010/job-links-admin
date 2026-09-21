import {
  LayoutDashboard,
  Users,
  MessageSquare,
  LineChart,
  ClipboardList,
  MessagesSquare,
  HelpCircle,
  Settings,
  Building2,
  Briefcase,
  Megaphone,
  CreditCard,
  Image,
} from 'lucide-react'

export const salesOperations = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  // { icon: UserPlus, label: 'Leads', path: '/leads' },
  // { icon: PackageSearch, label: 'Orders', path: '/orders' },
  // { icon: Users, label: 'Customers', path: '/customers' },
  { icon: MessageSquare, label: 'Messages', path: '/messages', badge: 4 },
]

export const jobPortal = [
  { icon: LayoutDashboard, label: 'Overview', path: '/job-portal' },
  { icon: Building2, label: 'Companies', path: '/job-portal/companies' },
  { icon: Briefcase, label: 'Job Listings', path: '/job-portal/jobs' },
  { icon: Megaphone, label: 'Advertisements', path: '/job-portal/ads' },
  { icon: CreditCard, label: 'Subscriptions', path: '/job-portal/subscriptions' },
  { icon: Users, label: 'Job Seekers', path: '/job-portal/job-seekers' },
  { icon: Image, label: 'Newspaper Pages', path: '/job-portal/newspapers' },
]

export const insightsManagement = [
  { icon: LineChart, label: 'Performance', path: '/insights/performance' },
  { icon: ClipboardList, label: 'Reports', path: '/insights/reports' },
]

export const workspaces = [
  // { label: 'Sales', path: '/workspaces/sales', dot: '#f97316' },
  // { label: 'Account Management', path: '/workspaces/account-management', dot: '#f97316' },
  // { label: 'Support & Success', path: '/workspaces/support-success', dot: '#eab308' },
]

export const productivity = [
  // { icon: ListTodo, label: 'Tasks', path: '/productivity/tasks' },
  // { icon: CalendarDays, label: 'Calendar', path: '/productivity/calendar' },
]

export const support = [
  { icon: MessagesSquare, label: 'Feedback', path: '/feedback', badge: 1 },
  { icon: HelpCircle, label: 'Help Center', path: '/help' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]