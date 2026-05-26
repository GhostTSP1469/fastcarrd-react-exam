export function Switch({
  checked,
  onCheckedChange,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <button
      type="button"
      className={`h-7 w-12 rounded-full border border-neutral-300 p-1 transition dark:border-neutral-700 ${
        checked ? 'bg-neutral-900 dark:bg-white' : 'bg-neutral-200 dark:bg-neutral-800'
      }`}
      onClick={() => onCheckedChange(!checked)}
      aria-pressed={checked}
    >
      <span
        className={`block h-5 w-5 rounded-full bg-white transition dark:bg-neutral-950 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
