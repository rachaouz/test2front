import { t } from "./chatTheme";

const MOCK_HISTORY = [
  { id: 1, title: "Analyse IP 192.168.1.1",  date: "Aujourd'hui", preview: "Score: 85/100 · Malicieux" },
  { id: 2, title: "Hash MD5 d41d8cd9...",     date: "Aujourd'hui", preview: "Score: 12/100 · Propre"    },
  { id: 3, title: "CVE-2024-1234",            date: "Hier",        preview: "CVSS 9.8 · Critique"       },
  { id: 4, title: "Domain malware.ru",        date: "Hier",        preview: "Score: 92/100 · Malicieux" },
  { id: 5, title: "URL phishing scan",        date: "20 Avr",      preview: "Score: 78/100 · Suspect"   },
];

export default function ChatSidebar({ open, darkMode, selectedChat, onSelectChat, onNewChat }) {
  const th = t(darkMode);

  return (
    <div style={{
      width: open ? "260px" : "0px",
      minWidth: open ? "260px" : "0px",
      background: th.sidebar,
      borderRight: `1px solid ${th.border}`,
      display: "flex", flexDirection: "column",
      overflow: "hidden", transition: "all 0.3s ease",
    }}>
      {open && (
        <>
          {/* Logo */}
          <div style={{
            padding: "20px 16px",
            borderBottom: `1px solid ${th.border}`,
            display: "flex", alignItems: "center", gap: "10px",
          }}>
            <img
              src="/logo_socilis.webp"
              alt="SOCILIS"
              style={{ width: "32px", height: "32px", objectFit: "contain" }}
            />
            <div>
              <div style={{ fontWeight: "700", fontSize: "14px", letterSpacing: "2px", fontFamily: "'JetBrains Mono', monospace" }}>
                <span style={{ color: th.text }}>SOC</span>
                <span style={{ color: "#00c850" }}>ILIS</span>
              </div>
              <div style={{ color: th.textMuted, fontSize: "9px", letterSpacing: "2px", fontFamily: "'JetBrains Mono', monospace" }}>
                THREAT INTELLIGENCE
              </div>
            </div>
          </div>

          {/* New analysis button */}
          <div style={{ padding: "12px" }}>
            <button
              onClick={onNewChat}
              style={{
                width: "100%", padding: "8px",
                background: "transparent",
                border: `1px dashed ${th.borderActive}`,
                borderRadius: "6px",
                color: th.accent, fontSize: "11px", letterSpacing: "2px",
                cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = th.accentSubtle}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              + NOUVELLE ANALYSE
            </button>
          </div>

          {/* History */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
            <div style={{
              fontSize: "9px", color: th.textFaint,
              letterSpacing: "3px", padding: "8px",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              HISTORIQUE
            </div>
            {MOCK_HISTORY.map(item => (
              <div
                key={item.id}
                onClick={() => onSelectChat(item.id)}
                style={{
                  padding: "10px", borderRadius: "6px", marginBottom: "2px",
                  cursor: "pointer",
                  background: selectedChat === item.id ? th.accentSubtle : "transparent",
                  border: selectedChat === item.id
                    ? `1px solid ${th.borderActive}`
                    : "1px solid transparent",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  if (selectedChat !== item.id)
                    e.currentTarget.style.background = th.surfaceHover;
                }}
                onMouseLeave={e => {
                  if (selectedChat !== item.id)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{
                  fontSize: "11px", color: th.text, marginBottom: "3px",
                  overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "10px", color: th.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
                  {item.preview}
                </div>
                <div style={{ fontSize: "9px", color: th.textFaint, marginTop: "2px", fontFamily: "'JetBrains Mono', monospace" }}>
                  {item.date}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}