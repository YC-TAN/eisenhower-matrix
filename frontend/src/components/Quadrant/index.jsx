import "./Quadrant.css";
import TaskItem from "./TaskItem";

const Quadrant = ({ config, tasks }) => {
  const { label, action, cssVarBg, cssVarBorder, cssVarText } =
    config;
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
            //   onComplete={onComplete}
            //   onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Quadrant;
