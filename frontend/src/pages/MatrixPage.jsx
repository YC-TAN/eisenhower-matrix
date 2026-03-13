import TaskForm from "../components/TaskForm";
import Quadrant from "../components/Quadrant";
import { QUADRANTS } from "../constants/quadrants";
import './MatrixPage.css';

export default function MatrixPage({ tasks, onAdd }) {
  const pendingTasks = tasks.filter((t) => t.status === 'pending')

  return (
    <div className="matrix-page">
      <div className="matrix-page-heading">
        <h1 className="matrix-page-title">
            Eisenhower Matrix
        </h1>
        <p className="matrix-page-subtitle">
          Organize tasks by urgency and importance
        </p>
      </div>

      <TaskForm onAdd={onAdd} />

      <div className="matrix-grid">
        {QUADRANTS.map((config) => {
          const filtered = pendingTasks.filter(
            (t) => t.urgent === config.urgent && t.important === config.important
          )
          return (
            <Quadrant
              key={config.id}
              config={config}
              tasks={filtered}
            //   onComplete={completeTask}
            //   onDelete={deleteTask}
            />
          )
        })}
      </div>
    </div>
  )
}
