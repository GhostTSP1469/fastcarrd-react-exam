import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className="mt-12 flex items-center justify-center gap-3" aria-label="Pagination">
      <button
        type="button"
        className="inline-flex h-10 min-w-10 items-center justify-center rounded border border-[#d0d0d0] bg-white px-3 text-[#111] disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={18} />
      </button>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          className={cn(
            'inline-flex h-10 min-w-10 items-center justify-center rounded border border-[#d0d0d0] bg-white px-3 text-[#111] dark:border-neutral-700 dark:bg-neutral-900 dark:text-white',
            item === page && 'border-[#db4444] bg-[#db4444] text-white dark:border-[#db4444] dark:bg-[#db4444]',
          )}
          onClick={() => onPageChange(item)}
        >
          {item}
        </button>
      ))}
      <button
        type="button"
        className="inline-flex h-10 min-w-10 items-center justify-center rounded border border-[#d0d0d0] bg-white px-3 text-[#111] disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  )
}
