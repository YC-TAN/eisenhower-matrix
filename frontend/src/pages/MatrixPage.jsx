import {useState} from 'react'

import TaskForm from "../components/TaskForm";
import Quadrant from "../components/Quadrant";
import { QUADRANTS } from "../constants/matrixConfig";
import { useTaskContext } from "../context/useTaskContext";
import "./MatrixPage.css";

export default function MatrixPage() {
  const { pendingTasks } = useTaskContext();
  const [editingTaskId, setEditingTaskId] = useState(null);

  return (
    <div className="matrix-page">
      <div className="matrix-page-heading">
        <h1 className="matrix-page-title">Eisenhower Matrix</h1>
        <p className="matrix-page-subtitle">
          Organize tasks by urgency and importance
        </p>
      </div>

      <TaskForm onFocus={() => setEditingTaskId(null)} />

      <div className="matrix-grid">
        {QUADRANTS.map((config) => {
          const filtered = pendingTasks.filter(
            (t) =>
              t.urgent === config.urgent && t.important === config.important,
          );
          return (
            <Quadrant
              key={config.id}
              config={config}
              tasks={filtered}
              editingTaskId={editingTaskId}
              onEdit={(id) => setEditingTaskId(id)}
              onCancelEdit={() => setEditingTaskId(null)}
            />
          );
        })}
      </div>
    </div>
  );
}
