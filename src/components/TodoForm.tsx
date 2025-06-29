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
      <button onClick={onAdd}>+</button>
    </section>
  )
}