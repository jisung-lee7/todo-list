export interface Todo {
  id: number
  title: string
  description: string
  archived: boolean
  completed: boolean
  editing: boolean
  editingTodo: string
  editingDescription: string
}
