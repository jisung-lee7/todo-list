function TodoItem({ text, deleteTodo }) {
  return (
    <div style={{ display: "flex", width: "100%" }}>
      <div>{text}</div>
      <button
        onClick={() => {
          deleteTodo();
        }}
      >
        delete
      </button>
    </div>
  );
}

export default TodoItem;
