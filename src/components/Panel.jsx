function Panel({ title, description, action, children, className = '' }) {
  return (
    <section className={`rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 ${className}`}>
      {(title || description || action) && (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            {title && <h2 className="text-base font-semibold text-slate-800">{title}</h2>}
            {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  )
}

export default Panel
