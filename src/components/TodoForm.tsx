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

export default function TodoForm({ input, setInput, onAdd, dueInHours, setDueInHours }: TodoFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="form">
      <div className="input-container">
        <label htmlFor="task">Task name:</label>
        <input
          name="task"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onAdd()}
        />
      </div>

      <div className="input-container">
        <label htmlFor="due">Due in (hours):</label>
        <input
          name="due"
          type="number"
          min={1}
          value={dueInHours}
          onChange={(e) => setDueInHours(parseInt(e.target.value))}
          onKeyDown={(e) => e.key === 'Enter' && onAdd()}
        />
      </div>

      <button onClick={onAdd}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </section>
  );
}
