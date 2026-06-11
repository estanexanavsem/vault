import { ChevronRight } from 'lucide-react'

export function DownloadAppCard() {
  return (
    <button className="download-app-card" type="button">
      <span>Thanks for banking with Truist.</span>
      <strong>Download the app</strong>
      <ChevronRight size={18} aria-hidden="true" />
    </button>
  )
}
