import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export const useTodoFilter = (todos) => {
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

  return {
    searchParams,
    filterArchive,
    filterComplete,
    editing,
    filterTodos,
    setFilterArchive,
    setFilterComplete,
    setSearchParams
  }
}
