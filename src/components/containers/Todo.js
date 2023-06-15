import { useEffect, useState } from 'react'
import TodoItem from '../presentations/TodoItem'
import TodoTop from '../presentations/TodoTop'
import TodoFilter from '../presentations/TodoFilter'
import { useSearchParams } from 'react-router-dom'

function Todo() {
  const [todos, setTodos] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterArchive, setFilterArchive] = useState('all')
  const [filterComplete, setFilterComplete] = useState('all')

  const editing = todos.some((todo) => todo.editing === true)

  const filterTodos = todos
    .filter((todo) => {
      if (filterArchive === 'archived') {
        return todo.archived
      }

      if (filterArchive === 'unarchived') {
        return !todo.archived
      }
      return todos
    })
    .filter((todo) => {
      if (filterComplete === 'completed') {
        return todo.completed
      }

      if (filterComplete === 'uncompleted') {
        return !todo.completed
      }
      return todos
    })

  const addTodo = (todo) => {
    fetch(`http://localhost:8080/api/todos`, {
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
    fetch(`http://localhost:8080/api/todos/${id}`, {
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
    fetch(`http://localhost:8080/api/todos/${id}`, {
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
    fetch(`http://localhost:8080/api/todos/${id}`, {
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
    fetch(`http://localhost:8080/api/todos/${id}`, {
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
    const archiveParams = searchParams.get('filterArchiveStatus')
    const completeParams = searchParams.get('filterCompleteStatus')
    if (
      archiveParams === null ||
      (archiveParams !== 'all' &&
        archiveParams !== 'archived' &&
        archiveParams !== 'unarchived')
    ) {
      setSearchParams({
        filterArchiveStatus: 'all',
        filterCompleteStatus: 'all'
      })
    } else {
      setFilterArchive(archiveParams)
    }

    if (
      completeParams === null ||
      (completeParams !== 'all' &&
        completeParams !== 'completed' &&
        completeParams !== 'uncompleted')
    ) {
      setSearchParams({
        filterArchiveStatus: 'all',
        filterCompleteStatus: 'all'
      })
    } else {
      setFilterComplete(completeParams)
    }
  }, [searchParams, setSearchParams])

  useEffect(() => {
    fetch(`http://localhost:8080/api/todos`)
      .then((response) => response.json())
      .then((result) => {
        setTodos(result)
      })
  }, [])

  return (
    <div>
      <TodoTop addTodo={addTodo} editing={editing} />
      <TodoFilter
        filterArchive={filterArchive}
        setFilterArchive={setFilterArchive}
        filterComplete={filterComplete}
        setFilterComplete={setFilterComplete}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />

      {filterTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          text={todo.title}
          confirmTodo={confirmTodo}
          deleteTodo={deleteTodo}
          editing={todo.editing}
          cancelTodo={cancelTodo}
          changeEditingStatus={changeEditingStatus}
          toggleArchiveStatus={toggleArchiveStatus}
          toggleCompleteStatus={toggleCompleteStatus}
          archived={todo.archived}
          completed={todo.completed}
        />
      ))}
    </div>
  )
}

export default Todo
