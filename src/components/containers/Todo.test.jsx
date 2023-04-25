import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Todo from './Todo'

describe('Todo', () => {
  it('should add a todo', async () => {
    const user = userEvent.setup()

    render(<Todo />)

    expect(screen.queryByText('hello 111')).not.toBeInTheDocument()

    const addButton = screen.getByRole('button', { name: 'add' })
    const textBox = screen.getByRole('textbox')

    await user.type(textBox, 'hello 111')
    await user.click(addButton)

    expect(screen.getByText('hello 111')).toBeInTheDocument()
  })

  it('should not have delete button if todo item is not archived', async () => {
    const user = userEvent.setup()

    render(<Todo />)

    const addButton = screen.getByRole('button', { name: 'add' })
    const textBox = screen.getByRole('textbox')

    await user.type(textBox, 'hello 111')
    await user.click(addButton)

    expect(screen.queryByText('delete')).not.toBeInTheDocument()

    const archiveButton = screen.getByText('archive')

    await user.click(archiveButton)

    expect(screen.getByText('delete')).toBeInTheDocument()
  })

  it('should change archive button text to unarchive and change text opactiy to 0.3 if todo item is archived', async () => {
    const user = userEvent.setup()

    render(<Todo />)

    const addButton = screen.getByRole('button', { name: 'add' })
    const textBox = screen.getByRole('textbox')

    await user.type(textBox, 'hello 111')
    await user.click(addButton)

    const archiveButton = screen.getByText('archive')

    await user.click(archiveButton)

    expect(screen.getByText('hello 111')).toHaveStyle('opacity: 0.3')
    expect(screen.queryByText('archive')).not.toBeInTheDocument()
    expect(screen.getByText('unarchive')).toBeInTheDocument()
  })

  it('should display confirm and cancel buttons if the user clicks edit button next to todo item', async () => {
    const user = userEvent.setup()

    render(<Todo />)

    expect(screen.queryByText('confirm')).not.toBeInTheDocument()
    expect(screen.queryByText('cancel')).not.toBeInTheDocument()

    const addButton = screen.getByRole('button', { name: 'add' })
    const textBox = screen.getByRole('textbox')

    await user.type(textBox, 'hello 111')
    await user.click(addButton)

    const editButton = screen.getByText('edit')

    await user.click(editButton)

    expect(screen.getByText('confirm')).toBeInTheDocument()
    expect(screen.getByText('cancel')).toBeInTheDocument()
  })

  it('should disable add todo button and input text while the user editing any todo item', async () => {
    const user = userEvent.setup()

    render(<Todo />)

    const addButton = screen.getByRole('button', { name: 'add' })
    const textBox = screen.getByRole('textbox')

    expect(addButton).not.toBeDisabled()
    expect(textBox).not.toBeDisabled()

    await user.type(textBox, 'hello 111')
    await user.click(addButton)

    const editButton = screen.getByText('edit')

    await user.click(editButton)

    expect(addButton).toBeDisabled()
    expect(textBox).toBeDisabled()
  })

  it('should go back to original text if edit is canceled (user clicks cancel)', async () => {
    const user = userEvent.setup()

    render(<Todo />)

    const addButton = screen.getByRole('button', { name: 'add' })
    const textBox = screen.getByRole('textbox')

    await user.type(textBox, 'hello 111')
    await user.click(addButton)
    await user.type(textBox, 'hello 222')
    await user.click(addButton)

    const editButtons = screen.getAllByText('edit')

    // click first edit
    await user.click(editButtons[0])

    const editingTextBox = screen.getByDisplayValue('hello 111')
    const cancelButton = screen.getByText('cancel')

    // input hello 333 and click cancel button
    await user.type(editingTextBox, 'hello 333')
    await user.click(cancelButton)

    // then hello 333 should be ignored and hello 111 should be displayed
    expect(screen.queryByText('hello 333')).not.toBeInTheDocument()
    expect(screen.getByText('hello 111')).toBeInTheDocument()

    // click first edit
    await user.click(editButtons[0])

    // then hello 111 should be in the editing input box
    expect(screen.getByDisplayValue('hello 111')).toBeInTheDocument()
  })

  it('should go back to original text if edit is canceled (user clicks another edit button)', async () => {
    const user = userEvent.setup()

    render(<Todo />)

    const addButton = screen.getByRole('button', { name: 'add' })
    const textBox = screen.getByRole('textbox')

    await user.type(textBox, 'hello 111')
    await user.click(addButton)
    await user.type(textBox, 'hello 222')
    await user.click(addButton)

    const editButtons = screen.getAllByText('edit')

    // click first edit
    await user.click(editButtons[0])

    const editingTextBox = screen.getByDisplayValue('hello 111')

    // input hello 333 and click the other todo item edit button
    await user.type(editingTextBox, 'hello 333')
    await user.click(editButtons[1])

    // then hello 333 should be ignored and hello 111 should be displayed
    expect(screen.queryByText('hello 333')).not.toBeInTheDocument()
    expect(screen.getByText('hello 111')).toBeInTheDocument()

    // click first edit
    await user.click(editButtons[0])

    // then hello 111 should be in the editing input box
    expect(screen.getByDisplayValue('hello 111')).toBeInTheDocument()
  })
})
