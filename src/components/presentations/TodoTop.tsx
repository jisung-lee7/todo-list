import { useState } from 'react'
import { ChangeEvent, FC } from 'react'

interface TodoTopProps {
  addTodo: (title: string, description: string) => void
  editing: boolean
}

export const TodoTop: FC<TodoTopProps> = ({ addTodo, editing }) => {
  const [todoTitle, setTodoTitle] = useState<string>('')
  const [todoDescription, setTodoDescription] = useState<string>('')

  const handleTodoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value)
  }

  const handleTodoDescriptionChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setTodoDescription(event.target.value)
  }

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <input
        type="text"
        value={todoTitle}
        onChange={handleTodoChange}
        disabled={editing}
      />

      <input
        type="text"
        value={todoDescription}
        onChange={handleTodoDescriptionChange}
        disabled={editing}
      />
      <button
        onClick={() => {
          addTodo(todoTitle, todoDescription)
          setTodoTitle('')
          setTodoDescription('')
        }}
        disabled={editing}
      >
        add
      </button>
    </div>
  )
}
