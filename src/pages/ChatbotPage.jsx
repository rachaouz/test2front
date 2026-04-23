import { useState, useRef, useEffect } from "react";
import ChatSidebar     from "../components/chat/ChatSidebar";
import ChatTopBar      from "../components/chat/ChatTopBar";
import ChatInput       from "../components/chat/ChatInput";
import MessageBubble   from "../components/chat/MessageBubble";
import TypingIndicator from "../components/chat/TypingIndicator";
import SettingsModal   from "../components/chat/SettingsModal";
import { t }           from "../components/chat/ChatTheme";
import { MODELS }      from "../components/chat/ModelSelector";

function makeInitMsg() {
  return {
    id: 1, role: "bot",
    content: "Système SOCILIS initialisé. Je suis votre assistant Threat Intelligence. Soumettez un IOC (Hash, IP, URL, Domaine ou CVE) pour analyse.",
    timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function ChatbotPage() {
  const [messages,      setMessages]      = useState([makeInitMsg()]);
  const [input,         setInput]         = useState("");
  const [loading,       setLoading]       = useState(false);
  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [settingsOpen,  setSettingsOpen]  = useState(false);
  const [darkMode,      setDarkMode]      = useState(true);
  const [selectedChat,  setSelectedChat]  = useState(null);
  const [activeIOC,     setActiveIOC]     = useState(null);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const bottomRef = useRef();
  const th = t(darkMode);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msgText = text || input.trim();
    if (!msgText || loading) return;
    setInput("");

    const userMsg = {
      id: Date.now(), role: "user", content: msgText,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    await new Promise(r => setTimeout(r, 1500));

    const isMalicious = Math.random() > 0.5;
    const score = isMalicious
      ? Math.floor(Math.random() * 30) + 65
      : Math.floor(Math.random() * 35) + 5;

    const botMsg = {
      id: Date.now() + 1, role: "bot",
      content: `Analyse terminée pour : ${msgText}`,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      report: {
        ioc: msgText,
        verdict: isMalicious ? "malicious" : "clean",
        score,
        cves: isMalicious ? ["CVE-2024-1182", "CVE-2023-4567"] : [],
        sources: ["VirusTotal", "AbuseIPDB", "Shodan"],
      },
    };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  const handleSelectIOC = (type) => {
    setActiveIOC(type);
    setInput(`[${type}] `);
  };

  const handleNewChat = () => {
    setMessages([makeInitMsg()]);
    setSelectedChat(null);
    setInput("");
    setActiveIOC(null);
    setLoading(false);
  };

  return (
    <div style={{
      display: "flex", height: "100vh",
      background: th.bg,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      color: th.text,
      overflow: "hidden",
    }}>
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: darkMode
          ? `linear-gradient(rgba(0,168,255,0.025) 1px, transparent 1px),
             linear-gradient(90deg, rgba(0,168,255,0.025) 1px, transparent 1px)`
          : "none",
        backgroundSize: "40px 40px",
      }} />

      {settingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} darkMode={darkMode} setDarkMode={setDarkMode} />
      )}

      <ChatSidebar
        open={sidebarOpen} darkMode={darkMode}
        selectedChat={selectedChat} onSelectChat={setSelectedChat}
        onNewChat={handleNewChat}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", zIndex: 1 }}>
        <ChatTopBar
          darkMode={darkMode} sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(v => !v)}
          onOpenSettings={() => setSettingsOpen(true)}
          activeIOC={activeIOC} onSelectIOC={handleSelectIOC}
        />

        <div style={{
          flex: 1, overflowY: "auto", padding: "20px 24px",
          scrollbarWidth: "thin",
          scrollbarColor: `${th.scrollThumb} transparent`,
        }}>
          {messages.map(msg => (
            <MessageBubble key={msg.id} msg={msg} darkMode={darkMode} />
          ))}
          {loading && <TypingIndicator darkMode={darkMode} />}
          <div ref={bottomRef} />
        </div>

        <ChatInput
          darkMode={darkMode} input={input} loading={loading}
          selectedModel={selectedModel} onModelChange={setSelectedModel}
          onInputChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          onSend={sendMessage}
        />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingDot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.2); }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${th.scrollThumb}; border-radius: 2px; }
      `}</style>
    </div>
  );
}