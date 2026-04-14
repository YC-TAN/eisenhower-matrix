import { useState } from "react";

import { useTaskContext } from "../../context/useTaskContext";
import { useNotificationActions } from "../../stores/useNotification";
import { validateTaskText } from "../../utils/helpers";
import "./TaskForm.css";

const TaskForm = ({ onFocus }) => {
  const { addTask } = useTaskContext();
  const [text, setText] = useState("");
  const [important, setImportant] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [error, setError] = useState("");
  const { setNotification } = useNotificationActions();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateTaskText(text);
    if (error) {
      setError(error);
      return;
    }

    const trimmed = text.trim();

    addTask({
      text: trimmed,
      important,
      urgent,
    });

    setNotification({
      message: `New Task '${trimmed}' added`,
      type: "success",
    });

    // Reset form
    setText("");
    setImportant(false);
    setUrgent(false);
    setError("");
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    if (error) setError(""); // remove error message if present
  };

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={onFocus}
      className="task-form"
      noValidate
    >
      <div className="input-row">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={text}
          minLength={4}
          maxLength={200}
          onChange={handleTextChange}
          aria-invalid={error ? "true" : "false"} // active when there is error
          aria-describedby={error ? "input-error" : undefined} // point to the error message id
        />
        <button type="submit" className="task-form-btn">
          Add
        </button>
      </div>
      {error && (
        <p
          className="task-form-error"
          id="input-error"
          role="alert" // announce error on screen reader
          aria-live="polite"
        >
          {error}
        </p>
      )}

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
