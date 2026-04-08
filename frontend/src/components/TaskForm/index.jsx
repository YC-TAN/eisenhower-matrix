import { useState } from "react";

import { useTaskContext } from '../../context/UseTaskContext'
import { useNotificationActions } from "../../stores/useNotification";
import "./TaskForm.css";

const TaskForm = () => {
  const { addTask } = useTaskContext();
  const [text, setText] = useState("");
  const [important, setImportant] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const {setNotification} = useNotificationActions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return; // Don't add empty tasks

    addTask({
      text,
      important,
      urgent,
    });

    setNotification({
      message: `New Task '${text}' added`,
      type: 'success'
    })

    // Reset form
    setText("");
    setImportant(false);
    setUrgent(false);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div>
      <div className="input-row">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={text}
          maxLength={200}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="task-form-btn">
          Add
        </button>
      </div>
      <span className="error"></span>

      </div>

      <div className="task-form-flags">
        <label className="task-form-flag">
          <input
            type="checkbox"
            checked={important}
            onChange={(e) => setImportant(e.target.checked)}
          />
          Important
        </label>

        <label className="task-form-flag">
          <input
            type="checkbox"
            checked={urgent}
            onChange={(e) => setUrgent(e.target.checked)}
          />
          Urgent
        </label>

        {(urgent || important) && (
          <span className="task-form-preview">
            →{" "}
            {urgent && important
              ? "Q1 · Do First"
              : !urgent && important
                ? "Q2 · Schedule"
                : urgent && !important
                  ? "Q3 · Delegate"
                  : "Q4 · Eliminate"}
          </span>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
