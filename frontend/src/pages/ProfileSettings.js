import React from "react";

function ProfileSettings({ profile = {}, onSave }) {
  const stepLevel = profile.stepLevel || "medium";
  const dyslexiaMode = !!profile.dyslexiaMode;

  const update = (key, value) => {
    onSave({ ...profile, [key]: value });
  };

  return (
    <div className="profile-settings">
      <div className="profile-row">
        <label className="profile-label">Step granularity</label>
        <select
          className="profile-select"
          value={stepLevel}
          onChange={(e) => update("stepLevel", e.target.value)}
        >
          <option value="low">Low (quick overview)</option>
          <option value="medium">Medium (balanced)</option>
          <option value="high">High (micro‑steps)</option>
        </select>
      </div>

      <div className="profile-row">
        <label className="profile-label">Reading comfort</label>
        <label className="profile-toggle">
          <input
            type="checkbox"
            checked={dyslexiaMode}
            onChange={(e) => update("dyslexiaMode", e.target.checked)}
          />
          <span>Dyslexia‑friendly mode</span>
        </label>
      </div>
    </div>
  );
}

export default ProfileSettings;