import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { formatTimeLeft } from "../utils/formatTimeLeft"

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
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const update = () => {
      const created = new Date(item.createdAt).getTime()
      const due = created + 60 * 60 * 1000
      const now = Date.now()
      setTimeLeft(formatTimeLeft(due - now))
    }

    update();
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [item.createdAt])

  return (
    <div className={`item ${item.completed ? 'completed' : ''}`} onClick={() => onToggle(index)}>
      <p className="line-clamp"><strong className={timeLeft == "Due Now!" ? "overdue" : ""}>{timeLeft}</strong>{item.text}</p>
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