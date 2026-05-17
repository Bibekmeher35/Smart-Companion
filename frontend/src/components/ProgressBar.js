/**
 * ProgressBar Component.
 * Simple visual indicator for task completion progress.
 * @param {number} completed - Number of steps or tasks completed.
 */
export default function ProgressBar({ completed }) {
  /**
   * Calculate the percentage. 
   * Multiplier of 10 assumes a base target or just for visualization.
   * Math.min ensures it never exceeds 100%.
   */
  const percentage = Math.min(completed * 10, 100);

  return (
    <div style={{ marginTop: "20px" }}>
      <p>Progress</p>
      {/* Outer container: The track of the progress bar */}
      <div
        style={{
          width: "300px",
          height: "12px",
          border: "1px solid #000",
          borderRadius: "6px",
          overflow: "hidden"
        }}
      >
        {/* Inner div: The actual progress indicator (colored) */}
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: "#4caf50",
            transition: "width 0.3s" // Smooth animation when progress updates
          }}
        />
      </div>
      <small>{percentage}% completed</small>
    </div>
  );
}