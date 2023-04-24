function TodoItem({ id, text, deleteTodo }) {
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div>{text}</div>
      <button
        onClick={() => {
          deleteTodo(id);
        }}
      >
        delete
      </button>
    </div>
  );
}

export default TodoItem;
