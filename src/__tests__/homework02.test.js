import { render, screen, waitFor } from '@testing-library/react'
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

  it('should be the same result as click confirm button if the user press enter while editing', async () => {
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

    await user.click(editingTextBox)
    await user.type(editingTextBox, '456')
    await user.type(editingTextBox, '{enter}')
    await screen.findByText('hello 111456')

    expect(screen.getByText('hello 111456')).toBeInTheDocument()
    expect(screen.queryByText('hello 111')).not.toBeInTheDocument()

    const newEditButtons = screen.getAllByText('edit')

    // click first edit
    await user.click(newEditButtons[0])
    await screen.findByDisplayValue('hello 111456')

    // then hello 333 should be in the editing input box
    expect(screen.getByDisplayValue('hello 111456')).toBeInTheDocument()
  })

  it('should be the same result as click cancel button if the user press esc while editing', async () => {
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

    await user.click(editingTextBox)
    await user.type(editingTextBox, '456')
    await user.type(editingTextBox, '{escape}')
    await screen.findByText('hello 111')

    // then hello 333 should be ignored and hello 111 should be displayed
    expect(screen.queryByText('hello 111456')).not.toBeInTheDocument()
    expect(screen.getByText('hello 111')).toBeInTheDocument()

    const newEditButtons = screen.getAllByText('edit')

    // click first edit
    await user.click(newEditButtons[0])
    await screen.findByDisplayValue('hello 111')

    // then hello 111 should be in the editing input box
    expect(screen.getByDisplayValue('hello 111')).toBeInTheDocument()
  })

  it('should add line-through style if todo item is inactive', async () => {
    const user = userEvent.setup()

    render(<Todo />, {
      wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>
    })

    const addButton = screen.getByRole('button', { name: 'add' })
    const textBox = screen.getByRole('textbox')

    await user.type(textBox, 'hello 111')
    await user.click(addButton)
    await screen.findByRole('checkbox')
    await screen.findByText('hello 111')

    const checkbox = screen.getByRole('checkbox')

    expect(screen.getByText('hello 111')).not.toHaveStyle(
      'text-decoration: line-through'
    )

    await user.click(checkbox)
    await waitFor(() =>
      expect(screen.getByText('hello 111')).toHaveStyle(
        'text-decoration: line-through'
      )
    )
  })

  it('should filter by selected radio filter', async () => {
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
    await user.type(textBox, 'hello 333')
    await user.click(addButton)
    await user.type(textBox, 'hello 444')
    await user.click(addButton)

    await user.click(screen.getAllByRole('button', { name: 'archive' })[0])
    await waitFor(() =>
      expect(screen.getByText('hello 111')).toHaveStyle('opacity: 0.3')
    )
    await user.click(screen.getAllByRole('button', { name: 'archive' })[0])
    await waitFor(() =>
      expect(screen.getByText('hello 222')).toHaveStyle('opacity: 0.3')
    )
    await user.click(screen.getAllByRole('button', { name: 'archive' })[1])
    await waitFor(() =>
      expect(screen.getByText('hello 444')).toHaveStyle('opacity: 0.3')
    )
    await user.click(screen.getAllByRole('checkbox')[2])
    await waitFor(() =>
      expect(screen.getByText('hello 333')).toHaveStyle(
        'text-decoration: line-through'
      )
    )
    await user.click(screen.getAllByRole('checkbox')[3])
    await waitFor(() =>
      expect(screen.getByText('hello 444')).toHaveStyle(
        'text-decoration: line-through'
      )
    )

    expect(screen.getByText('hello 111')).toBeInTheDocument()
    expect(screen.getByText('hello 222')).toBeInTheDocument()
    expect(screen.getByText('hello 333')).toBeInTheDocument()
    expect(screen.getByText('hello 444')).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'archived' }))
    await user.click(screen.getByRole('radio', { name: 'activated' }))

    expect(screen.getByText('hello 111')).toBeInTheDocument()
    expect(screen.getByText('hello 222')).toBeInTheDocument()
    expect(screen.queryByText('hello 333')).not.toBeInTheDocument()
    expect(screen.queryByText('hello 444')).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'unarchived' }))
    await user.click(screen.getByRole('radio', { name: 'activated' }))

    expect(screen.queryByText('hello 111')).not.toBeInTheDocument()
    expect(screen.queryByText('hello 222')).not.toBeInTheDocument()
    expect(screen.queryByText('hello 333')).not.toBeInTheDocument()
    expect(screen.queryByText('hello 444')).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'archived' }))
    await user.click(screen.getByRole('radio', { name: 'inactivated' }))

    expect(screen.queryByText('hello 111')).not.toBeInTheDocument()
    expect(screen.queryByText('hello 222')).not.toBeInTheDocument()
    expect(screen.queryByText('hello 333')).not.toBeInTheDocument()
    expect(screen.getByText('hello 444')).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'unarchived' }))
    await user.click(screen.getByRole('radio', { name: 'inactivated' }))

    expect(screen.queryByText('hello 111')).not.toBeInTheDocument()
    expect(screen.queryByText('hello 222')).not.toBeInTheDocument()
    expect(screen.getByText('hello 333')).toBeInTheDocument()
    expect(screen.queryByText('hello 444')).not.toBeInTheDocument()
  })
})
