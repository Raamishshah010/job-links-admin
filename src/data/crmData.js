export const customers = [
  {
    id: 'c-1',
    name: 'Emma Johansson',
    company: 'Nordic Soft AB',
    email: 'emma@nordicsoft.io',
    segment: 'Enterprise',
    health: 92,
    value: '$48,200',
    owner: 'Olivia Davis',
    renewal: 'Feb 14, 2026',
    status: 'Growing',
  },
  {
    id: 'c-2',
    name: 'William Lee',
    company: 'AI Dynamics',
    email: 'w.lee@aidynamics.com',
    segment: 'Mid-Market',
    health: 81,
    value: '$31,750',
    owner: 'James Smith',
    renewal: 'Mar 03, 2026',
    status: 'Active',
  },
  {
    id: 'c-3',
    name: 'Sophia Martinez',
    company: 'EcoTech Solutions',
    email: 'sophia@ecotech.io',
    segment: 'Startup',
    health: 74,
    value: '$18,940',
    owner: 'Noah Garcia',
    renewal: 'Apr 19, 2026',
    status: 'Onboarding',
  },
  {
    id: 'c-4',
    name: 'David Ramirez',
    company: 'IronGate Logistics',
    email: 'david@irongatelogistics.com',
    segment: 'Enterprise',
    health: 63,
    value: '$42,100',
    owner: 'Jacob Muller',
    renewal: 'May 10, 2026',
    status: 'Needs Attention',
  },
]

export const orders = [
  {
    id: 'ORD-1048',
    customer: 'Nordic Soft AB',
    owner: 'Olivia Davis',
    package: 'Enterprise CRM rollout',
    value: '$18,400',
    stage: 'Fulfillment',
    due: 'Jan 12, 2026',
    progress: 68,
  },
  {
    id: 'ORD-1049',
    customer: 'AI Dynamics',
    owner: 'James Smith',
    package: 'Automation add-on',
    value: '$7,950',
    stage: 'Legal Review',
    due: 'Jan 16, 2026',
    progress: 45,
  },
  {
    id: 'ORD-1050',
    customer: 'EcoTech Solutions',
    owner: 'Noah Garcia',
    package: 'Support success bundle',
    value: '$5,600',
    stage: 'Provisioning',
    due: 'Jan 20, 2026',
    progress: 32,
  },
  {
    id: 'ORD-1051',
    customer: 'Travel Ventures',
    owner: 'Mia Brown',
    package: 'Data migration sprint',
    value: '$11,250',
    stage: 'Ready to Invoice',
    due: 'Jan 24, 2026',
    progress: 88,
  },
]

export const conversations = [
  {
    id: 'm-1',
    from: 'Emma Johansson',
    company: 'Nordic Soft AB',
    subject: 'Rollout timeline confirmation',
    preview: 'The leadership team approved the phased launch plan. Can we confirm Feb 2?',
    channel: 'Email',
    time: '9:24 AM',
    unread: true,
  },
  {
    id: 'm-2',
    from: 'David Ramirez',
    company: 'IronGate Logistics',
    subject: 'Billing contact update',
    preview: 'Please add Nina Patel to invoices and renewal notices going forward.',
    channel: 'Chat',
    time: '10:12 AM',
    unread: true,
  },
  {
    id: 'm-3',
    from: 'Sophia Martinez',
    company: 'EcoTech Solutions',
    subject: 'Onboarding workspace',
    preview: 'The onboarding checklist looks good. We added two admins this morning.',
    channel: 'Email',
    time: 'Yesterday',
    unread: false,
  },
]

export const tasks = [
  { id: 't-1', title: 'Send final proposal to AI Dynamics', owner: 'James Smith', due: 'Today', status: 'Today', priority: 'High' },
  { id: 't-2', title: 'Confirm migration fields with Nordic Soft', owner: 'Olivia Davis', due: 'Tomorrow', status: 'Today', priority: 'High' },
  { id: 't-3', title: 'Prepare renewal risk notes', owner: 'Jacob Muller', due: 'Jan 8', status: 'This Week', priority: 'Medium' },
  { id: 't-4', title: 'Review open feedback themes', owner: 'Zoe Lewis', due: 'Jan 10', status: 'This Week', priority: 'Medium' },
  { id: 't-5', title: 'Archive closed demo requests', owner: 'Aiden Hudson', due: 'Jan 12', status: 'Backlog', priority: 'Low' },
]

export const calendarEvents = [
  { time: '09:00', title: 'Pipeline standup', owner: 'Sales team', type: 'Internal' },
  { time: '10:30', title: 'Nordic Soft launch review', owner: 'Emma Johansson', type: 'Customer' },
  { time: '13:00', title: 'Support handoff', owner: 'Success team', type: 'Internal' },
  { time: '15:30', title: 'AI Dynamics procurement call', owner: 'William Lee', type: 'Customer' },
]

export const reports = [
  { name: 'Pipeline Forecast', owner: 'Aiden Hudson', cadence: 'Weekly', updated: '2 hours ago', status: 'Ready' },
  { name: 'Lead Source ROI', owner: 'Zoe Lewis', cadence: 'Monthly', updated: 'Yesterday', status: 'Ready' },
  { name: 'Renewal Risk', owner: 'Jacob Muller', cadence: 'Daily', updated: 'Today', status: 'Draft' },
  { name: 'Team Activity', owner: 'Olivia Davis', cadence: 'Weekly', updated: 'Jan 2', status: 'Ready' },
]

export const feedback = [
  { id: 'FB-88', customer: 'EcoTech Solutions', theme: 'Import mapping', sentiment: 'Positive', status: 'Triaged' },
  { id: 'FB-89', customer: 'IronGate Logistics', theme: 'Renewal reminders', sentiment: 'Neutral', status: 'In Review' },
  { id: 'FB-90', customer: 'AI Dynamics', theme: 'Report exports', sentiment: 'Positive', status: 'Planned' },
  { id: 'FB-91', customer: 'Travel Ventures', theme: 'Mobile table view', sentiment: 'Negative', status: 'Escalated' },
]

export const workspaceCards = {
  sales: [
    { title: 'Inbound qualification', value: '42 leads', detail: '12 need same-day follow-up', progress: 72 },
    { title: 'Proposal lane', value: '$96K', detail: '5 proposals awaiting approval', progress: 54 },
    { title: 'Closed won', value: '$214K', detail: '83% of quarterly target', progress: 83 },
  ],
  account: [
    { title: 'Renewals in motion', value: '14 accounts', detail: '$182K under review', progress: 64 },
    { title: 'Expansion plays', value: '9 accounts', detail: '3 executive sponsors engaged', progress: 48 },
    { title: 'Health watchlist', value: '6 accounts', detail: '2 urgent outreach tasks', progress: 36 },
  ],
  support: [
    { title: 'Open success cases', value: '27 cases', detail: 'Median first response 38m', progress: 69 },
    { title: 'At-risk customers', value: '4 accounts', detail: 'All have owners assigned', progress: 44 },
    { title: 'Knowledge gaps', value: '11 topics', detail: '5 articles drafted', progress: 52 },
  ],
}

export const performanceSeries = [
  { month: 'Jan', pipeline: 120, won: 72, churn: 18 },
  { month: 'Feb', pipeline: 132, won: 86, churn: 15 },
  { month: 'Mar', pipeline: 141, won: 92, churn: 12 },
  { month: 'Apr', pipeline: 156, won: 101, churn: 14 },
  { month: 'May', pipeline: 168, won: 118, churn: 10 },
  { month: 'Jun', pipeline: 184, won: 126, churn: 8 },
]
