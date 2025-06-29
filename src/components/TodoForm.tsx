import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRef } from "react"

interface TodoFormProps {
  input: string,
  setInput: (value: string) => void,
  onAdd: () => void
}

export default function TodoForm({ input, setInput, onAdd }: TodoFormProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <section className="form">
      <input
        ref={inputRef}
        type="text"
        value={input}
        placeholder="Add an item"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onAdd()}
      />
      <button onClick={onAdd}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </section>
  )
}