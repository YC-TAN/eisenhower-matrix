/**
 * Formats an ISO timestamp to a short readable date string.
 * e.g. "13 Mar 2026"
 *
 * @param {string} isoString
 * @returns {string}
 */
export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
