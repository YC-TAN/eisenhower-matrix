import { beforeEach, vi, afterEach } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

import { TaskProvider } from './src/context/TaskContext'

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup()
})

// For integration test
const customRender = (ui, options) =>
  render(ui, { wrapper: TaskProvider, ...options });

export * from '@testing-library/react';
export { customRender as render };