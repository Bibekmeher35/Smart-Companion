export default function ProgressBar({ completed }) {
  const percentage = Math.min(completed * 10, 100);

  return (
    <div style={{ marginTop: "20px" }}>
      <p>Progress</p>
      <div
        style={{
          width: "300px",
          height: "12px",
          border: "1px solid #000",
          borderRadius: "6px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: "#4caf50",
            transition: "width 0.3s"
          }}
        />
      </div>
      <small>{percentage}% completed</small>
    </div>
  );
}