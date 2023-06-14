import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import Todo from '../components/containers/Todo'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

let todos = []
const server = setupServer(
  rest.get('http://localhost:8080/api/todos', (req, res, ctx) => {
    return res(ctx.delay(), ctx.json({ data: todos }))
  }),
  rest.post('http://localhost:8080/api/todos', async (req, res, ctx) => {
    const body = await req.json()

    todos.push({
      id: req.id,
      title: body.title,
      archived: false,
      completed: false
    })

    return res(
      ctx.delay(),
      ctx.json({
        data: {
          id: req.id,
          title: body.title,
          archived: false,
          completed: false
        }
      })
    )
  }),
  rest.put('http://localhost:8080/api/todos/:todoId', async (req, res, ctx) => {
    const body = await req.json()
    const todo = todos.find((todo) => todo.id === req.params.todoId)
    const newTodo = { ...todo, ...body }

    todos = todos.map((todo) =>
      todo.id === req.params.todoId ? newTodo : todo
    )

    return res(
      ctx.delay(),
      ctx.json({
        data: newTodo
      })
    )
  }),
  rest.delete('http://localhost:8080/api/todos/:todoId', (req, res, ctx) => {
    const todo = todos.find((todo) => todo.id === req.params.todoId)

    todos = todos.filter((todo) => todo.id !== req.params.todoId)

    return res(
      ctx.delay(),
      ctx.json({
        data: todo
      })
    )
  })
)

beforeAll(() => {
  // Establish requests interception layer before all tests.
  server.listen()
})

afterAll(() => {
  // Clean up after all tests are done, preventing this
  // interception layer from affecting irrelevant tests.
  server.close()
})

