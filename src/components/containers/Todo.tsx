import { TodoItem } from '../presentations/TodoItem'
import { TodoTop } from '../presentations/TodoTop'
import { TodoFilter } from '../presentations/TodoFilter'
import { useTodo } from '../containers/useTodo'
import { useTodoFilter } from '../containers/useTodoFilter'
import { Modal } from '../presentations/Modal'
import { FC } from 'react'

export const Todo: FC = () => {
  const {
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
  } = useTodo()

  const {
    filterArchive,
    filterComplete,
    filterTodos,
    setFilterArchive,
    setFilterComplete,
    setSearchParams
  } = useTodoFilter(todos)

  return (
    <div>
      <TodoTop addTodo={addTodo} editing={editing} />
      <TodoFilter
        filterArchive={filterArchive}
        setFilterArchive={setFilterArchive}
        filterComplete={filterComplete}
        setFilterComplete={setFilterComplete}
        setSearchParams={setSearchParams}
      />
      {filterTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          title={todo.title}
          description={todo.description}
          editing={todo.editing}
          editingTodo={editingTodo}
          setEditingTodo={setEditingTodo}
          editingDescription={editingDescription}
          setEditingDescription={setEditingDescription}
          cancelTodo={cancelTodo}
          confirmTodo={confirmTodo}
          changeEditingStatus={changeEditingStatus}
          toggleCompleteStatus={toggleCompleteStatus}
          archived={todo.archived}
          completed={todo.completed}
          openModal={openModal}
        />
      ))}
      {modalData && (
        <Modal
          isOpen={isModalOpen}
          title={modalData.title}
          body={
            editing ? (
              <>
                <p>{modalData.body}</p>
                <label>
                  title
                  <input
                    type="text"
                    value={editingTodo}
                    onChange={(event) => {
                      setEditingTodo(event.target.value)
                    }}
                  />
                </label>

                <label>
                  description
                  <input
                    type="text"
                    value={editingDescription}
                    onChange={(event) =>
                      setEditingDescription(event.target.value)
                    }
                  />
                </label>
              </>
            ) : (
              <p>{modalData.body}</p>
            )
          }
          confirmModalCallback={confirmModalCallback}
          cancelModalCallback={cancelModalCallback}
        />
      )}
    </div>
  )
}
