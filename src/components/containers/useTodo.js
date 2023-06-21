import { useEffect, useState } from 'react'

export const useTodo = () => {
  const [todos, setTodos] = useState([])

  const addTodo = (todo) => {
    fetch(`${process.env.REACT_APP_BASEURL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: todo.text })
    })
      .then((response) => response.json())
      .then((result) => {
        setTodos([...todos, result])
      })
  }

  const deleteTodo = (id) => {
    fetch(`${process.env.REACT_APP_BASEURL}/todos/${id}`, {
      method: 'DELETE'
    })
      .then((response) => response.json())
      .then(() => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id))
      })
  }

  const changeEditingStatus = (id) => {
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

  const toggleArchiveStatus = (id, archived) => {
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

  const toggleCompleteStatus = (id, completed) => {
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

  const cancelTodo = (id) => {
    setTodos((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, editing: false } : todo))
    )
  }

  const confirmTodo = (id, textItem) => {
    fetch(`${process.env.REACT_APP_BASEURL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: textItem })
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
