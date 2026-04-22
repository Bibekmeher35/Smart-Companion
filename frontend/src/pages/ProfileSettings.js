import React from "react";

/**
 * ProfileSettings Component.
 * Allows users to customize their experience, including AI task granularity
 * and accessibility features like Dyslexia-friendly mode.
 */
function ProfileSettings({ profile = {}, onSave }) {
  const stepLevel = profile.stepLevel || "medium";
  const dyslexiaMode = !!profile.dyslexiaMode;

  /**
   * Helper: Updates a specific profile key and triggers the onSave callback.
   */
  const update = (key, value) => {
    onSave({ ...profile, [key]: value });
  };

  return (
    <div className="profile-settings">
      {/* Step Granularity: Controls how deep the AI decomposes tasks */}
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

      {/* Accessibility: Toggles specialized fonts/spacing for easier reading */}
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