import { useRef, useState } from 'react'
import { ImagePlus, Trash2, Upload } from 'lucide-react'
import MetricTile from '../components/MetricTile'
import PageHeader from '../components/PageHeader'
import Panel from '../components/Panel'
import { useToast } from '../hooks/useToast'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { addDocument, removeDocument } from '../utils/firestoreCrud'
import { compressImageToDataUrl } from '../utils/imageCompression'
import { formatTimestamp } from '../utils/jobPortalHelpers'
import { newspapers } from '../data/jobPortalData'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function NewspaperUploads() {
  const { showToast } = useToast()
  const { items: uploads, loading } = useFirestoreCollection('newspaperUploads', { orderByField: 'createdAt' })

  const [newspaper, setNewspaper] = useState(newspapers[0])
  const [date, setDate] = useState(todayISO())
  const [caption, setCaption] = useState('')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [filterNewspaper, setFilterNewspaper] = useState('all')
  const [deletingId, setDeletingId] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      showToast('Please choose an image file (JPG or PNG).', 'info')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      showToast('Image is too large — please choose a file under 10MB.', 'info')
      return
    }
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  const resetForm = () => {
    setCaption('')
    setFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUpload = async () => {
    if (!file) return showToast('Choose an image to upload first.', 'info')

    setUploading(true)
    try {
      const imageUrl = await compressImageToDataUrl(file)

      await addDocument('newspaperUploads', {
        newspaper,
        date,
        caption: caption.trim() || null,
        imageUrl,
      })

      showToast(`${newspaper} page uploaded — now visible on the website.`)
      resetForm()
    } catch (err) {
      showToast(err.message || 'Upload failed. Please try again.', 'info')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (upload) => {
    setDeletingId(upload.id)
    try {
      await removeDocument('newspaperUploads', upload.id)
      showToast('Newspaper page removed.')
    } catch (err) {
      showToast(err.message || 'Could not remove this upload.', 'info')
    } finally {
      setDeletingId(null)
    }
  }

  const visibleUploads = uploads.filter((u) => filterNewspaper === 'all' || u.newspaper === filterNewspaper)
  const countsByPaper = newspapers.reduce((acc, n) => {
    acc[n] = uploads.filter((u) => u.newspaper === n).length
    return acc
  }, {})

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <PageHeader
        eyebrow="Super Admin"
        title="Newspaper Pages"
        description="Upload photos/scans of actual newspaper job pages — they show on the website's Newspapers gallery, organized by newspaper."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricTile icon={ImagePlus} label="Total Pages" value={loading ? '—' : uploads.length} tone="indigo" />
        <MetricTile icon={ImagePlus} label="Dawn" value={loading ? '—' : countsByPaper.Dawn} tone="emerald" />
        <MetricTile icon={ImagePlus} label="Jang" value={loading ? '—' : countsByPaper.Jang} tone="orange" />
      </div>

      <Panel title="Upload a Newspaper Page">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Newspaper
            </label>
            <select
              value={newspaper}
              onChange={(e) => setNewspaper(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
            >
              {newspapers.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Caption (optional)
            </label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Page 14 — Situations Vacant"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-300"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Image
            </label>
            <div className="flex items-center gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex h-24 w-24 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-indigo-300"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <ImagePlus className="text-slate-400" size={24} />
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <div className="text-sm text-slate-500">
                {file ? file.name : 'JPG or PNG, up to 10MB — compressed automatically to fit the database.'}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-5 flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
        >
          <Upload size={15} />
          {uploading ? 'Uploading…' : 'Upload Page'}
        </button>
      </Panel>

      <div className="mt-6">
        <Panel
          title="Uploaded Pages"
          description={`Showing ${visibleUploads.length} of ${uploads.length}`}
          action={
            <select
              value={filterNewspaper}
              onChange={(e) => setFilterNewspaper(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-indigo-300"
            >
              <option value="all">All Newspapers</option>
              {newspapers.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          }
        >
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-400">Loading…</p>
          ) : visibleUploads.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No newspaper pages uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {visibleUploads.map((u) => (
                <div key={u.id} className="overflow-hidden rounded-xl border border-slate-100">
                  <img src={u.imageUrl} alt={u.caption || u.newspaper} className="h-40 w-full object-cover" />
                  <div className="p-3">
                    <p className="text-xs font-semibold text-slate-700">{u.newspaper}</p>
                    <p className="text-xs text-slate-400">{u.date || formatTimestamp(u.createdAt)}</p>
                    {u.caption && <p className="mt-1 truncate text-xs text-slate-500">{u.caption}</p>}
                    <button
                      onClick={() => handleDelete(u)}
                      disabled={deletingId === u.id}
                      className="mt-2 flex items-center gap-1 text-xs font-semibold text-rose-500 hover:underline disabled:opacity-50"
                    >
                      <Trash2 size={12} /> {deletingId === u.id ? 'Removing…' : 'Remove'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </main>
  )
}

export default NewspaperUploads
