const generateId = () => crypto.randomUUID();

export const initialTasks = [
  // Q1: Do First (Important & Urgent)
  {
    id: generateId(),
    text: "Fix production server crash",
    important: true,
    urgent: true,
    status: 'pending',
    createdAt: new Date().toISOString(),
    completedAt: null
  },
  {
    id: generateId(),
    text: "Submit tax returns (Deadline Today!)",
    important: true,
    urgent: true,
    status: 'pending',
    createdAt: new Date().toISOString(),
    completedAt: null
  },

  // Q2: Schedule (Important & Not Urgent)
  {
    id: generateId(),
    text: "Weekly gym session",
    important: true,
    urgent: false,
    status: 'pending',
    createdAt: new Date().toISOString(),
    completedAt: null
  },
  {
    id: generateId(),
    text: "Research new React 19 features",
    important: true,
    urgent: false,
    status: 'pending',
    createdAt: new Date().toISOString(),
    completedAt: null
  },

  // Q3: Delegate (Not Important & Urgent)
  {
    id: generateId(),
    text: "Respond to non-critical emails",
    important: false,
    urgent: true,
    status: 'pending',
    createdAt: new Date().toISOString(),
    completedAt: null
  },
  {
    id: generateId(),
    text: "Book flight for summer vacation",
    important: false,
    urgent: true,
    status: 'pending',
    createdAt: new Date().toISOString(),
    completedAt: null
  },

  // Q4: Eliminate (Not Important & Not Urgent)
  {
    id: generateId(),
    text: "Organize digital desktop icons",
    important: false,
    urgent: false,
    status: 'pending',
    createdAt: new Date().toISOString(),
    completedAt: null
  },

  // Completed Task (History/Archive)
  {
    id: generateId(),
    text: "Buy groceries",
    important: true,
    urgent: true,
    status: 'completed',
    createdAt: "2026-03-18T10:00:00.000Z",
    completedAt: "2026-03-18T14:30:00.000Z"
  }
];