import { useState } from "react";
import { t } from "./chatTheme";

function VerdictBadge({ verdict }) {
  const map = {
    malicious:  { bg: "rgba(248,113,113,0.1)", border: "#f87171", text: "#fca5a5", label: "⚠ MALICIEUX" },
    clean:      { bg: "rgba(74,222,128,0.1)",  border: "#4ade80", text: "#86efac", label: "✓ PROPRE"    },
    suspicious: { bg: "rgba(251,146,60,0.1)",  border: "#fb923c", text: "#fdba74", label: "⚡ SUSPECT"  },
    critical:   { bg: "rgba(239,68,68,0.12)",  border: "#ef4444", text: "#fca5a5", label: "🔴 CRITIQUE" },
  };
  const c = map[verdict] || map.suspicious;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "3px 10px", borderRadius: "4px",
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontSize: "9px", fontWeight: "700", letterSpacing: "2px",
      fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap",
    }}>{c.label}</span>
  );
}

function ReportCard({ report, darkMode }) {
  const [copied, setCopied] = useState(false);
  const th = t(darkMode);
  const score = report.score || 0;
  const scoreColor = score > 70 ? "#f87171" : score > 40 ? "#fb923c" : "#4ade80";

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: darkMode ? "rgba(4,12,24,0.95)" : "rgba(245,250,255,0.98)",
      border: `1px solid ${th.borderActive}`,
      borderRadius: "8px", padding: "14px 16px", marginTop: "8px",
      fontSize: "11px", fontFamily: "'JetBrains Mono', monospace",
      boxShadow: "0 4px 20px rgba(0,168,255,0.08)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", paddingBottom: "10px", borderBottom: `1px solid ${th.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: th.accent, boxShadow: `0 0 6px ${th.accent}` }} />
          <span style={{ color: th.accent, fontWeight: "700", letterSpacing: "2px", fontSize: "10px" }}>
            THREAT INTELLIGENCE REPORT
          </span>
        </div>
        <button onClick={handleCopy} style={{
          background: "transparent",
          border: `1px solid ${copied ? "#4ade80" : th.border}`,
          color: copied ? "#4ade80" : th.textMuted,
          padding: "3px 10px", borderRadius: "4px",
          fontSize: "9px", cursor: "pointer", letterSpacing: "1.5px", transition: "all 0.2s",
        }}>{copied ? "✓ COPIÉ" : "⎘ COPIER"}</button>
      </div>

      {/* IOC */}
      <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: th.textFaint, fontSize: "9px", letterSpacing: "2px" }}>IOC</span>
        <span style={{ color: th.accent, background: th.accentSubtle, border: `1px solid ${th.border}`, padding: "2px 8px", borderRadius: "3px" }}>
          {report.ioc}
        </span>
      </div>

      {/* Score */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <VerdictBadge verdict={report.verdict} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ color: th.textFaint, fontSize: "9px", letterSpacing: "2px" }}>THREAT SCORE</span>
            <span style={{ color: scoreColor, fontWeight: "700", fontSize: "12px" }}>
              {score}<span style={{ color: th.textFaint, fontSize: "9px" }}>/100</span>
            </span>
          </div>
          <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${score}%`,
              background: `linear-gradient(90deg, ${scoreColor}88, ${scoreColor})`,
              borderRadius: "2px", boxShadow: `0 0 8px ${scoreColor}60`,
              transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
            }} />
          </div>
        </div>
      </div>

      {/* CVEs */}
      {report.cves?.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ color: th.textFaint, fontSize: "9px", letterSpacing: "2px", marginBottom: "6px" }}>CVEs ASSOCIÉES</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {report.cves.map(c => (
              <span key={c} style={{ padding: "3px 9px", background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.28)", borderRadius: "3px", color: "#fb923c", fontSize: "10px" }}>{c}</span>
            ))}
          </div>
        </div>
      )}

      {/* Sources */}
      {report.sources?.length > 0 && (
        <div>
          <div style={{ color: th.textFaint, fontSize: "9px", letterSpacing: "2px", marginBottom: "6px" }}>SOURCES</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {report.sources.map(s => (
              <span key={s} style={{ padding: "3px 9px", background: th.accentSubtle, border: `1px solid ${th.border}`, borderRadius: "3px", color: th.textMuted, fontSize: "10px" }}>→ {s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MessageBubble({ msg, darkMode }) {
  const th = t(darkMode);
  const isUser = msg.role === "user";

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: isUser ? "flex-end" : "flex-start",
      marginBottom: "18px",
      animation: "fadeInUp 0.25s ease-out",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        flexDirection: isUser ? "row-reverse" : "row",
        marginBottom: "5px",
      }}>
        <div style={{
          width: "22px", height: "22px", borderRadius: "50%",
          background: isUser
            ? `linear-gradient(135deg, ${th.accentDim}, ${th.accent})`
            : "linear-gradient(135deg, #1a2a3a, #2a4060)",
          border: `1px solid ${isUser ? th.borderActive : th.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "10px", flexShrink: 0,
          boxShadow: isUser ? `0 0 8px ${th.accentGlow}` : "none",
        }}>
          {isUser ? "▲" : "🛡"}
        </div>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "9px", fontWeight: "700", letterSpacing: "2px",
          color: isUser ? th.accent : "#4ade80",
        }}>
          {isUser ? "ANALYST" : "TI-ENGINE"}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "9px", color: th.textFaint,
        }}>
          {msg.timestamp}
        </span>
      </div>

      <div style={{
        maxWidth: "80%",
        background: isUser ? th.userBubble : th.botBubble,
        border: `1px solid ${isUser ? th.borderActive : th.border}`,
        borderRadius: isUser ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
        padding: "11px 15px", color: th.text,
        fontSize: "12px", lineHeight: "1.65",
        fontFamily: "'JetBrains Mono', monospace",
        boxShadow: isUser ? `0 2px 12px ${th.accentGlow}` : "none",
      }}>
        {msg.content}
      </div>

      {msg.report && (
        <div style={{ maxWidth: "90%", width: "100%" }}>
          <ReportCard report={msg.report} darkMode={darkMode} />
        </div>
      )}
    </div>
  );
}