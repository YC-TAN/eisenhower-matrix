import { useRef, useEffect, useState } from "react";
import { validateTaskText } from "../../utils/helpers";
import './TaskEditForm.css'

const TaskEditForm = ({ initialText, onSave, onCancel }) => {
  const [text, setText] = useState(initialText);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleChange = (e) => {
    const changes = e.target.value;
    const err = validateTaskText(changes);
    setText(changes);
    setError(err);
  };

  const handleBlur = () => {
    const err = validateTaskText(text);
    if (!err) {
      onSave(text.trim());
    } else {
      setError(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBlur();
    if (e.key === "Escape") onCancel();
  };

  return (
    <>
      <input
        ref={inputRef}
        className="task-item-edit-input"
        value={text}
        minLength={4}
        maxLength={200}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {error 
        ? <span className="error">{error}</span>
        : <span className="info">Press the <kbd>Esc</kbd> or <kbd>Tab</kbd> key to cancel editing</span>
      }
    </>
  );
};

export default TaskEditForm;
