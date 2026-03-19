import { TaskContext } from "./UseTaskContext";
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