import React from "react";

function ProfileSettings({ profile, onSave }) {
  const update = (key, value) => {
    onSave({ ...profile, [key]: value });
  };

  return (
    <div style={{ marginTop: "20px", padding: "20px", border: "1px solid #ccc" }}>
      <h3>Profile Settings</h3>

      {/* STEP GRANULARITY */}
      <label>Step Granularity</label>
      <select
        value={profile.stepLevel}
        onChange={(e) => update("stepLevel", e.target.value)}
      >
        <option value="low">Low (Quick)</option>
        <option value="medium">Medium (Balanced)</option>
        <option value="high">High (Micro Steps)</option>
      </select>

      <br /><br />

      {/* DYSLEXIA MODE */}
      <label>
        <input
          type="checkbox"
          checked={profile.dyslexiaMode}
          onChange={(e) => update("dyslexiaMode", e.target.checked)}
        />
        Dyslexia-friendly mode
      </label>
    </div>
  );
}

export default ProfileSettings;