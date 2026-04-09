import { useState, useRef, useEffect } from "react";

import { useTaskContext } from "../../context/UseTaskContext";
import { formatDate } from "../../utils/helpers";
import TaskEditForm from "./TaskEditForm";
import "./TaskItem.css";

const UNDO_DELAY = 4000;

export default function TaskItem({ 
  task, 
  isEditing, 
  onEdit, 
  onCancelEdit 
}) {
  const { updateTask } = useTaskContext();

  // States
  const [pendingAction, setPendingAction] = useState(null); // 'completing' | 'deleting' | null
  // const [isEditing, setIsEditing] = useState(false);
  const timerRef = useRef(null);

  // Boolean helper to disable buttons
  const isBusy = pendingAction !== null;

  // Cancel timer on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  function startAction(action) {
    // action: "completing" | "deleting"
    setPendingAction(action);
    timerRef.current = setTimeout(() => {
      updateTask(task.id, {
        status: action === "completing" ? "completed" : "deleted",
      });
    }, UNDO_DELAY);
  }

  function handleUndo() {
    clearTimeout(timerRef.current);
    setPendingAction(null);
  }

  const handleSave = (newText) => { 
   if (newText !== task.text) {
      updateTask(task.id, { text: newText });
    }
    onCancelEdit();
  }

  // Edit View
  if (isEditing) {
    return (
      <li className="task-item task-item--editing">
        <TaskEditForm 
          initialText={task.text} 
          onSave={handleSave}
          onCancel={onCancelEdit}
        />
      </li>
    );
  }

  return (
    <li className={`task-item${isBusy ? ' task-item--acting' : ''}`}>
      <div className="task-item-body">
        <span 
        className={`task-item-text ${isBusy? "struck" : ""}`} 
        onClick={() => !isBusy && onEdit()}>
          <span className="task-item-date">
            {formatDate(task.createdAt)}
          </span>
          {" " + task.text}
        </span>
        {isBusy && (
          <div className="task-item-undo-row">
            <button className="task-item-undo" onClick={handleUndo}>
              Undo
            </button>
          </div>
        )}
        {!isBusy && (
          <>
            <button
              className="task-item-cb"
              onClick={() => startAction("completing")}
              aria-label="Mark task as complete"
              title={"Mark completed"}
            >
              <span className="task-item-cb-box">
                <svg
                  className="task-item-cb-check"
                  viewBox="0 0 9 9"
                  fill="none"
                >
                  <path
                    d="M1.5 4.5l2.5 2.5 4-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <button
              className="task-item-delete"
              onClick={() => startAction("deleting")}
              title="Delete task"
              aria-label="Delete task"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1.5 1.5l8 8M9.5 1.5l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            </>       
          )
        }
        
      </div>
    </li>
  );
}
