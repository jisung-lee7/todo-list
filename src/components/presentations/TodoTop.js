import { useState } from 'react'
import { v1 as uuidv1 } from 'uuid'

function TodoTop({ addTodo, editing }) {
  const [todo, setTodo] = useState('')
  const handleChange = (event) => {
    setTodo(event.target.value)
  }

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <input
        type="text"
        value={todo}
        onChange={handleChange}
        disabled={editing}
      />
      <button
        onClick={() => {
          addTodo({
            id: uuidv1(),
            text: todo,
            editing: false,
            archived: false,
            activated: false
          })
          setTodo('')
        }}
        disabled={editing}
      >
        add
      </button>
    </div>
  )
}

export default TodoTop
