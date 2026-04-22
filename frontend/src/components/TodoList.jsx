import { useState } from "react";
import { MdAdd, MdDelete, MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";

/**
 * TodoList Component.
 * Manages the display and user interactions for a personal to-do list.
 */
export default function TodoList({ todos = [], onAddTodo, onToggleTodo, onDeleteTodo }) {
  const [newTodo, setNewTodo] = useState(""); // Local state for the input field
  const [showInput, setShowInput] = useState(false); // Controls visibility of the add-todo form

  /**
   * Triggers the addition of a new to-do item.
   */
  const handleAdd = () => {
    if (newTodo.trim()) {
      onAddTodo(newTodo.trim());
      setNewTodo("");
      setShowInput(false);
    }
  };

  /**
   * Keyboard support: Enter to save, Escape to cancel.
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    } else if (e.key === "Escape") {
      setNewTodo("");
      setShowInput(false);
    }
  };

  // Split todos into pending and completed for structured rendering
  const pendingTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="todo-list-container">
      <div className="todo-list-header">
        <h4>To-do Lists</h4>
        <button
          className="todo-add-btn"
          onClick={() => setShowInput(!showInput)}
          title="Add new to-do"
        >
          <MdAdd />
        </button>
      </div>

      {/* Add Todo Form */}
      {showInput && (
        <div className="todo-input-container">
          <input
            type="text"
            className="todo-input"
            placeholder="Enter your to-do item..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
          />
          <div className="todo-input-actions">
            <button className="todo-input-btn todo-input-btn-add" onClick={handleAdd}>
              Add
            </button>
            <button
              className="todo-input-btn todo-input-btn-cancel"
              onClick={() => {
                setNewTodo("");
                setShowInput(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List Rendering */}
      {todos.length === 0 ? (
        <div className="todo-empty">
          <p>No to-do items yet.</p>
          <p className="todo-empty-hint">Click the + button to add your first to-do!</p>
        </div>
      ) : (
        <>
          {/* Pending Items Section */}
          {pendingTodos.length > 0 && (
            <div className="todo-section">
              <h5 className="todo-section-title">Pending ({pendingTodos.length})</h5>
              <ul className="todo-list">
                {pendingTodos.map((todo) => (
                  <li key={todo.id} className="todo-item">
                    <button
                      className="todo-checkbox"
                      onClick={() => onToggleTodo(todo.id)}
                      title="Mark as complete"
                    >
                      <MdRadioButtonUnchecked />
                    </button>
                    <span className="todo-text">{todo.text}</span>
                    <button
                      className="todo-delete"
                      onClick={() => onDeleteTodo(todo.id)}
                      title="Delete to-do"
                    >
                      <MdDelete />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Completed Items Section */}
          {completedTodos.length > 0 && (
            <div className="todo-section">
              <h5 className="todo-section-title">Completed ({completedTodos.length})</h5>
              <ul className="todo-list">
                {completedTodos.map((todo) => (
                  <li key={todo.id} className="todo-item todo-item-completed">
                    <button
                      className="todo-checkbox todo-checkbox-completed"
                      onClick={() => onToggleTodo(todo.id)}
                      title="Mark as incomplete"
                    >
                      <MdCheckCircle />
                    </button>
                    <span className="todo-text todo-text-completed">{todo.text}</span>
                    <button
                      className="todo-delete"
                      onClick={() => onDeleteTodo(todo.id)}
                      title="Delete to-do"
                    >
                      <MdDelete />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

