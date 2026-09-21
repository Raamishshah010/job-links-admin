import { useCallback, useState } from 'react'
import { CheckCircle2, Info, X } from 'lucide-react'
import { ToastContext } from './toast-context'

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message, variant = 'success') => {
      const id = ++idCounter
      setToasts((prev) => [...prev, { id, message, variant }])
      setTimeout(() => dismiss(id), 3500)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed top-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-lg ring-1 ring-black/5 animate-[fadeIn_0.2s_ease-out]"
          >
            {t.variant === 'success' ? (
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />
            ) : (
              <Info size={18} className="mt-0.5 shrink-0 text-indigo-500" />
            )}
            <p className="flex-1 text-sm text-slate-700">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-slate-300 hover:text-slate-500"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
