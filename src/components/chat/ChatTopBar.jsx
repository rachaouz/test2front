import { t } from "./chatTheme";

const IOC_TYPES = [
  { type: "HASH",   icon: "⬡", color: "#a78bfa" },
  { type: "IP",     icon: "◈", color: "#22d3ee" },
  { type: "URL",    icon: "⬔", color: "#4ade80" },
  { type: "DOMAIN", icon: "◎", color: "#fb923c" },
  { type: "CVE",    icon: "⚠", color: "#f87171" },
];

export default function ChatTopBar({ darkMode, sidebarOpen, onToggleSidebar, onOpenSettings, activeIOC, onSelectIOC }) {
  const th = t(darkMode);

  return (
    <div style={{
      borderBottom: `1px solid ${th.border}`, flexShrink: 0,
      background: darkMode ? "rgba(5,11,18,0.97)" : "rgba(240,246,255,0.97)",
      backdropFilter: "blur(8px)",
    }}>
      {/* Top row */}
      <div style={{ height: "50px", display: "flex", alignItems: "center", padding: "0 14px", gap: "10px", borderBottom: `1px solid ${th.border}` }}>
        <button onClick={onToggleSidebar} style={{
          background: "transparent", border: "none", cursor: "pointer", padding: "6px",
          display: "flex", flexDirection: "column", gap: "4px",
          borderRadius: "5px", transition: "background 0.18s",
        }}>
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: "block", width: i === 1 ? "12px" : "16px", height: "1.5px",
              background: th.textMuted, borderRadius: "2px",
            }} />
          ))}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'JetBrains Mono',monospace" }}>
          <span style={{ fontSize: "9px", color: th.textFaint, letterSpacing: "2px" }}>SESSION ACTIVE</span>
        </div>

        <div style={{ flex: 1 }} />

        <button onClick={onOpenSettings} style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "transparent", border: `1px solid ${th.border}`,
          borderRadius: "6px", padding: "5px 12px", color: th.textMuted,
          fontSize: "9px", letterSpacing: "2px", cursor: "pointer",
          fontFamily: "'JetBrains Mono',monospace", transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = th.borderActive; e.currentTarget.style.color = th.accent; e.currentTarget.style.background = th.accentSubtle; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.textMuted; e.currentTarget.style.background = "transparent"; }}
        >⚙ PARAMÈTRES</button>
      </div>

      {/* IOC chips */}
      <div style={{ padding: "8px 14px", display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "8px", color: th.textFaint, letterSpacing: "2px", marginRight: "4px" }}>TYPE IOC :</span>
        {IOC_TYPES.map(({ type, icon, color }) => {
          const isActive = activeIOC === type;
          return (
            <button key={type} onClick={() => onSelectIOC(type)} style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "4px 12px",
              background: isActive ? `${color}14` : "transparent",
              border: isActive ? `1px solid ${color}` : `1px solid ${th.border}`,
              borderRadius: "4px", color: isActive ? color : th.textMuted,
              fontSize: "9px", letterSpacing: "2px", cursor: "pointer",
              fontFamily: "'JetBrains Mono',monospace",
              fontWeight: isActive ? "700" : "400", transition: "all 0.18s",
              boxShadow: isActive ? `0 0 8px ${color}30` : "none",
            }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = `${color}60`; e.currentTarget.style.color = color; e.currentTarget.style.background = `${color}0a`; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = th.border; e.currentTarget.style.color = th.textMuted; e.currentTarget.style.background = "transparent"; } }}
            >
              <span style={{ fontSize: "10px" }}>{icon}</span>{type}
            </button>
          );
        })}
      </div>
    </div>
  );
}