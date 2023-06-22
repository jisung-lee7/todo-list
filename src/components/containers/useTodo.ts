import { useEffect, useState } from 'react'
import { Todo } from '../../types/todo'

export const useTodo = () => {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = (title: string, description: string) => {
    fetch(`${process.env.REACT_APP_BASEURL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: title, description: description })
    })
      .then((response) => response.json())
      .then((result) => {
        setTodos([...todos, result])
      })
  }

  const deleteTodo = (id: number) => {
    fetch(`${process.env.REACT_APP_BASEURL}/todos/${id}`, {
      method: 'DELETE'
    })
      .then((response) => response.json())
      .then(() => {
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
    fetch(`${process.env.REACT_APP_BASEURL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ archived: !archived })
    })
      .then((response) => response.json())
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

  const toggleCompleteStatus = (id: number, completed: boolean) => {
    fetch(`${process.env.REACT_APP_BASEURL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed: !completed })
    })
      .then((response) => response.json())
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

  const confirmTodo = (
    id: number,
    editingTodo: string,
    editingDescription: string
  ) => {
    fetch(`${process.env.REACT_APP_BASEURL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: editingTodo,
        description: editingDescription
      })
    })
      .then((response) => response.json())
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
    fetch(`${process.env.REACT_APP_BASEURL}/todos`)
      .then((response) => response.json())
      .then((result) => {
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
