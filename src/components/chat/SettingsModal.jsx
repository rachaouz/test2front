import { useNavigate } from "react-router-dom";
import { t } from "./chatTheme";

export default function SettingsModal({ onClose, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const th = t(darkMode);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: darkMode ? "#060d16" : "#f0f6ff",
        border: `1px solid ${th.borderActive}`, borderRadius: "10px", padding: "24px", width: "320px",
        fontFamily: "'JetBrains Mono',monospace",
        boxShadow: `0 0 40px ${th.accentGlow}, 0 24px 60px rgba(0,0,0,0.5)`,
        animation: "fadeInUp 0.2s ease",
      }}>
        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", paddingBottom: "12px", borderBottom: `1px solid ${th.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: th.accent, letterSpacing: "2.5px", fontSize: "11px", fontWeight: "700" }}>
            <span>⚙</span><span>PARAMÈTRES</span>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: th.textFaint, fontSize: "14px", cursor: "pointer", padding: "2px 6px", borderRadius: "4px" }}>✕</button>
        </div>

        {/* User card */}
        <div style={{ background: th.accentSubtle, border: `1px solid ${th.border}`, borderRadius: "7px", padding: "12px", marginBottom: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: `linear-gradient(135deg, ${th.accentDim}, ${th.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", boxShadow: `0 0 12px ${th.accentGlow}`, flexShrink: 0 }}>👤</div>
          <div>
            <div style={{ color: th.text, fontSize: "12px", fontWeight: "700", letterSpacing: "1px" }}>Analyste SOC</div>
            <div style={{ color: th.textMuted, fontSize: "9px", marginTop: "2px", letterSpacing: "1px" }}>analyst@mobilis.dz</div>
          </div>
        </div>

        {/* Dark/Light toggle */}
        <div onClick={() => setDarkMode(!darkMode)} style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "11px 12px", background: th.accentSubtle, border: `1px solid ${th.border}`,
          borderRadius: "7px", marginBottom: "10px", cursor: "pointer", transition: "all 0.2s",
        }}>
          <span style={{ color: th.text, fontSize: "11px", letterSpacing: "1.5px" }}>{darkMode ? "🌙 Mode Sombre" : "☀️ Mode Clair"}</span>
          <div style={{ width: "38px", height: "20px", borderRadius: "10px", background: darkMode ? th.accent : "rgba(255,255,255,0.2)", border: `1px solid ${th.border}`, position: "relative", transition: "all 0.3s" }}>
            <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#fff", position: "absolute", top: "2px", left: darkMode ? "20px" : "2px", transition: "all 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
          </div>
        </div>

        {/* Logout */}
        <button onClick={() => navigate("/auth")} style={{
          width: "100%", padding: "10px",
          background: "rgba(248,113,113,0.07)", border: "1px solid rgba(248,113,113,0.25)",
          borderRadius: "7px", color: "#fca5a5", fontSize: "10px", letterSpacing: "2.5px",
          cursor: "pointer", fontFamily: "'JetBrains Mono',monospace", transition: "all 0.2s",
        }}>⏻ SE DÉCONNECTER</button>
      </div>
    </div>
  );
}