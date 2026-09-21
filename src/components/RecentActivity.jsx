import { MoreHorizontal } from 'lucide-react'
import Avatar from './Avatar'

const activity = [
  { name: 'Arlene McCoy', address: '6391 Elgin St. Celina, Delaware....' },
  { name: 'Ralph Edwards', address: '2464 Royal Ln. Mesa, New Jersey,,' },
  { name: 'Dianne Russell', address: '4140 Parker Rd. Allentown, New,,,' },
  { name: 'Jane Cooper', address: '1901 Thornridge Cir. Shiloh,,,' },
  { name: 'Jane Cooper', address: '1901 Thornridge Cir. Shiloh,,,' },
  { name: 'Brooklyn Simmons', address: '4517 Washington Ave. Manchester,,,' },
  { name: 'Arlene McCoy', address: '6391 Elgin St. Celina, Delaware....' },
  { name: 'Brooklyn Simmons', address: '4517 Washington Ave. Manchester,,,' },
]

function RecentActivity() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">Recent Activity</h3>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <ul className="divide-y divide-slate-100">
        {activity.map((person, i) => (
          <li key={i} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
            <Avatar name={person.name} size={44} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{person.name}</p>
              <p className="truncate text-xs text-slate-400">{person.address}</p>
            </div>
            <button className="shrink-0 rounded-lg bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-100">
              Cancel
            </button>
            <button className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default RecentActivity
