import { useState, useEffect } from 'react'

function TodoItem({
  id,
  text,
  deleteTodo,
  editing,
  changeEditingStatus,
  toggleArchiveStatus,
  toggleCompleteStatus,
  cancelTodo,
  confirmTodo,
  archived,
  completed
}) {
  const [editingTodo, setEditingTodo] = useState('')
  useEffect(() => {
    if (!editing) {
      setEditingTodo(text)
    }
  }, [editing, text])

  const handleArchive = () => {
    toggleArchiveStatus(id, archived)
  }

  const handleConfirm = () => {
    confirmTodo(id, editingTodo)
  }

  const handleDelete = () => {
    deleteTodo(id)
  }

  const handleChange = (event) => {
    setEditingTodo(event.target.value)
  }

  const handleComplete = () => {
    toggleCompleteStatus(id, completed)
  }

  const handleKeyDown = (event) => {
    const key = event.code
    switch (key) {
      case 'Enter':
      case 'NumpadEnter':
        handleConfirm()
        break

      case 'Escape':
        cancelTodo(id)
        break

      default:
    }
  }

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      {editing ? (
        <input
          type="text"
          value={editingTodo}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <>
          <input
            type="checkbox"
            checked={completed}
            onChange={handleComplete}
          />
          <div
            style={{
              textDecoration: completed ? 'line-through' : '',
              opacity: archived ? '0.3' : ''
            }}
          >
            {text}
          </div>
        </>
      )}

      {!archived && !editing && (
        <button onClick={() => changeEditingStatus(id)}>edit</button>
      )}

      {!editing && (
        <button onClick={handleArchive}>
          {!archived ? 'archive' : 'unarchive'}
        </button>
      )}

      {archived && <button onClick={handleDelete}>delete</button>}

      {editing && (
        <>
          <button onClick={handleConfirm}>confirm</button>
          <button onClick={() => cancelTodo(id)}>cancel</button>
        </>
      )}
    </div>
  )
}

export default TodoItem
