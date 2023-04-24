import { useState } from "react";
import TodoItem from "../presentations/TodoItem";
import TodoTop from "../presentations/TodoTop";

function Todo() {
  const [todos, setTodos] = useState([]);
  const addTodo = (todo) => {
    setTodos([...todos, todo]);
  };
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div>
      <TodoTop addTodo={addTodo} />
      {todos.map((todo) => (
        <TodoItem key={todo.id} text={todo.text} deleteTodo={deleteTodo} />
      ))}
    </div>
  );
}

export default Todo;
