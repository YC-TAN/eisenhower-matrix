# Eisenhower Matrix — React PWA

A minimal task management PWA based on the Eisenhower Matrix, organize tasks by urgency and importance. Works offline and is installable as a PWA.

![Eisenhower Matrix App](./public/screenshot.png)

👉 [Live demo](https://yc-tan.github.io/eisenhower-matrix/)

---

## Tech Stack

- React 19
- Vite
- Zustand (notification state only)
- Vitest + React Testing Library
- vite-plugin-pwa

---

## Prerequisites

- Node.js 24+
- npm 11+

---

## Installation

```bash
git clone https://github.com/yc-tan/todoMatrix.git
cd todoMatrix/frontend
npm install
```

---

## Development

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run test suite |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Build and deploy to GitHub Pages |

---

## Project Structure

```
src/
├── components/
│   ├── Notification/           # Toast notification UI
│   ├── TaskForm/               # Add task input with urgent/important toggles
│   └── Quadrant/               # Quadrant card, task list, and task actions
│       ├── index.jsx
│       ├── TaskEditForm.jsx    # Inline edit input (pure controlled component)
│       └── TaskItem.jsx        # Single task row with complete/delete/undo
├── context/
│   ├── TaskContext.jsx         # TaskProvider — wraps app, delivery only
│   └── useTaskContext.js
├── data/
│   └── mockTask_v1.js          # Seed tasks for first-time load
├── hooks/
│   └── useTasks.js             # Core task state, localStorage sync
├── pages/
│   └── MatrixPage.jsx          # Matrix layout, owns editingTaskId UI state
├── stores/
│   └── useNotification.js      # Notification state outside TaskProvider
└── utils/
    └── helpers.js              # validateTaskText, formatDate
public/
├── pwa-192x192.png
├── pwa-512x512.png
├── favicon.ico
└── apple-touch-icon.png
```

---

## Data Structure

Tasks are stored in localStorage under the key `matrix_tasks` as a JSON array.

### Task shape

```js
{
  id: string,           // crypto.randomUUID()
  text: string,
  urgent: boolean,
  important: boolean,
  status: 'pending' | 'completed' | 'deleted',
  createdAt: string,    // ISO 8601
  completedAt: string | null,
  updatedAt: string
}
```

### Quadrant derivation

Quadrant is never stored on the task — it is always derived:

| urgent | important | Quadrant |
|---|---|---|
| true | true | Do First |
| false | true | Schedule |
| true | false | Delegate |
| false | false | Eliminate |

---

## Architecture Decisions

- **No backend** — all state lives in localStorage. No accounts, no sync.
- **Minimal state library usage** — Zustand is only used for notification state (`useNotification.js`), which lives outside `TaskProvider`. All task state uses `useState`/`useEffect` only.

---

## Running Tests

```bash
npm run test
```

Tests use Vitest + React Testing Library. Integration tests wrap components in the real `TaskProvider`. Timer-dependent tests use `fireEvent` over `userEvent` to avoid fake timer conflicts.

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Submit a PR against `main`

---

## Roadmap

- [ ] History view for completed tasks
- [ ] Trash bin for deleted tasks
- [ ] CI/CD pipelines
- [ ] Drag and drop between quadrants (dnd-kit)
- [ ] Sortable within quadrant
- [ ] PWA update prompt
- [ ] CI/CD pipelines 