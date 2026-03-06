/**
 * Loading spinner for Suspense fallback.
 */

export function Spinner() {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-neutral-200 border-t-red-600 rounded-full animate-spin" />
    </div>
  )
}
