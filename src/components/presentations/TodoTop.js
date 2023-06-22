import { useState } from 'react'

function TodoTop({ addTodo, editing }) {
  const [todo, setTodo] = useState('')
  const [todoDescription, setTodoDescription] = useState('')
  const handleTodoChange = (event) => {
    setTodo(event.target.value)
  }

  const handleTodoDescriptionChange = (event) => {
    setTodoDescription(event.target.value)
  }
  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <input
        type="text"
        value={todo}
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
          addTodo({
            title: todo,
            description: todoDescription
          })
          setTodo('')
          setTodoDescription('')
        }}
        disabled={editing}
      >
        add
      </button>
    </div>
  )
}

export default TodoTop
