import { z } from 'zod'

// 10s buffer accounts for network latency and clock drift between devices.
// Important for offline-first sync where client timestamps may lag slightly.
const CLOCK_DRIFT_BUFFER_MS = 10000

export const nonFutureDatetime = z.iso
    .datetime({ message: 'Date must be a valid ISO datetime' })
    // Converts ISO strings to Date objects for Mongoose compatibility and type-safe date arithmetic.
    .pipe(z.coerce.date())
    .refine(
      (date) => date <= new Date(Date.now() + CLOCK_DRIFT_BUFFER_MS),
      { message: 'Date cannot be in the future' }
    )