import { useState, useEffect, FC, ChangeEvent, KeyboardEvent } from 'react'

interface TodoItemProps {
  id: number
  title: string
  description: string
  deleteTodo: (id: number) => void
  editing: boolean
  changeEditingStatus: (id: number) => void
  toggleArchiveStatus: (id: number, archived: boolean) => void
  toggleCompleteStatus: (id: number, completed: boolean) => void
  cancelTodo: (id: number) => void
  confirmTodo: (
    id: number,
    editingTodo: string,
    editingDescription: string
  ) => void
  archived: boolean
  completed: boolean
}

export const TodoItem: FC<TodoItemProps> = ({
  id,
  title,
  description,
  deleteTodo,
  editing,
  changeEditingStatus,
  toggleArchiveStatus,
  toggleCompleteStatus,
  cancelTodo,
  confirmTodo,
  archived,
  completed
}) => {
  const [editingTodo, setEditingTodo] = useState<string>('')
  const [editingDescription, setEditingDescription] = useState<string>('')

  const handleArchive = () => {
    toggleArchiveStatus(id, archived)
  }

  const handleConfirm = () => {
    confirmTodo(id, editingTodo, editingDescription)
  }

  const handleDelete = () => {
    deleteTodo(id)
  }

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingTodo(event.target.value)
  }

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingDescription(event.target.value)
  }

  const handleComplete = () => {
    toggleCompleteStatus(id, completed)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
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

  useEffect(() => {
    if (!editing) {
      setEditingTodo(title)
      setEditingDescription(description)
    }
  }, [editing, title, description])

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      {editing ? (
        <div>
          <input
            type="text"
            value={editingTodo}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
          />
          <input
            type="text"
            value={editingDescription}
            onChange={handleDescriptionChange}
            onKeyDown={handleKeyDown}
          />
        </div>
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
            {title} - {description}
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
