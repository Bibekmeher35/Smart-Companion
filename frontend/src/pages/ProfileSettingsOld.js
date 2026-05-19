import React from "react";

/**
 * ProfileSettings Component.
 * Overhauled with a tactile, non-texty card interface for step granularity.
 */
function ProfileSettings({ profile = {}, onSave }) {
  const stepLevel = profile.stepLevel || "medium";
  const dyslexiaMode = !!profile.dyslexiaMode;

  const update = (key, value) => {
    onSave({ ...profile, [key]: value });
  };

  return (
    <div className="profile-settings">
      {/* Step Granularity Card Interface */}
      <div className="profile-row" style={{ marginBottom: "32px" }}>
        <label className="profile-label" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.2rem", fontWeight: "700", marginBottom: "16px" }}>
          🎯 AI Task Depth (Granularity)
        </label>
        
        {dyslexiaMode ? (
          /* Tactile button cards for dyslexia mode to remove boring texty selects */
          <div className="granularity-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
            <button
              type="button"
              onClick={() => update("stepLevel", "low")}
              style={{
                background: stepLevel === "low" ? "#3b82f6" : "#ffffff",
                color: stepLevel === "low" ? "#ffffff" : "#1e1b4b",
                border: `4px solid ${stepLevel === "low" ? "#2563eb" : "#c7d2fe"}`,
                borderRadius: "20px",
                padding: "18px 12px",
                cursor: "pointer",
                fontWeight: "900",
                fontSize: "1.15rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease"
              }}
            >
              <span style={{ fontSize: "2.2rem" }}>⚡</span>
              <span>Low (Quick)</span>
            </button>
            <button
              type="button"
              onClick={() => update("stepLevel", "medium")}
              style={{
                background: stepLevel === "medium" ? "#f59e0b" : "#ffffff",
                color: stepLevel === "medium" ? "#ffffff" : "#1e1b4b",
                border: `4px solid ${stepLevel === "medium" ? "#d97706" : "#c7d2fe"}`,
                borderRadius: "20px",
                padding: "18px 12px",
                cursor: "pointer",
                fontWeight: "900",
                fontSize: "1.15rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease"
              }}
            >
              <span style={{ fontSize: "2.2rem" }}>⚖️</span>
              <span>Medium</span>
            </button>
            <button
              type="button"
              onClick={() => update("stepLevel", "high")}
              style={{
                background: stepLevel === "high" ? "#10b981" : "#ffffff",
                color: stepLevel === "high" ? "#ffffff" : "#1e1b4b",
                border: `4px solid ${stepLevel === "high" ? "#059669" : "#c7d2fe"}`,
                borderRadius: "20px",
                padding: "18px 12px",
                cursor: "pointer",
                fontWeight: "900",
                fontSize: "1.15rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease"
              }}
            >
              <span style={{ fontSize: "2.2rem" }}>🔍</span>
              <span>High (Micro)</span>
            </button>
          </div>
        ) : (
          <select
            className="profile-select"
            value={stepLevel}
            onChange={(e) => update("stepLevel", e.target.value)}
          >
            <option value="low">Low (quick overview)</option>
            <option value="medium">Medium (balanced)</option>
            <option value="high">High (micro‑steps)</option>
          </select>
        )}
      </div>

      {/* Accessibility Switch Panel */}
      <div className="profile-row">
        <label className="profile-label" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.2rem", fontWeight: "700", marginBottom: "12px" }}>
          📖 Accessibility Comfort
        </label>
        
        {dyslexiaMode ? (
          /* Glowing satisfying accessibility control block */
          <div
            onClick={() => update("dyslexiaMode", false)}
            style={{
              background: "#6366f1",
              color: "#ffffff",
              border: "4px solid #4f46e5",
              borderRadius: "24px",
              padding: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 8px 24px rgba(99, 102, 241, 0.25)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontSize: "2.4rem" }}>✨</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: "900", fontSize: "1.3rem", color: "#ffffff" }}>Playful Accessibility Active</div>
                <div style={{ fontSize: "1.05rem", color: "#e0e7ff", fontWeight: "700", marginTop: "2px" }}>👉 Tap here to turn OFF</div>
              </div>
            </div>
            <div style={{
              width: "56px",
              height: "32px",
              background: "#ffffff",
              borderRadius: "16px",
              position: "relative",
              transition: "all 0.3s ease"
            }}>
              <div style={{
                width: "24px",
                height: "24px",
                background: "#6366f1",
                borderRadius: "50%",
                position: "absolute",
                top: "4px",
                right: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
              }} />
            </div>
          </div>
        ) : (
          <label className="profile-toggle">
            <input
              type="checkbox"
              checked={dyslexiaMode}
              onChange={(e) => update("dyslexiaMode", e.target.checked)}
            />
            <span>Dyslexia‑friendly mode</span>
          </label>
        )}
      </div>
    </div>
  );
}

export default ProfileSettings;
