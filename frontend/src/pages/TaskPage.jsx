import React, { useState } from "react";

export default function TaskPage({
  task,
  setTask,
  steps,
  currentIndex,
  sendTask,
  markDone,
  taskFinished,
  resetTaskSession,
  onBack,
}) {
  const [loading, setLoading] = useState(false);

  const isLastStep = steps.length > 0 && currentIndex === steps.length - 1;

  const handleMarkDone = () => {
    // App will set taskFinished to true when the last step is completed
    markDone();
  };

  const handleFinish = () => {
    if (resetTaskSession) {
      resetTaskSession();
    }
    if (onBack) {
      onBack();
    }
  };
  return (
    <div
      className="task-page"
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        background: "#ffffff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Task Decomposition</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter your task (ex: How to clean room)"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ddd",
          }}
        />
        <button
          onClick={async () => {
            if (!task.trim()) return;
            setLoading(true);
            await sendTask();
            setLoading(false);
          }}
          disabled={loading}
          style={{
            background: loading ? "#a5b4fc" : "#4f46e5",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {loading && (
            <span
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid white",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          )}
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {loading && (
        <div
          style={{
            marginBottom: "20px",
            background: "#eef2ff",
            padding: "12px 16px",
            borderRadius: "8px",
            color: "#3730a3",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          ⏳ Please wait... This may take 5–7 seconds while we break your task
          into clear steps.
        </div>
      )}

      {steps.length > 0 && !taskFinished && (
        <div
          style={{
            background: "#f9fafb",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <p>
            Step {currentIndex + 1} of {steps.length}
          </p>

          <h3>{steps[currentIndex]}</h3>

          <button
            onClick={handleMarkDone}
            style={{
              marginTop: "15px",
              background: "#10b981",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {isLastStep ? "Mark Final Step" : "Mark as Done"}
          </button>
        </div>
      )}

      {taskFinished && (
        <div
          style={{
            marginTop: "20px",
            background: "#ecfdf3",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid #bbf7d0",
          }}
        >
          <h3 style={{ marginBottom: "10px", color: "#166534" }}>
            All steps completed!
          </h3>
          <p style={{ marginBottom: "16px", color: "#166534" }}>
            Great job. You can finish this task and return to your dashboard.
          </p>
          <button
            onClick={handleFinish}
            style={{
              background: "#4f46e5",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "999px",
              cursor: "pointer",
            }}
          >
            Finish
          </button>
        </div>
      )}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
