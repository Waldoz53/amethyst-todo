import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type TodoItem = {
  text: string,
  completed: boolean,
  createdAt: string
}

interface TodoItemProps {
  item: TodoItem
  index: number,
  onRemove: (index: number) => void
  onToggle: (index: number) => void
}

export default function TodoItem({ item, index, onRemove, onToggle }: TodoItemProps) {

  return (
    <div className={`item ${item.completed ? 'completed' : ''}`} onClick={() => onToggle(index)}>
      <p className="line-clamp">{item.text}</p>
      <div className="spacer"></div>
      <button onClick={(e) => {
        e.stopPropagation()
        onRemove(index)
        }}>
        <FontAwesomeIcon icon={faTrash}/>
      </button>
    </div>
  )
}