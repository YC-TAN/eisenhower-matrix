import { beforeEach, vi, afterEach } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

import { TasksProvider } from './src/context/TaskContext'

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup()
})

const customRender = (ui, options) =>
  render(ui, { wrapper: TasksProvider, ...options });

// 3. Export everything from RTL + our custom render
export * from '@testing-library/react';
export { customRender as render };