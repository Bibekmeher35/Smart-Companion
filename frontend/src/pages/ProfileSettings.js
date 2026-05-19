import React from "react";
import {
  ProfileRow,
  ProfileLabel,
  ProfileSelect,
  GranularityCards,
  GranularityButton,
  DyslexiaToggle,
  SettingsContainer,
  SettingsTitle,
  SettingsDescription,
} from '../styles/ComponentStyles';

function ProfileSettings({ profile = {}, onSave }) {
  const stepLevel = profile.stepLevel || "medium";
  const dyslexiaMode = !!profile.dyslexiaMode;

  const update = (key, value) => {
    onSave({ ...profile, [key]: value });
  };

  return (
    <SettingsContainer $dyslexia={dyslexiaMode}>
      {/* Step Granularity Section */}
      <div>
        {dyslexiaMode ? (
          <SettingsTitle $dyslexia>
            🎯 How detailed should tasks be?
          </SettingsTitle>
        ) : (
          <>
            <SettingsTitle>AI Task Depth (Granularity)</SettingsTitle>
            <SettingsDescription>
              Choose how the AI breaks down your tasks into steps.
            </SettingsDescription>
          </>
        )}
        
        {dyslexiaMode ? (
          <GranularityCards>
            <GranularityButton
              type="button"
              onClick={() => update("stepLevel", "low")}
              $active={stepLevel === "low"}
              $color="#3b82f6"
              $borderColor="#2563eb"
            >
              <span style={{ fontSize: "2.8rem" }}>⚡</span>
              <span style={{ fontSize: "1.2rem", fontWeight: "900" }}>Quick</span>
              <span style={{ fontSize: "0.95rem", fontWeight: "600", opacity: 0.8 }}>Few big steps</span>
            </GranularityButton>
            <GranularityButton
              type="button"
              onClick={() => update("stepLevel", "medium")}
              $active={stepLevel === "medium"}
              $color="#f59e0b"
              $borderColor="#d97706"
            >
              <span style={{ fontSize: "2.8rem" }}>⚖️</span>
              <span style={{ fontSize: "1.2rem", fontWeight: "900" }}>Balanced</span>
              <span style={{ fontSize: "0.95rem", fontWeight: "600", opacity: 0.8 }}>Just right</span>
            </GranularityButton>
            <GranularityButton
              type="button"
              onClick={() => update("stepLevel", "high")}
              $active={stepLevel === "high"}
              $color="#10b981"
              $borderColor="#059669"
            >
              <span style={{ fontSize: "2.8rem" }}>🔍</span>
              <span style={{ fontSize: "1.2rem", fontWeight: "900" }}>Detailed</span>
              <span style={{ fontSize: "0.95rem", fontWeight: "600", opacity: 0.8 }}>Tiny steps</span>
            </GranularityButton>
          </GranularityCards>
        ) : (
          <ProfileRow>
            <ProfileLabel>Step Detail Level:</ProfileLabel>
            <ProfileSelect
              value={stepLevel}
              onChange={(e) => update("stepLevel", e.target.value)}
            >
              <option value="low">Low (quick overview)</option>
              <option value="medium">Medium (balanced)</option>
              <option value="high">High (micro‑steps)</option>
            </ProfileSelect>
          </ProfileRow>
        )}
      </div>

      {/* Dyslexia Mode Toggle Section */}
      <div style={{ marginTop: dyslexiaMode ? "32px" : "24px" }}>
        {dyslexiaMode ? (
          <SettingsTitle $dyslexia>
            ✨ Reading Comfort Mode
          </SettingsTitle>
        ) : (
          <>
            <SettingsTitle>Accessibility Preferences</SettingsTitle>
            <SettingsDescription>
              Enable dyslexia-friendly design with larger text, more spacing, and playful visuals.
            </SettingsDescription>
          </>
        )}
        
        {dyslexiaMode ? (
          <DyslexiaToggle
            $active={dyslexiaMode}
            onClick={() => update("dyslexiaMode", false)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1 }}>
              <span style={{ fontSize: "3rem" }}>✨</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: "900", fontSize: "1.4rem", color: "#ffffff" }}>Comfort Mode ON</div>
                <div style={{ fontSize: "1.1rem", color: "#e0e7ff", fontWeight: "700", marginTop: "4px" }}>👉 Tap to turn OFF</div>
              </div>
            </div>
            <div style={{
              width: "64px",
              height: "36px",
              background: "#ffffff",
              borderRadius: "18px",
              position: "relative",
              transition: "all 0.3s ease",
              flexShrink: 0
            }}>
              <div style={{
                width: "28px",
                height: "28px",
                background: "#6366f1",
                borderRadius: "50%",
                position: "absolute",
                top: "4px",
                right: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease"
              }} />
            </div>
          </DyslexiaToggle>
        ) : (
          <DyslexiaToggle
            $active={false}
            onClick={() => update("dyslexiaMode", true)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
              <span style={{ fontSize: "1.8rem" }}>📖</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: "600", fontSize: "1rem" }}>Dyslexia‑friendly mode</div>
                <div style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "2px" }}>Larger text, more spacing, playful design</div>
              </div>
            </div>
            <div style={{
              width: "52px",
              height: "28px",
              background: "#e5e7eb",
              borderRadius: "14px",
              position: "relative",
              transition: "all 0.3s ease",
              flexShrink: 0
            }}>
              <div style={{
                width: "20px",
                height: "20px",
                background: "#9ca3af",
                borderRadius: "50%",
                position: "absolute",
                top: "4px",
                left: "4px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease"
              }} />
            </div>
          </DyslexiaToggle>
        )}
      </div>
    </SettingsContainer>
  );
}

export default ProfileSettings;
