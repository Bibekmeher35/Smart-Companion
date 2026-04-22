import { useState, useEffect, useRef } from "react";
import { MdSearch, MdClose, MdCheckCircle, MdHistory, MdTask } from "react-icons/md";

/**
 * SearchModal Component.
 * Provides a global search interface for tasks, history, and to-do items.
 */
export default function SearchModal({ isOpen, onClose, history = [], todos = [], onNavigate }) {
  const [query, setQuery] = useState(""); // User's search input
  const [results, setResults] = useState({ tasks: [], todos: [], history: [] }); // Filtered results
  const inputRef = useRef(null); // Reference to the search input for auto-focus

  /**
   * Effect: Auto-focus the input when the modal opens.
   */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Effect: Perform the search filter whenever the query or data changes.
   */
  useEffect(() => {
    // If query is empty, reset results
    if (!query.trim()) {
      setResults({ tasks: [], todos: [], history: [] });
      return;
    }

    const searchQuery = query.toLowerCase();

    /**
     * Search in history:
     * Filters past tasks by title.
     */
    const historyResults = history
      .filter((item) => {
        const title = item?.title?.toLowerCase() || "";
        return title.includes(searchQuery);
      })
      .slice(0, 5) // Limit to top 5 results for clarity
      .map((item) => ({
        ...item,
        type: "history",
      }));

    /**
     * Search in todos:
     * Filters active and completed to-do items by text.
     */
    const todoResults = todos
      .filter((todo) => {
        const text = todo?.text?.toLowerCase() || "";
        return text.includes(searchQuery);
      })
      .slice(0, 5)
      .map((todo) => ({
        ...todo,
        type: "todo",
      }));

    setResults({
      tasks: [],
      todos: todoResults,
      history: historyResults,
    });
  }, [query, history, todos]);

  /**
   * Handles accessibility shortcuts (e.g., closing on Escape).
   */
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const totalResults = results.history.length + results.todos.length;

  // Don't render if the modal isn't open
  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      {/* Modal Container: Stop propagation to prevent overlay click from closing when clicking inside */}
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <div className="search-input-wrapper">
            <MdSearch className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              className="search-modal-input"
              placeholder="Search tasks, todos, and history..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <button
                className="search-clear-btn"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <MdClose />
              </button>
            )}
          </div>
          <button className="search-close-btn" onClick={onClose} aria-label="Close search">
            <MdClose />
          </button>
        </div>

        <div className="search-modal-body">
          {/* Conditional rendering based on search state: Initial, Empty, or Results */}
          {!query.trim() ? (
            <div className="search-empty">
              <MdSearch className="search-empty-icon" />
              <p>Start typing to search...</p>
              <p className="search-empty-hint">
                Search across your completed tasks, to-do items, and task history
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="search-empty">
              <MdSearch className="search-empty-icon" />
              <p>No results found</p>
              <p className="search-empty-hint">Try a different search term</p>
            </div>
          ) : (
            <div className="search-results">
              {/* History Section */}
              {results.history.length > 0 && (
                <div className="search-section">
                  <h4 className="search-section-title">
                    <MdHistory /> Task History ({results.history.length})
                  </h4>
                  <ul className="search-list">
                    {results.history.map((item, idx) => (
                      <li key={idx} className="search-item">
                        <div className="search-item-icon">
                          <MdTask />
                        </div>
                        <div className="search-item-content">
                          <div className="search-item-title">
                            {item.title || "Untitled task"}
                          </div>
                          <div className="search-item-meta">
                            Completed on{" "}
                            {item.completedAt
                              ? new Date(item.completedAt).toLocaleDateString()
                              : "Unknown"}
                            {" • "}
                            {item.stepsCount || 0} steps
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* To-Do Items Section */}
              {results.todos.length > 0 && (
                <div className="search-section">
                  <h4 className="search-section-title">
                    <MdCheckCircle /> To-Do Items ({results.todos.length})
                  </h4>
                  <ul className="search-list">
                    {results.todos.map((todo) => (
                      <li key={todo.id} className="search-item">
                        <div className="search-item-icon">
                          {todo.completed ? (
                            <MdCheckCircle className="search-icon-completed" />
                          ) : (
                            <MdCheckCircle className="search-icon-pending" />
                          )}
                        </div>
                        <div className="search-item-content">
                          <div
                            className={`search-item-title ${
                              todo.completed ? "search-item-completed" : ""
                            }`}
                          >
                            {todo.text}
                          </div>
                          <div className="search-item-meta">
                            {todo.completed ? "Completed" : "Pending"}
                            {" • "}
                            Added{" "}
                            {todo.createdAt
                              ? new Date(todo.createdAt).toLocaleDateString()
                              : "Unknown"}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="search-modal-footer">
          <div className="search-shortcuts">
            <kbd>ESC</kbd> to close
          </div>
        </div>
      </div>
    </div>
  );
}

