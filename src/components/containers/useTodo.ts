import { useEffect, useState } from 'react'
import { todoHttpReqHandler } from '../../http-handlers/todo'
import { Todo } from '../../types/todo'

export const useTodo = () => {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = (title: string, description: string) => {
    todoHttpReqHandler.add(title, description).then((todo) => {
      setTodos([...todos, todo])
    })
  }

  const deleteTodo = (id: number) => {
    todoHttpReqHandler.delete(id).then(() => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
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
  }

  const toggleArchiveStatus = (id: number, archived: boolean) => {
    todoHttpReqHandler
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

  const cancelTodo = (id: number) => {
    setTodos((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, editing: false } : todo))
    )
  }

  const confirmTodo = (
    id: number,
    editingTodo: string,
    editingDescription: string
  ) => {
    todoHttpReqHandler
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

  useEffect(() => {
    todoHttpReqHandler.getAll().then((result) => {
      setTodos(result)
    })
  }, [])

  return {
    todos,
    addTodo,
    deleteTodo,
    changeEditingStatus,
    toggleArchiveStatus,
    toggleCompleteStatus,
    cancelTodo,
    confirmTodo
  }
}
