function ProgressBar({ value, color = 'bg-indigo-500', track = 'bg-slate-100' }) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full ${track}`}>
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  )
}

export default ProgressBar
