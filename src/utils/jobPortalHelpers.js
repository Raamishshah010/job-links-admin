// Shared helpers for reconciling the richer employer-job-posting shape this
// admin panel was built around with the thinner shape the public website's
// newspaper scraper writes into the same Firestore `jobs` collection.

export function formatTimestamp(value) {
  const date = value && typeof value.toDate === 'function' ? value.toDate() : null
  if (!date) return null
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

// A user's subscription only counts as active if its expiry date (if any)
// hasn't passed yet — status alone can go stale between the website's own
// self-correcting check-ins, so anywhere we count "active subscribers"
// should use this rather than a bare status === 'active' check.
export function isSubscriptionActive(subscription) {
  if (!subscription || subscription.status !== 'active') return false
  const expires = subscription.expiresAt && typeof subscription.expiresAt.toDate === 'function'
    ? subscription.expiresAt.toDate()
    : null
  return !expires || expires.getTime() > Date.now()
}

export function normalizeJob(job) {
  return {
    applicants: 0,
    shortlisted: 0,
    views: 0,
    vacancies: 1,
    salaryMin: 0,
    salaryMax: 0,
    category: job.newspaper ? 'Newspaper Listing' : 'General',
    type: 'Full-time',
    workMode: 'On-site',
    experienceLevel: 'Not specified',
    education: 'Not specified',
    featured: false,
    responsibilities: [],
    requirements: [],
    skills: [],
    benefits: [],
    company: job.newspaper || 'Unknown',
    posted: formatTimestamp(job.createdAt) || '—',
    deadline: job.deadline || '—',
    status: job.status || 'Active',
    source: job.source || 'scraped',
    ...job,
  }
}
