import { useState } from 'react'

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
            text: todo
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
