function TodoFilter({
  filterArchive,
  setFilterArchive,
  filterActivate,
  setFilterActivate
}) {
  const handleChangeArchive = (event) => {
    setFilterArchive(event.target.value)
  }
  const handleChangeActivate = (event) => {
    setFilterActivate(event.target.value)
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
            onChange={handleChangeArchive}
          />
          all
        </label>
        <label>
          <input
            type="radio"
            name="filterArchive"
            value="archived"
            checked={filterArchive === 'archived'}
            onChange={handleChangeArchive}
          />
          archived
        </label>
        <label>
          <input
            type="radio"
            name="filterArchive"
            value="unarchived"
            checked={filterArchive === 'unarchived'}
            onChange={handleChangeArchive}
          />
          unarchived
        </label>
      </div>
      <div style={{ display: 'flex', width: '100%' }}>
        <label>
          <input
            type="radio"
            name="filterActivate"
            value="all"
            checked={filterActivate === 'all'}
            onChange={handleChangeActivate}
          />
          all
        </label>
        <label>
          <input
            type="radio"
            name="filterActivate"
            value="activated"
            checked={filterActivate === 'activated'}
            onChange={handleChangeActivate}
          />
          activated
        </label>
        <label>
          <input
            type="radio"
            name="filterActivate"
            value="inactivated"
            checked={filterActivate === 'inactivated'}
            onChange={handleChangeActivate}
          />
          inactivated
        </label>
      </div>
    </div>
  )
}

export default TodoFilter
