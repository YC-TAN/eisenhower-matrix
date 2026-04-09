import {useState} from 'react'

import "./Quadrant.css";
import TaskItem from "./TaskItem";

const Quadrant = ({ config, tasks }) => {
  const { label, action, cssVarBg, cssVarBorder, cssVarText } = config;
  // To track which tesk is being edited, one task at a time
  const [editingId, setEditingId] = useState(null);

  return (
    <div
      className="quadrant-card"
      style={{
        background: `var(${cssVarBg})`,
        borderColor: `var(${cssVarBorder})`,
        color: `var(${cssVarText})`,
      }}
    >
      <div className="quadrant-card-header">
        <div className="quadrant-card-label">
          <span
            className="quadrant-card-dot"
            style={{ background: `var(${cssVarBorder})` }}
          />
          {label}
        </div>
        <span className="quadrant-card-action">{action}</span>
        <span className="quadrant-card-count">{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <p className="quadrant-card-empty">No tasks here</p>
      ) : (
        <ul className="quadrant-card-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isEditing={editingId === task.id}
              onEdit={() => setEditingId(task.id)}
              onCancelEdit={() => setEditingId(null)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Quadrant;
