import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArchiveTypes, CompleteTypes } from '../../constants/todo-filter'
import { Todo } from '../../types/todo'

export const useTodoFilter = (todos: Todo[]) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterArchive, setFilterArchive] = useState<ArchiveTypes>(
    ArchiveTypes.ALL
  )
  const [filterComplete, setFilterComplete] = useState<CompleteTypes>(
    CompleteTypes.ALL
  )
  const filterTodos = todos
    .filter((todo) => {
      if (filterArchive === ArchiveTypes.ARCHIVED) {
        return todo.archived
      }

      if (filterArchive === ArchiveTypes.UNARCHIVED) {
        return !todo.archived
      }
      return todos
    })
    .filter((todo) => {
      if (filterComplete === CompleteTypes.COMPLETED) {
        return todo.completed
      }

      if (filterComplete === CompleteTypes.UNCOMPLETED) {
        return !todo.completed
      }
      return todos
    })

  useEffect(() => {
    const archiveParams: unknown = searchParams.get('filterArchiveStatus')
    const completeParams: unknown = searchParams.get('filterCompleteStatus')

    if (
      archiveParams === null ||
      (archiveParams !== ArchiveTypes.ALL &&
        archiveParams !== ArchiveTypes.ARCHIVED &&
        archiveParams !== ArchiveTypes.UNARCHIVED)
    ) {
      setSearchParams({
        filterArchiveStatus: ArchiveTypes.ALL,
        filterCompleteStatus: CompleteTypes.ALL
      })
    } else {
      setFilterArchive(archiveParams)
    }

    if (
      completeParams === null ||
      (completeParams !== CompleteTypes.ALL &&
        completeParams !== CompleteTypes.COMPLETED &&
        completeParams !== CompleteTypes.UNCOMPLETED)
    ) {
      setSearchParams({
        filterArchiveStatus: ArchiveTypes.ALL,
        filterCompleteStatus: CompleteTypes.ALL
      })
    } else {
      setFilterComplete(completeParams)
    }
  }, [searchParams, setSearchParams])

  return {
    filterArchive,
    filterComplete,
    filterTodos,
    setFilterArchive,
    setFilterComplete,
    setSearchParams
  }
}
