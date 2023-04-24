import { useState } from "react";

let index = 0;

function TodoTop({ addTodo }) {
  const [todo, setTodo] = useState("");
  const handleChange = (event) => {
    setTodo(event.target.value);
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <input type="text" value={todo} onChange={handleChange} />

      <button
        onClick={() => {
          addTodo({ id: index++, text: todo });
          setTodo("");
        }}
      >
        add
      </button>
    </div>
  );
}

export default TodoTop;
