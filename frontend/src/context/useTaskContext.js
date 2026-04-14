/**
 * The interface that manages "how" components access the data.
 * - A hook that abstracts the useContext call.
 * - Provides a clean API for components: const { tasks } = useTaskContext().
 * - Includes a safety check to ensure it's used within a Provider.
 */

import { createContext, useContext } from "react";

export const TaskContext = createContext()

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};