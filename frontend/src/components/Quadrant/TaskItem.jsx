import { formatDate } from "../../utils/helpers";
import "./TaskItem.css";

export default function TaskItem({ task }) {
  return (
    <li className="task-item">
      {/* <button
        className="task-item-complete"
        onClick={() => onComplete(task.id)}
        title="Mark complete"
        aria-label="Mark task as complete"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M4 7l2.5 2.5L10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button> */}

      <div className="task-item-body">
        <span className="task-item-date">{formatDate(task.createdAt)}</span>
        <span className="task-item-text">{task.task}</span>        
      </div>

      {/* <button
        className="task-item-delete"
        onClick={() => onDelete(task.id)}
        title="Delete task"
        aria-label="Delete task"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button> */}
    </li>
  );
}
