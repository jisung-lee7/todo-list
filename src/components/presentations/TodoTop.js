import { useState } from 'react'
import { v1 as uuidv1 } from 'uuid'

function TodoTop({ addTodo }) {
  const [todo, setTodo] = useState('')
  const handleChange = (event) => {
    setTodo(event.target.value)
  }

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <input type="text" value={todo} onChange={handleChange} />

      <button
        onClick={() => {
          addTodo({ id: uuidv1(), text: todo })
          setTodo('')
        }}
      >
        add
      </button>
    </div>
  )
}

export default TodoTop
