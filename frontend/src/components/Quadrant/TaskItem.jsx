import { useState, useRef, useEffect } from "react";

import { useTaskContext } from "../../context/UseTaskContext";
import { formatDate } from "../../utils/helpers";
import "./TaskItem.css";

const UNDO_DELAY = 4000;

export default function TaskItem({ task }) {
  const { updateTask } = useTaskContext();

  // States
  const [pendingAction, setPendingAction] = useState(null); // 'completing' | 'deleting' | null
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // Boolean helper to disable buttons
  const isBusy = pendingAction !== null;

  // Sync draftText when task.text changes externally
  // useEffect(() => {
  //   if (!isEditing) {
  //     setEditText(task.text);
  //   }
  // }, [task.text, isEditing]);

  // Focus + select input on edit open
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

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

  function handleConfirmEdit() {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== task.text) {
      updateTask(task.id, { text: trimmed });
    } else {
      setEditText(task.text);
    }
    setIsEditing(false);
  }

  function handleEditKeyDown(e) {
    if (e.key === "Enter") handleConfirmEdit();
    if (e.key === "Escape") {
      setEditText(task.text);
      setIsEditing(false);
    }
  }
  return (
    <li
      className={`task-item${isBusy ? " task-item--acting" : ""}${isEditing ? " task-item--editing" : ""}`}
    >
      {/* ── Editing mode — input only, everything else hidden ── */}
      {isEditing ? (
        <input
          ref={inputRef}
          className="task-item-edit-input"
          value={editText}
          maxLength={200}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleConfirmEdit}
          onKeyDown={handleEditKeyDown}
        />
      ) : (
        <>
          {/* ── Checkbox — hidden while an action is pending ── */}
          {/* {!isBusy && (
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
          )} */}

          {/* ── Body ── */}
          <div className="task-item-body">
            <span
              className={`task-item-text${isBusy ? " task-item-text--struck" : ""}`}
              onClick={() => !isBusy && setIsEditing(true)}
              title={isBusy ? undefined : 'Click to edit'}
            >
              <span className="task-item-date">
                {formatDate(task.createdAt)}
              </span>{" "}
              {task.text}
            </span>   
            {isBusy && (
              <div className="task-item-undo-row">
                <button className="task-item-undo" onClick={handleUndo}>
                  Undo
                </button>
              </div>
            )}         
          </div>
          
          {/* ── Delete — hidden while an action is pending ── */}
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
            
          )}
        </>
      )}
    </li>
  );
}
