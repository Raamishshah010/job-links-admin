function StatCard({ icon: Icon, iconBg, iconColor, label, value, barColor, barTrack, percent }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={20} style={{ color: iconColor }} strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: barTrack }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${percent}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  )
}

export default StatCard
