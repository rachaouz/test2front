import { useState } from "react";
import { t } from "./ChatTheme";

const MOCK_HISTORY = [
  { id: 1, title: "Analyse IP 192.168.1.1",  date: "Aujourd'hui", preview: "Score: 85/100 · Malicieux" },
  { id: 2, title: "Hash MD5 d41d8cd9...",     date: "Aujourd'hui", preview: "Score: 12/100 · Propre"    },
  { id: 3, title: "CVE-2024-1234",            date: "Hier",        preview: "CVSS 9.8 · Critique"       },
  { id: 4, title: "Domain malware.ru",        date: "Hier",        preview: "Score: 92/100 · Malicieux" },
  { id: 5, title: "URL phishing scan",        date: "20 Avr",      preview: "Score: 78/100 · Suspect"   },
];

export default function ChatSidebar({ open, darkMode, selectedChat, onSelectChat, onNewChat }) {
  const th = t(darkMode);
  const [search, setSearch] = useState("");

  const filtered = MOCK_HISTORY.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.preview.toLowerCase().includes(search.toLowerCase())
  );

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
              src="//logo socilis.webp"
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

          {/* New analysis */}
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

          {/* Search bar */}
          <div style={{ padding: "0 12px 10px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: th.input,
              border: `1px solid ${th.border}`,
              borderRadius: "6px", padding: "6px 10px",
              transition: "border-color 0.2s",
            }}
              onFocusCapture={e => e.currentTarget.style.borderColor = th.borderActive}
              onBlurCapture={e => e.currentTarget.style.borderColor = th.border}
            >
              <span style={{ color: th.textFaint, fontSize: "11px", flexShrink: 0 }}>🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher..."
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  color: th.text, fontSize: "10px", letterSpacing: "0.5px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{ background: "transparent", border: "none", color: th.textFaint, cursor: "pointer", fontSize: "12px", lineHeight: 1, padding: 0 }}
                >×</button>
              )}
            </div>
          </div>

          {/* History */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
            <div style={{
              fontSize: "9px", color: th.textFaint,
              letterSpacing: "3px", padding: "4px 8px 6px",
              fontFamily: "'JetBrains Mono', monospace",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span>HISTORIQUE</span>
              {search && (
                <span style={{ color: th.accent, fontSize: "8px" }}>
                  {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {filtered.length === 0 ? (
              <div style={{
                padding: "20px 10px", textAlign: "center",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px", color: th.textFaint, letterSpacing: "1px",
              }}>
                Aucun résultat
              </div>
            ) : (
              filtered.map(item => {
                // Highlight matching text
                const highlight = (text) => {
                  if (!search) return text;
                  const idx = text.toLowerCase().indexOf(search.toLowerCase());
                  if (idx === -1) return text;
                  return (
                    <>
                      {text.slice(0, idx)}
                      <mark style={{ background: `${th.accent}30`, color: th.accent, borderRadius: "2px", padding: "0 1px" }}>
                        {text.slice(idx, idx + search.length)}
                      </mark>
                      {text.slice(idx + search.length)}
                    </>
                  );
                };

                return (
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
                      {highlight(item.title)}
                    </div>
                    <div style={{ fontSize: "10px", color: th.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
                      {highlight(item.preview)}
                    </div>
                    <div style={{ fontSize: "9px", color: th.textFaint, marginTop: "2px", fontFamily: "'JetBrains Mono', monospace" }}>
                      {item.date}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}