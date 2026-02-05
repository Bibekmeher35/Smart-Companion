export default function Rewards({ rewards }) {
  if (rewards.length === 0) {
    return <p>No rewards yet. Complete tasks to earn badges 🎯</p>;
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h4>Your Rewards</h4>
      <ul>
        {rewards.map((r, i) => (
          <li key={i}>🏅 {r}</li>
        ))}
      </ul>
    </div>
  );
}