import { useState } from "react";
import { v1 as uuid } from 'uuid'

import MatrixPage from "./pages/MatrixPage";
import { MOCK_TASKS } from "./utils/mockTasks";

function App() {
  const [tasks, setTasks] = useState(MOCK_TASKS);

  const addTask = (taskObj) => {
    const {task, important, urgent} = taskObj;
    const newTask = {
      id: uuid(),
      task, 
      urgent,
      important,
      status: 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null
    }
    setTasks([...tasks, newTask]);
  };

  return (
    <>
      <div className="app-main">
        <MatrixPage 
          tasks={tasks}
          onAdd={addTask}
        />
      </div>
    </>
  );
}

export default App;
