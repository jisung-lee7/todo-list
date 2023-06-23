import { Todo } from '../types/todo'

export const todoHttpReqHandler = {
  getAll: (): Promise<Todo[]> =>
    fetch(`${process.env.REACT_APP_BASEURL}/todos`).then((response) =>
      response.json()
    ),

  add: (title: string, description: string): Promise<Todo> =>
    fetch(`${process.env.REACT_APP_BASEURL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: title, description: description })
    }).then((response) => response.json()),

  delete: (id: number): Promise<Todo> =>
    fetch(`${process.env.REACT_APP_BASEURL}/todos/${id}`, {
      method: 'DELETE'
    }).then((response) => response.json()),

  update: (
    id: number,
    payload: Partial<
      Pick<Todo, 'archived' | 'completed' | 'title' | 'description'>
    >
  ): Promise<Todo> =>
    fetch(`${process.env.REACT_APP_BASEURL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then((response) => response.json())
}
