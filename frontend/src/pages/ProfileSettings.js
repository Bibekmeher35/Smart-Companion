import React from "react";

/**
 * ProfileSettings Component.
 * Allows users to customize their experience, including AI task granularity
 * and accessibility features like Dyslexia-friendly mode.
 */
  const update = (key, value) => {
    onSave({ ...profile, [key]: value });
  };

  return (
    <div className="profile-settings">
      {/* Step Granularity: Controls how deep the AI decomposes tasks */}
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