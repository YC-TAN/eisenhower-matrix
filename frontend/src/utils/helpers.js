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

export function validateTaskText(text) {
  const trimmed = text.trim();
  if (!trimmed) return 'Task text is required.';
  if (trimmed.length > 200) return 'Task cannot be longer than 200 characters.';
  return '';
}