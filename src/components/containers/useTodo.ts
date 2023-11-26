import { useEffect, useState } from 'react'
import { modalTypes } from '../../constants/modal'
import { todoHttpReqHandler } from '../../http-handlers/todo'
import { Todo } from '../../types/todo'

export const useTodo = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [editingTodo, setEditingTodo] = useState<string>('')
  const [editingDescription, setEditingDescription] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalData, setModalData] = useState<{
    id: number
    type: string
    title: string
    body: string
  } | null>(null)

  const editing = todos.some((todo) => todo.editing === true)

  const addTodo = (title: string, description: string) => {
    todoHttpReqHandler.add(title, description).then((todo) => {
      setTodos([...todos, todo])
    })
  }

  const toggleCompleteStatus = (id: number, completed: boolean) => {
    todoHttpReqHandler
      .update(id, { completed: !completed })
      .then((updateTodo) => {
        setTodos((todos) =>
          todos.map((todo) => {
            if (todo.id === id) {
              return updateTodo
            }
            return todo
          })
        )
      })
  }

  const changeEditingStatus = (id: number) => {
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, editing: !todo.editing }
        }

        if (todo.editing === true) {
          return { ...todo, editing: false }
        }

        return todo
      })
    )
    openModal(id, modalTypes.EDIT)
  }

  const openModal = (id: number, type: string) => {
    if (type === modalTypes.ARCHIVE) {
      setModalData({
        id: id,
        type: type,
        title: 'Archive',
        body: 'Are you sure you want to archive? '
      })
      setIsModalOpen(true)
    } else if (type === modalTypes.UNARCHIVE) {
      setModalData({
        id: id,
        type: type,
        title: 'Unarchive',
        body: 'Are you sure you want to unarchive? '
      })
      setIsModalOpen(true)
    } else if (type === modalTypes.DELETE) {
      setModalData({
        id: id,
        type: type,
        title: 'Delete',
        body: 'Are you sure you want to delete? '
      })
      setIsModalOpen(true)
    } else if (type === modalTypes.EDIT) {
      setModalData({
        id: id,
        type: type,
        title: 'EDIT',
        body: 'Are you sure you want to edit? '
      })
      setIsModalOpen(true)
    }
  }

  const confirmTodo = async (
    id: number,
    editingTodo: string,
    editingDescription: string
  ) => {
    return todoHttpReqHandler
      .update(id, { title: editingTodo, description: editingDescription })
      .then((updatedTodo) => {
        setTodos((todos) =>
          todos.map((todo) => {
            if (todo.id === id) {
              return updatedTodo
            }

            return todo
          })
        )
      })
  }

  const cancelTodo = (id: number) => {
    setTodos((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, editing: false } : todo))
    )
  }

  const confirmModalCallback = async () => {
    try {
      if (modalData?.type === modalTypes.ARCHIVE) {
        await changeArchiveStatus(modalData.id, false)
      } else if (modalData?.type === modalTypes.UNARCHIVE) {
        await changeArchiveStatus(modalData.id, true)
      } else if (modalData?.type === modalTypes.DELETE) {
        await deleteTodo(modalData.id)
      } else if (modalData?.type === modalTypes.EDIT) {
        confirmTodo(modalData.id, editingTodo, editingDescription)
        todos.map((todo) => (todo.editing = false))
      }
      setModalData(null)
      setIsModalOpen(false)
    } catch (err) {
      alert('Err')
    }
  }

  const cancelModalCallback = () => {
    setModalData(null)
    setIsModalOpen(false)

    todos.map((todo) => (todo.editing = false))
  }

  const changeArchiveStatus = async (id: number, archived: boolean) => {
    return todoHttpReqHandler
      .update(id, { archived: !archived })
      .then((updateTodo) => {
        setTodos((todos) =>
          todos.map((todo) => {
            if (todo.id === id) {
              return updateTodo
            }
            return todo
          })
        )
      })
  }

  const deleteTodo = async (id: number) => {
    return todoHttpReqHandler.delete(id).then(() => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    })
  }
  useEffect(() => {
    todoHttpReqHandler.getAll().then((result) => {
      setTodos(result)
    })
  }, [])

  return {
    todos,
    addTodo,
    changeEditingStatus,
    toggleCompleteStatus,
    cancelTodo,
    confirmTodo,
    confirmModalCallback,
    cancelModalCallback,
    editing,
    editingTodo,
    setEditingTodo,
    editingDescription,
    setEditingDescription,
    modalData,
    openModal,
    isModalOpen
  }
}
