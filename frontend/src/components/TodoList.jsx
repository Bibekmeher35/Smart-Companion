import { useState } from "react";
import { MdAdd, MdDelete, MdCheckCircle, MdRadioButtonUnchecked } from "react-icons/md";
import {
  TodoListContainer,
  TodoListHeader,
  TodoAddBtn,
  TodoInputContainer,
  TodoInput,
  TodoInputActions,
  TodoInputBtn,
  TodoEmpty,
  TodoSection,
  TodoSectionTitle,
  TodoList as StyledTodoList,
  TodoItem,
  TodoCheckbox,
  TodoText,
  TodoDelete,
} from "../styles/AnalyticsStyles";

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
    <TodoListContainer>
      <TodoListHeader>
        <h4>To-do Lists</h4>
        <TodoAddBtn
          onClick={() => setShowInput(!showInput)}
          title="Add new to-do"
        >
          <MdAdd />
        </TodoAddBtn>
      </TodoListHeader>

      {/* Add Todo Form */}
      {showInput && (
        <TodoInputContainer>
          <TodoInput
            type="text"
            placeholder="Enter your to-do item..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
          />
          <TodoInputActions>
            <TodoInputBtn className="todo-input-btn-add" onClick={handleAdd}>
              Add
            </TodoInputBtn>
            <TodoInputBtn
              className="todo-input-btn-cancel"
              onClick={() => {
                setNewTodo("");
                setShowInput(false);
              }}
            >
              Cancel
            </TodoInputBtn>
          </TodoInputActions>
        </TodoInputContainer>
      )}

      {/* List Rendering */}
      {todos.length === 0 ? (
        <TodoEmpty>
          <p>No to-do items yet.</p>
          <p className="todo-empty-hint">Click the + button to add your first to-do!</p>
        </TodoEmpty>
      ) : (
        <>
          {/* Pending Items Section */}
          {pendingTodos.length > 0 && (
            <TodoSection>
              <TodoSectionTitle>Pending ({pendingTodos.length})</TodoSectionTitle>
              <StyledTodoList>
                {pendingTodos.map((todo) => (
                  <TodoItem key={todo.id}>
                    <TodoCheckbox
                      onClick={() => onToggleTodo(todo.id)}
                      title="Mark as complete"
                    >
                      <MdRadioButtonUnchecked />
                    </TodoCheckbox>
                    <TodoText>{todo.text}</TodoText>
                    <TodoDelete
                      onClick={() => onDeleteTodo(todo.id)}
                      title="Delete to-do"
                    >
                      <MdDelete />
                    </TodoDelete>
                  </TodoItem>
                ))}
              </StyledTodoList>
            </TodoSection>
          )}

          {/* Completed Items Section */}
          {completedTodos.length > 0 && (
            <TodoSection>
              <TodoSectionTitle>Completed ({completedTodos.length})</TodoSectionTitle>
              <StyledTodoList>
                {completedTodos.map((todo) => (
                  <TodoItem key={todo.id} className="todo-item-completed">
                    <TodoCheckbox
                      className="todo-checkbox-completed"
                      onClick={() => onToggleTodo(todo.id)}
                      title="Mark as incomplete"
                    >
                      <MdCheckCircle />
                    </TodoCheckbox>
                    <TodoText className="todo-text-completed">{todo.text}</TodoText>
                    <TodoDelete
                      onClick={() => onDeleteTodo(todo.id)}
                      title="Delete to-do"
                    >
                      <MdDelete />
                    </TodoDelete>
                  </TodoItem>
                ))}
              </StyledTodoList>
            </TodoSection>
          )}
        </>
      )}
    </TodoListContainer>
  );
}

