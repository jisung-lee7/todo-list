import { ChangeEvent, Dispatch, FC } from 'react'
import { SetURLSearchParams } from 'react-router-dom'
import { ArchiveTypes, CompleteTypes } from '../../constants/todo-filter'

interface TodoFilterProps {
  filterArchive: ArchiveTypes
  setFilterArchive: Dispatch<React.SetStateAction<ArchiveTypes>>
  filterComplete: CompleteTypes
  setFilterComplete: Dispatch<React.SetStateAction<CompleteTypes>>
  setSearchParams: SetURLSearchParams
}

export const TodoFilter: FC<TodoFilterProps> = ({
  filterArchive,
  setFilterArchive,
  filterComplete,
  setFilterComplete,
  setSearchParams
}) => {
  const handleArchive = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterArchive(event.target.value as ArchiveTypes)
    setSearchParams((params) => {
      params.set('filterArchiveStatus', event.target.value)

      return params
    })
  }

  const handleComplete = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterComplete(event.target.value as CompleteTypes)
    setSearchParams((params) => {
      params.set('filterCompleteStatus', event.target.value)

      return params
    })
  }

  return (
    <div>
      <div style={{ display: 'flex', width: '100%' }}>
        <label>
          <input
            type="radio"
            name="filterArchive"
            value="all"
            checked={filterArchive === 'all'}
            onChange={handleArchive}
          />
          all
        </label>
        <label>
          <input
            type="radio"
            name="filterArchive"
            value="archived"
            checked={filterArchive === 'archived'}
            onChange={handleArchive}
          />
          archived
        </label>
        <label>
          <input
            type="radio"
            name="filterArchive"
            value="unarchived"
            checked={filterArchive === 'unarchived'}
            onChange={handleArchive}
          />
          unarchived
        </label>
      </div>

      <div style={{ display: 'flex', width: '100%' }}>
        <label>
          <input
            type="radio"
            name="filterComplete"
            value="all"
            checked={filterComplete === 'all'}
            onChange={handleComplete}
          />
          all
        </label>
        <label>
          <input
            type="radio"
            name="filterComplete"
            value="completed"
            checked={filterComplete === 'completed'}
            onChange={handleComplete}
          />
          completed
        </label>
        <label>
          <input
            type="radio"
            name="filterComplete"
            value="uncompleted"
            checked={filterComplete === 'uncompleted'}
            onChange={handleComplete}
          />
          uncompleted
        </label>
      </div>
    </div>
  )
}
