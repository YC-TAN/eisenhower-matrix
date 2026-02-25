import { useState } from "react";

const TaskForm = ({ onAdd }) => {
  const [text, setText] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) return; // Don't add empty tasks

    onAdd(text, isImportant, isUrgent);

    // Reset form
    setText("");
    setIsImportant(false);
    setIsUrgent(false);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
      />
      <div>
        <label>
          <input
            type="checkbox"
            checked={isImportant}
            onChange={(e) => setIsImportant(e.target.checked)}
          />
          Important
        </label>

        <label>
          <input
            type="checkbox"
            checked={isUrgent}
            onChange={(e) => setIsUrgent(e.target.checked)}
          />
          Urgent
        </label>

        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default TaskForm;
