import { useState } from "react";
import Quadrant from "./components/Quadrant";
import TaskForm from "./components/TaskForm";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  const quadrants = [
    { title: "Do First", important: true, urgent: true, color: "red" },
    { title: "Schedule", important: true, urgent: false, color: "blue" },
    { title: "Delegate", important: false, urgent: true, color: "orange" },
    { title: "Eliminate", important: false, urgent: false, color: "gray" },
  ];

  const filterTasks = (isImportant, isUrgent) => {
    return tasks.filter(
      (t) => t.important === isImportant && t.urgent === isUrgent,
    );
  };

  const addTask = (text, important, urgent) => {
    const newTask = {
      id: Date.now(), // Simple way to generate a unique ID
      text,
      important,
      urgent,
      completed: false,
    };

    setTasks([...tasks, newTask]);
  };

  return (
    <>
      <div className="app-container">
        <div>
          <TaskForm onAdd={addTask} />
        </div>

        <div className="matrix-grid">
          {quadrants.map((q) => (
            <Quadrant
              key={q.title}
              title={q.title}
              tasks={filterTasks(q.important, q.urgent)}
              themeColor={q.color}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
