import { useEffect, FC, ChangeEvent, KeyboardEvent, Dispatch } from 'react'
import { modalTypes } from '../../constants/modal'

interface TodoItemProps {
  id: number
  title: string
  description: string
  editing: boolean
  editingTodo: string
  setEditingTodo: Dispatch<React.SetStateAction<string>>
  editingDescription: string
  setEditingDescription: Dispatch<React.SetStateAction<string>>
  changeEditingStatus: (id: number) => void
  toggleCompleteStatus: (id: number, completed: boolean) => void
  cancelTodo: (id: number) => void
  confirmTodo: (
    id: number,
    editingTodo: string,
    editingDescription: string
  ) => void
  archived: boolean
  completed: boolean
  openModal: (id: number, type: string) => void
}

export const TodoItem: FC<TodoItemProps> = ({
  id,
  title,
  description,
  editing,
  editingTodo,
  setEditingTodo,
  editingDescription,
  setEditingDescription,
  cancelTodo,
  confirmTodo,
  changeEditingStatus,
  toggleCompleteStatus,
  archived,
  completed,
  openModal
}) => {
  const handleComplete = () => {
    toggleCompleteStatus(id, completed)
  }

  const handleArchive = () => {
    if (!archived) {
      openModal(id, modalTypes.ARCHIVE)
    } else {
      openModal(id, modalTypes.UNARCHIVE)
    }
  }

  const handleConfirm = () => {
    confirmTodo(id, editingTodo, editingDescription)
  }

  const handleDelete = () => {
    openModal(id, modalTypes.DELETE)
  }

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingTodo(event.target.value)
  }

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditingDescription(event.target.value)
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
      <>
        <input type="checkbox" checked={completed} onChange={handleComplete} />
        <div
          style={{
            textDecoration: completed ? 'line-through' : '',
            opacity: archived ? '0.3' : ''
          }}
        >
          {title} - {description}
        </div>
      </>

      {!archived && (
        <button onClick={() => changeEditingStatus(id)}>edit</button>
      )}

      <button onClick={handleArchive}>
        {!archived ? 'archive' : 'unarchive'}
      </button>

      {archived && <button onClick={handleDelete}>delete</button>}
    </div>
  )
}