describe('Todo', () => {
  beforeEach(() => {
    todos = []
  })

  it('should add a todo', async () => {
    const user = userEvent.setup()

    render(<Todo />, {
      wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>
    })

    expect(screen.queryByText('hello 111')).not.toBeInTheDocument()

    const addButton = screen.getByRole('button', { name: 'add' })
    const textBox = screen.getByRole('textbox')

    await user.type(textBox, 'hello 111')
    await user.click(addButton)
    await screen.findByText('hello 111')

    expect(screen.getByText('hello 111')).toBeInTheDocument()
  })

  it('should not have delete button if todo item is not archived', async () => {
    const user = userEvent.setup()

    render(<Todo />, {
      wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>
    })

    const addButton = screen.getByRole('button', { name: 'add' })
    const textBox = screen.getByRole('textbox')

    await user.type(textBox, 'hello 111')
    await user.click(addButton)

    expect(screen.queryByText('delete')).not.toBeInTheDocument()

    await screen.findByText('archive')

    const archiveButton = screen.getByText('archive')

    await user.click(archiveButton)
    await screen.findByText('delete')

    expect(screen.getByText('delete')).toBeInTheDocument()
  })

  it('should change archive button text to unarchive and change text opactiy to 0.3 if todo item is archived', async () => {
    const user = userEvent.setup()

    render(<Todo />, {
      wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>
    })

    const addButton = screen.getByRole('button', { name: 'add' })
    const textBox = screen.getByRole('textbox')

    await user.type(textBox, 'hello 111')
    await user.click(addButton)
    await screen.findByText('archive')

    const archiveButton = screen.getByText('archive')

    await user.click(archiveButton)
    await screen.findByText('hello 111')
    await screen.findByText('unarchive')

    expect(screen.getByText('hello 111')).toHaveStyle('opacity: 0.3')
    expect(screen.queryByText('archive')).not.toBeInTheDocument()
    expect(screen.getByText('unarchive')).toBeInTheDocument()
  })

  it('should display confirm and cancel buttons if the user clicks edit button next to todo item', async () => {
    const user = userEvent.setup()

    render(<Todo />, {
      wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>
    })

    expect(screen.queryByText('confirm')).not.toBeInTheDocument()
    expect(screen.queryByText('cancel')).not.toBeInTheDocument()

    const addButton = screen.getByRole('button', { name: 'add' })
    const textBox = screen.getByRole('textbox')

    await user.type(textBox, 'hello 111')
    await user.click(addButton)
    await screen.findByText('edit')

    const editButton = screen.getByText('edit')

    await user.click(editButton)

    expect(screen.getByText('confirm')).toBeInTheDocument()
    expect(screen.getByText('cancel')).toBeInTheDocument()
  })

  it('should disable add todo button and input text while the user editing any todo item', async () => {
    const user = userEvent.setup()

    render(<Todo />, {
      wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>
    })

    const addButton = screen.getByRole('button', { name: 'add' })
    const textBox = screen.getByRole('textbox')

    expect(addButton).not.toBeDisabled()
    expect(textBox).not.toBeDisabled()

    await user.type(textBox, 'hello 111')
    await user.click(addButton)
    await screen.findByText('edit')

    const editButton = screen.getByText('edit')

    await user.click(editButton)

    expect(addButton).toBeDisabled()
    expect(textBox).toBeDisabled()
  })

  it('should go back to original text if edit is canceled (user clicks cancel)', async () => {
    const user = userEvent.setup()

    render(<Todo />, {
      wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>
    })

    const addButton = screen.getByRole('button', { name: 'add' })
    const textBox = screen.getByRole('textbox')

    await user.type(textBox, 'hello 111')
    await user.click(addButton)
    await user.type(textBox, 'hello 222')
    await user.click(addButton)
    await screen.findAllByText('edit')

    const editButtons = screen.getAllByText('edit')

    // click first edit
    await user.click(editButtons[0])
    await screen.findByDisplayValue('hello 111')
    await screen.findByText('cancel')

    const editingTextBox = screen.getByDisplayValue('hello 111')
    const cancelButton = screen.getByText('cancel')

    // input hello 333 and click cancel button
    await user.type(editingTextBox, 'hello 333')
    await user.click(cancelButton)
    await screen.findByText('hello 111')

    // then hello 333 should be ignored and hello 111 should be displayed
    expect(screen.queryByText('hello 333')).not.toBeInTheDocument()
    expect(screen.getByText('hello 111')).toBeInTheDocument()

    await screen.findAllByText('edit')

    const newEditButtons = screen.getAllByText('edit')

    // click first edit
    await user.click(newEditButtons[0])
    await screen.findByDisplayValue('hello 111')

    // then hello 111 should be in the editing input box
    expect(screen.getByDisplayValue('hello 111')).toBeInTheDocument()
  })

  it('should go back to original text if edit is canceled (user clicks another edit button)', async () => {
    const user = userEvent.setup()

    render(<Todo />, {
      wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>
    })

    const addButton = screen.getByRole('button', { name: 'add' })
    const textBox = screen.getByRole('textbox')

    await user.type(textBox, 'hello 111')
    await user.click(addButton)
    await user.type(textBox, 'hello 222')
    await user.click(addButton)
    await screen.findAllByText('edit')

    const editButtons = screen.getAllByText('edit')

    // click first edit
    await user.click(editButtons[0])
    await screen.findByDisplayValue('hello 111')

    const editingTextBox = screen.getByDisplayValue('hello 111')
    const editButton = screen.getByText('edit')

    // input hello 333 and click the other todo item edit button
    await user.type(editingTextBox, 'hello 333')
    await user.click(editButton)
    await screen.findByText('hello 111')

    // then hello 333 should be ignored and hello 111 should be displayed
    expect(screen.queryByText('hello 333')).not.toBeInTheDocument()
    expect(screen.getByText('hello 111')).toBeInTheDocument()

    await screen.findAllByText('edit')

    const newEditButtons = screen.getAllByText('edit')

    // click first edit
    await user.click(newEditButtons[0])
    await screen.findByDisplayValue('hello 111')

    // then hello 111 should be in the editing input box
    expect(screen.getByDisplayValue('hello 111')).toBeInTheDocument()
  })
})
