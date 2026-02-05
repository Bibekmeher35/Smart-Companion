export default function MobileNav({ view, onSelect }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "60px",
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 50,
      }}
    >
      <NavButton
        label="🏠"
        active={view === "dashboard"}
        onClick={() => onSelect("dashboard")}
      />

      <NavButton
        label="📝"
        active={view === "task"}
        onClick={() => onSelect("task")}
      />

      <NavButton label="📊" disabled />
      <NavButton label="⚙️" disabled />
    </div>
  );
}

function NavButton({ label, active, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "none",
        border: "none",
        fontSize: "20px",
        opacity: disabled ? 0.4 : active ? 1 : 0.6,
        transform: active ? "scale(1.1)" : "scale(1)",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {label}
    </button>
  );
}