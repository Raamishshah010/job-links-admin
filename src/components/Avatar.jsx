const palette = [
  'bg-rose-100 text-rose-600',
  'bg-indigo-100 text-indigo-600',
  'bg-amber-100 text-amber-600',
  'bg-emerald-100 text-emerald-600',
  'bg-sky-100 text-sky-600',
  'bg-fuchsia-100 text-fuchsia-600',
]

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function hashIndex(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return Math.abs(hash) % palette.length
}

function Avatar({ name, size = 44 }) {
  const colorClass = palette[hashIndex(name)]
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${colorClass}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </div>
  )
}

export default Avatar
