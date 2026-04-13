/**
 * Manages "where" notes live.
 * - Creates the Context and the Provider wrapper.
 * - Uses the logic hook to "broadcast" state to the entire app tree.
 * - Prevents "prop drilling" by making the engine's output global.
 */

import { TaskContext } from "./useTaskContext";
import { useTasks } from "../hooks/useTasks";
import { initialTasks } from "../data/mockTasks_v1";

export const TaskProvider = ({ children }) => {
  const taskState = useTasks(initialTasks);

  return (
    <TaskContext.Provider value={taskState}>
        {children}
    </TaskContext.Provider>
  );
};