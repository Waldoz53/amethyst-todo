interface TodoItemProps {
  item: string,
  index: number,
  onRemove: (index: number) => void
}

export default function TodoItem({ item, index, onRemove }: TodoItemProps) {

  return (
    <div className="item" key={index}>
      <p className="line-clamp">{item}</p>
      <div className="spacer"></div>
      <button onClick={() => onRemove(index)}>Delete</button>
    </div>
  )
}