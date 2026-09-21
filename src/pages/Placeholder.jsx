import { Construction } from 'lucide-react'

function Placeholder({ title, description }) {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-12 text-center lg:min-h-screen">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
        <Construction size={26} />
      </div>
      <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        {description || `${title} is on our roadmap and isn't built out yet in this preview.`}
      </p>
    </main>
  )
}

export default Placeholder
