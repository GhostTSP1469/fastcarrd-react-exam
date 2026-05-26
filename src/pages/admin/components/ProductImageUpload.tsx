import { Upload } from 'lucide-react'

export function ProductImageUpload({
  files,
  onFiles,
}: {
  files: FileList | null
  onFiles: (files: FileList | null) => void
}) {
  const selectedFiles = Array.from(files ?? [])

  return (
    <article className="admin-card admin-form-card">
      <h2>Images</h2>
      <label className="admin-upload">
        <Upload size={28} />
        <span>Drop your images here</span>
        <small>PNG, JPG, WEBP up to 10 files</small>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={(event) => onFiles(event.target.files)}
        />
      </label>
      <div className="admin-upload-note">
        {selectedFiles.length ? `${selectedFiles.length} images selected` : 'No new image selected'}
      </div>
      {selectedFiles.length ? (
        <ul className="mt-3 grid gap-2 text-sm text-slate-500">
          {selectedFiles.map((file) => (
            <li key={`${file.name}-${file.size}`} className="truncate rounded-lg bg-slate-50 px-3 py-2">
              {file.name}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
