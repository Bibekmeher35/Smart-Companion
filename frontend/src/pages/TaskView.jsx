export default function TaskView({
  task,
  setTask,
  steps,
  currentIndex,
  sendTask,
  markDone
}) {
  return (
    <>
      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={{ width: "100%", padding: "10px" }}
      />

      <button
        onClick={sendTask}
        disabled={!task.trim()}
        style={{ width: "100%", marginTop: "10px" }}
      >
        Break Task
      </button>

      {steps.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <p style={{ fontSize: "14px", opacity: 0.6 }}>
            Step {currentIndex + 1} of {steps.length}
          </p>

          <p style={{ margin: "10px 0", fontWeight: 500 }}>
            {steps[currentIndex]}
          </p>

          <button
            onClick={markDone}
            style={{
              padding: "8px 16px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {currentIndex + 1 === steps.length ? "Finish Task" : "DONE"}
          </button>
        </div>
      )}
    </>
  );
}