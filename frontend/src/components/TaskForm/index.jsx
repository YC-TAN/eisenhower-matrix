import { useState } from "react";
import './TaskForm.css'

const TaskForm = ({ onAdd }) => {
  const [task, setTask] = useState("");
  const [important, setImportant] = useState(false);
  const [urgent, setUrgent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return; // Don't add empty tasks

    onAdd({
      task,
      important,
      urgent,
      completed: false,
    });

    // Reset form
    setTask("");
    setImportant(false);
    setUrgent(false);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="input-row">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={task}
          maxLength={200}
          onChange={(e) => setTask(e.target.value)}
        />
        <button type="submit" className="task-form-btn">
          Add
        </button>
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
            → {urgent && important ? 'Q1 · Do First' :
               !urgent && important ? 'Q2 · Schedule' :
               urgent && !important ? 'Q3 · Delegate' :
               'Q4 · Eliminate'}
          </span>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
