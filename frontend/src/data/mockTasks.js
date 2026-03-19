/**
 * Mock tasks for development and testing.
 *
 * @type {import('../types/task').Task[]}
 */
export const MOCK_TASKS = [

  // ─── Q1 · Do First — Urgent + Important ──────────────────────
  {
    id: '1',
    task: 'Fix broken layout on MatrixPage after last CSS change',
    urgent: true,
    important: true,
    status: 'pending',
    createdAt: '2026-03-13T07:30:00.000Z',
    completedAt: null,
  },
  {
    id: '2',
    task: 'Understand the JavaScript event loop before next project',
    urgent: true,
    important: true,
    status: 'pending',
    createdAt: '2026-03-12T09:00:00.000Z',
    completedAt: null,
  },
  {
    id: '3',
    task: 'Debug useState not triggering re-render in TaskForm',
    urgent: true,
    important: true,
    status: 'pending',
    createdAt: '2026-03-13T08:15:00.000Z',
    completedAt: null,
  },

  // ─── Q2 · Schedule — Not Urgent + Important ──────────────────
  {
    id: '4',
    task: 'Learn how useEffect dependency array actually works',
    urgent: false,
    important: true,
    status: 'pending',
    createdAt: '2026-03-11T10:00:00.000Z',
    completedAt: null,
  },
  {
    id: '5',
    task: 'Study Big O notation and common algorithm complexities',
    urgent: false,
    important: true,
    status: 'pending',
    createdAt: '2026-03-10T14:00:00.000Z',
    completedAt: null,
  },
  {
    id: '6',
    task: 'Build a small project using React Router to solidify routing concepts',
    urgent: false,
    important: true,
    status: 'pending',
    createdAt: '2026-03-09T11:30:00.000Z',
    completedAt: null,
  },
  {
    id: '7',
    task: 'Understand the difference between SQL and NoSQL databases',
    urgent: false,
    important: true,
    status: 'pending',
    createdAt: '2026-03-08T09:00:00.000Z',
    completedAt: null,
  },

  // ─── Q3 · Delegate — Urgent + Not Important ──────────────────
  {
    id: '8',
    task: 'Watch intro video on TypeScript before team discussion',
    urgent: true,
    important: false,
    status: 'pending',
    createdAt: '2026-03-13T06:45:00.000Z',
    completedAt: null,
  },
  {
    id: '9',
    task: 'Skim CSS Grid vs Flexbox article linked in Slack',
    urgent: true,
    important: false,
    status: 'pending',
    createdAt: '2026-03-12T16:30:00.000Z',
    completedAt: null,
  },

  // ─── Q4 · Eliminate — Not Urgent + Not Important ─────────────
  {
    id: '10',
    task: 'Read every page of the Webpack documentation',
    urgent: false,
    important: false,
    status: 'pending',
    createdAt: '2026-03-07T12:00:00.000Z',
    completedAt: null,
  },
  {
    id: '11',
    task: 'Memorise every HTTP status code',
    urgent: false,
    important: false,
    status: 'pending',
    createdAt: '2026-03-06T10:00:00.000Z',
    completedAt: null,
  },

  // ─── Completed — for History page testing ────────────────────
  {
    id: '12',
    task: 'Understand how the DOM works and how React differs',
    urgent: true,
    important: true,
    status: 'completed',
    createdAt: '2026-02-01T09:00:00.000Z',
    completedAt: '2026-02-03T14:00:00.000Z',
  },
  {
    id: '13',
    task: 'Complete JavaScript array methods practice — map, filter, reduce',
    urgent: false,
    important: true,
    status: 'completed',
    createdAt: '2026-02-05T10:00:00.000Z',
    completedAt: '2026-02-07T16:30:00.000Z',
  },
  {
    id: '14',
    task: 'Set up first React project with Vite from scratch',
    urgent: true,
    important: true,
    status: 'completed',
    createdAt: '2026-02-10T08:00:00.000Z',
    completedAt: '2026-02-10T11:00:00.000Z',
  },
  {
    id: '15',
    task: 'Learn CSS Flexbox by rebuilding a navbar layout',
    urgent: false,
    important: true,
    status: 'completed',
    createdAt: '2026-02-15T13:00:00.000Z',
    completedAt: '2026-02-18T17:00:00.000Z',
  },
  {
    id: '16',
    task: 'Understand props vs state — when to use which',
    urgent: true,
    important: true,
    status: 'completed',
    createdAt: '2026-03-01T09:00:00.000Z',
    completedAt: '2026-03-02T15:00:00.000Z',
  },
  {
    id: '17',
    task: 'Practice destructuring objects and arrays in JS',
    urgent: false,
    important: true,
    status: 'completed',
    createdAt: '2026-03-03T10:00:00.000Z',
    completedAt: '2026-03-05T12:00:00.000Z',
  },
  {
    id: '18',
    task: 'Read MDN article on how localStorage works',
    urgent: false,
    important: true,
    status: 'completed',
    createdAt: '2026-03-06T09:00:00.000Z',
    completedAt: '2026-03-06T11:30:00.000Z',
  },
]