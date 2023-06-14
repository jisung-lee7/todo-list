import { useState } from 'react'
import TodoItem from '../presentations/TodoItem'
import TodoTop from '../presentations/TodoTop'
import TodoFilter from '../presentations/TodoFilter'

function Todo() {
  const [todos, setTodos] = useState([])

  const [filterArchive, setFilterArchive] = useState('all')
  const [filterActivate, setFilterActivate] = useState('all')

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
      if (filterActivate === 'activated') {
        return !todo.activated
      }

      if (filterActivate === 'inactivated') {
        return todo.activated
      }
      return todos
    })

  const addTodo = (todo) => {
    setTodos([...todos, todo])
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
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

  const changeArchiveStatus = (id) => {
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, archived: !todo.archived }
        }

        return todo
      })
    )
  }

  const changeActivateStatus = (id) => {
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, activated: !todo.activated }
        }

        return todo
      })
    )
  }
  const cancelTodo = (id) => {
    setTodos((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, editing: false } : todo))
    )
  }

  const confirmTodo = (id, textItem) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, text: textItem, editing: !todo.editing }
          : todo
      )
    )
  }

  return (
    <div>
      <TodoTop addTodo={addTodo} editing={editing} />
      <TodoFilter
        filterArchive={filterArchive}
        setFilterArchive={setFilterArchive}
        filterActivate={filterActivate}
        setFilterActivate={setFilterActivate}
      />

      {filterTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          text={todo.text}
          confirmTodo={confirmTodo}
          deleteTodo={deleteTodo}
          editing={todo.editing}
          cancelTodo={cancelTodo}
          changeEditingStatus={changeEditingStatus}
          changeArchiveStatus={changeArchiveStatus}
          changeActivateStatus={changeActivateStatus}
          archived={todo.archived}
          activated={todo.activated}
        />
      ))}
    </div>
  )
}

export default Todo
