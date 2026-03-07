/**
 * Formats a date/time value for display with date on top and time below.
 * Returns JSX suitable for table cells and other UI.
 * @param {string|Date|null|undefined} val - ISO date string, Date, or null/undefined
 * @returns {JSX.Element|string} Formatted JSX or '-' for empty/invalid values
 */
export function formatDateTime(val) {
  if (val == null || val === '') return '-'
  const d = new Date(val)
  if (Number.isNaN(d.getTime())) return '-'
  const date = d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const time = d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  return (
    <span className="flex flex-col items-center gap-0.5">
      <span>{date}</span>
      <span className="text-neutral-500 text-xs">{time}</span>
    </span>
  )
}
