import { useState, useRef, useEffect } from "react";
import ChatSidebar     from "../components/chat/ChatSidebar";
import ChatTopBar      from "../components/chat/ChatTopBar";
import ChatInput       from "../components/chat/ChatInput";
import MessageBubble   from "../components/chat/MessageBubble";
import TypingIndicator from "../components/chat/TypingIndicator";
import SettingsModal   from "../components/chat/SettingsModal";
import CreateUserModal from "../components/chat/settings/CreateUserModal";
import DeleteUserModal from "../components/chat/settings/DeleteUserModal";
import { t }           from "../components/chat/ChatTheme";
import { MODELS }      from "../components/chat/ModelSelector";
import { detectInputType, stripIOCPrefix, TYPE_LABELS } from "../utils/iocDetector";

function now() {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function makeInitMsg() {
  return {
    id: 1, role: "bot",
    content: "Système SOCILIS initialisé. Soumettez un IOC (Hash, IP, URL, Domaine, Email ou CVE) pour analyse, ou posez une question en cybersécurité.",
    timestamp: now(),
  };
}

function mockAnalyzeIOC(ioc, type) {
  const isMalicious = Math.random() > 0.4;
  const score = isMalicious ? Math.floor(Math.random()*30)+65 : Math.floor(Math.random()*30)+5;
  const verdict      = score >= 80 ? "malicious" : score >= 40 ? "suspicious" : "clean";
  const threat_level = score >= 80 ? "high"      : score >= 40 ? "medium"     : "low";

  const base = {
    ioc, type, verdict, threat_level, score,
    message: isMalicious
      ? `Cet indicateur a été détecté comme potentiellement malveillant. Plusieurs sources confirment une activité suspecte associée à ${ioc}.`
      : `Aucune activité malveillante détectée pour ${ioc} selon les sources disponibles.`,
    tags: isMalicious
      ? (type==="hash" ? ["malware","powershell","ransomware"] : type==="cve" ? ["privilege escalation","authentication bypass"] : ["suspicious","phishing"])
      : [],
  };

  const extras = {
    ip:     { isp:"Example ISP Inc.", asn:12345, country:"FR", vt_malicious:isMalicious?Math.floor(Math.random()*10):0, vt_suspicious:isMalicious?Math.floor(Math.random()*3):0, abuseipdb:isMalicious?Math.floor(Math.random()*80):0, otx_pulses:isMalicious?Math.floor(Math.random()*20):0, associated_domains:isMalicious?["malware.example.com","c2.badactor.net"]:[], associated_files:isMalicious?["a1b2c3d4e5f6...","deadbeef1234..."]:[] },
    hash:   { file_type:"Powershell", first_seen:"2024-01-15 08:32:11", vt_malicious:isMalicious?67:0, vt_undetected:2, otx_pulses:isMalicious?46:0, mitre_attack:isMalicious?[{technique_id:"T1059",technique_name:"Command and Scripting Interpreter",source:"detection name mapping",matched_on:"trojan"},{technique_id:"T1055",technique_name:"Process Injection",source:"detection name mapping",matched_on:"trojan"}]:[] },
    domain: { ip_domain:"N/A", registrar:"Example Registrar Ltd.", created:"2023-06-12", subdomains_count:0, global_risk_score:isMalicious?130:10, vt_malicious:isMalicious?13:0 },
    url:    { domain:ioc.replace(/^https?:\/\//,"").split("/")[0], ip:"192.168.1.1", global_risk_score:isMalicious?100:5, vt_malicious:isMalicious?18:0, vt_suspicious:isMalicious?1:0, gsb_threats:isMalicious?["SOCIAL_ENGINEERING"]:[], phishtank:isMalicious?"phishing":"clean" },
    mail:   { mail_domain:ioc.split("@")[1]||"unknown.com", provider:"Inconnu", mx:"missing", spf:"missing", dmarc:"missing", alerts:isMalicious?["Aucun serveur MX","SPF absent","DMARC absent","Imite un service connu"]:[] },
    cve:    { severity:"CRITICAL", cvss_score:9.1, cvss_vector:"CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:N", cwe:["CWE-347"], published:new Date().toISOString().split("T")[0] },
  };

  return { ...base, ...(extras[type] || {}) };
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
  const [adminModal,    setAdminModal]    = useState(null);
  const bottomRef = useRef();
  const th = t(darkMode);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSelectIOC = (type) => {
    setActiveIOC(type);
    if (type) {
      setInput(prev => `[${type}] ${stripIOCPrefix(prev)}`);
    } else {
      setInput(prev => stripIOCPrefix(prev));
    }
  };

  const sendMessage = async (text) => {
    const raw = (text || input).trim();
    if (!raw || loading) return;
    setInput("");

    const userMsg = { id: Date.now(), role: "user", content: raw, timestamp: now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const clean = stripIOCPrefix(raw);

    // Chip sélectionné → priorité absolue
    let isIOC  = !!activeIOC;
    let iocType = activeIOC ? activeIOC.toLowerCase() : null;

    if (!isIOC) {
      const detected = detectInputType(clean);
      isIOC   = detected.isIOC;
      iocType = detected.type;
    }

    await new Promise(r => setTimeout(r, 1200));

    let botMsg;
    if (isIOC && iocType) {
      // ── IOC → rapport structuré ──
      const report = mockAnalyzeIOC(clean, iocType);
      botMsg = {
        id: Date.now()+1, role: "bot",
        content: `Analyse terminée — ${TYPE_LABELS[iocType] || iocType} : ${clean}`,
        timestamp: now(), report,
      };
    } else {
      // ── Question → réponse conversationnelle ──
      // Remplace par: const { answer } = await chatApi.ask(clean, selectedModel);
      botMsg = {
        id: Date.now()+1, role: "bot",
        content: `[Mode RAG — cybersécurité]\n\nQuestion reçue : "${clean}"\n\nConnectez le backend pour obtenir une vraie réponse via les modèles RAG.`,
        timestamp: now(),
      };
    }

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
    setActiveIOC(null);
  };

  const handleNewChat = () => { setMessages([makeInitMsg()]); setSelectedChat(null); setInput(""); setActiveIOC(null); setLoading(false); };

  return (
    <div style={{ display:"flex", height:"100vh", background:th.bg, fontFamily:"'JetBrains Mono','Fira Code',monospace", color:th.text, overflow:"hidden" }}>
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, backgroundImage:darkMode?`linear-gradient(rgba(0,168,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,168,255,0.025) 1px,transparent 1px)`:"none", backgroundSize:"40px 40px" }} />

      {settingsOpen  && <SettingsModal onClose={()=>setSettingsOpen(false)} darkMode={darkMode} setDarkMode={setDarkMode} onOpenAdminModal={(type)=>{ setSettingsOpen(false); setAdminModal(type); }} />}
      {adminModal==="create" && <CreateUserModal darkMode={darkMode} onClose={()=>setAdminModal(null)} />}
      {adminModal==="delete" && <DeleteUserModal darkMode={darkMode} onClose={()=>setAdminModal(null)} />}

      <ChatSidebar open={sidebarOpen} darkMode={darkMode} selectedChat={selectedChat} onSelectChat={setSelectedChat} onNewChat={handleNewChat} />

      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative", zIndex:1 }}>
        <ChatTopBar darkMode={darkMode} sidebarOpen={sidebarOpen} onToggleSidebar={()=>setSidebarOpen(v=>!v)} onOpenSettings={()=>setSettingsOpen(true)} activeIOC={activeIOC} onSelectIOC={handleSelectIOC} />

        <div style={{ flex:1, overflowY:"auto", padding:"20px 24px", scrollbarWidth:"thin", scrollbarColor:`${th.scrollThumb} transparent` }}>
          {messages.map(msg => <MessageBubble key={msg.id} msg={msg} darkMode={darkMode} />)}
          {loading && <TypingIndicator darkMode={darkMode} />}
          <div ref={bottomRef} />
        </div>

        <ChatInput darkMode={darkMode} input={input} loading={loading} selectedModel={selectedModel} onModelChange={setSelectedModel} onInputChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMessage()} onSend={sendMessage} />
      </div>

      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes typingDot { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:${th.scrollThumb};border-radius:2px}
      `}</style>
    </div>
  );
}