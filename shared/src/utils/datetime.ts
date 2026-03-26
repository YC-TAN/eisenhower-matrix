import { z } from 'zod'

// Normalises incoming values before Zod validates them.
const datePreprocessor = (val: unknown) => {
  if (val === undefined || val === null || val === '') return undefined
  if (typeof val !== 'string') return val
  const timestamp = Date.parse(val)
  if (isNaN(timestamp)) return val
  return val
}

// 10s buffer accounts for network latency and clock drift between devices.
// Important for offline-first sync where client timestamps may lag slightly.
const CLOCK_DRIFT_BUFFER_MS = 10000

export const nonFutureDatetime = z.preprocess(
  datePreprocessor,
  z.string().datetime({ message: 'Date must be a valid ISO datetime' }).refine(
    (val) => new Date(val) <= new Date(Date.now() + CLOCK_DRIFT_BUFFER_MS),
    { message: 'Date cannot be in the future' }
  )
)