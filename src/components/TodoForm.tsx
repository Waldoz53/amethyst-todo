import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';

interface TodoFormProps {
  input: string;
  setInput: (value: string) => void;
  onAdd: () => void;
  dueInHours: number;
  setDueInHours: (value: number) => void;
}

export default function TodoForm({
  input,
  setInput,
  onAdd,
  dueInHours,
  setDueInHours,
}: TodoFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="input-container">
        <label htmlFor="task">Task Name:</label>
        <input
          name="task"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="input-container">
        <label htmlFor="due">Task Time:</label>
        <input
          name="due"
          type="number"
          min={1}
          value={dueInHours}
          onChange={(e) => setDueInHours(parseInt(e.target.value))}
        />
      </div>

      <button type="submit" title="Or press Enter!">
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </form>
  );
}
