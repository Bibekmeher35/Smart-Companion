import { useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [steps, setSteps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sendTask = async () => {
    try {
      console.log("Sending task:", task);

      const res = await fetch("http://localhost:5050/decompose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task }),
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", data);

      const parsedSteps = Array.isArray(data.steps)
        ? data.steps
        : data.steps.split("\n").filter(s => s.trim() !== "");

      setSteps(parsedSteps);
      setCurrentIndex(0);

    } catch (err) {
      console.error("Frontend fetch failed:", err);
      alert("Failed to reach backend. Check console and backend server.");
    }
  };

  const markDone = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Smart Companion</h2>

      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={{ width: "300px", padding: "8px" }}
      />

      <br /><br />

      <button onClick={sendTask}>Break Task</button>

      {steps.length === 0 && (
        <p style={{ color: "gray", marginTop: "10px" }}>
          No steps yet. Enter a task and click Break Task.
        </p>
      )}

      {steps.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>Current Step</h4>
          <p>{steps[currentIndex]}</p>

          <button onClick={markDone}>DONE</button>
        </div>
      )}
    </div>
  );
}

export default App;