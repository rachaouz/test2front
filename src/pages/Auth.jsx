// src/pages/Auth.jsx
// MODIFICATION RBAC : intégration de useAuth().login() pour persister le rôle
// retourné par le backend après authentification réussie.

import { useState } from "react";
import Button from "../components/button";
import Input  from "../components/input";
import { LOGO_URL } from "../constants";
import { useAuth } from "../context/AuthContext";

function useAuthForm(login, onNavigate) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const validate = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) return "Enter a valid email address.";
    if (!password || password.length < 6)       return "Password must be at least 6 characters.";
    return null;
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(""); setLoading(true);

    // ─────────────────────────────────────────────────────────────────────
    // INTÉGRATION BACKEND
    // Remplacez ce setTimeout par votre appel API réel, par exemple :
    //
    //   const response = await fetch("/api/auth/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, password }),
    //   });
    //   const userFromBackend = await response.json();
    //   login(userFromBackend);
    //   onNavigate("chat");
    //
    // Pour l'instant, on simule un utilisateur renvoyé par le backend.
    // role 0 = admin | role 1 = utilisateur standard
    // ─────────────────────────────────────────────────────────────────────
    setTimeout(() => {
      setLoading(false);
      const simulatedUser = {
        email,
        role: email.toLowerCase().includes("admin") ? 0 : 1,
        name: email.split("@")[0],
      };
      login(simulatedUser);
      onNavigate("chat");
    }, 1800);
  };

  return { email, setEmail, password, setPassword, error, loading, handleSubmit };
}

export default function Auth({ onNavigate }) {
  const { login } = useAuth();
  const {
    email, setEmail, password, setPassword,
    error, loading, handleSubmit,
  } = useAuthForm(login, onNavigate);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-8 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 60% 80% at 50% 50%, #041a30 0%, #020b18 70%)",
      }}
    >
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-20 h-20 border-t border-l border-accent opacity-40 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-b border-r border-accent opacity-40 pointer-events-none" />

      {/* Card */}
      <div
        className="
          relative z-10 w-full max-w-[420px]
          bg-[rgba(4,16,32,0.9)] border border-[rgba(0,212,255,0.2)]
          p-10 backdrop-blur-[20px] clip-card
          shadow-card
        "
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-2">
          <img
            src={LOGO_URL}
            alt="Socilis"
            className="h-14 w-auto mb-2 drop-shadow-[0_0_16px_rgba(0,212,255,0.6)]"
          />
          <div
            className="font-display font-black tracking-[0.25em] drop-shadow-[0_0_30px_rgba(0,212,255,0.6)]"
            style={{ fontSize: "1.8rem" }}
          >
            <span style={{ color: "#ffffff" }}>SOC</span><span style={{ color: "#00e676" }}>ILIS</span>
          </div>
        </div>

        <div className="text-center mb-8 text-[0.75rem] tracking-[0.25em] text-[#7aa3c0] uppercase font-body">
          // Secure Access Portal
        </div>

        {/* LOGIN label (no tabs) */}
        <div
          className="flex items-center justify-center mb-8 py-[0.65rem] border border-[rgba(0,230,118,0.2)] bg-[rgba(0,230,118,0.06)]"
          style={{ fontFamily: "monospace", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#00e676" }}
        >
          LOGIN
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-[rgba(255,60,60,0.08)] border border-[rgba(255,60,60,0.25)] text-[#ff8080] text-[0.82rem] px-4 py-[0.65rem] mb-5 tracking-[0.05em] font-body">
            <span className="w-[5px] h-[5px] rounded-full bg-[#ff4444] flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Fields */}
        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="analyst@example.com"
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <Button variant="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? "AUTHENTICATING..." : "INITIATE SESSION"}
        </Button>

        {/* Hint pour les tests */}
        <div className="mt-3 text-center text-[0.65rem] text-[#4a7090] tracking-[0.05em] font-body">
          💡 Testez avec <span className="text-[#7aa3c0]">admin@example.com</span> (role 0) ou <span className="text-[#7aa3c0]">user@example.com</span> (role 1)
        </div>

        <button
          onClick={() => onNavigate("home")}
          className="block w-full text-center mt-4 text-[0.78rem] text-[#7aa3c0] tracking-[0.1em] bg-transparent border-none cursor-pointer transition-colors duration-200 hover:text-accent font-body"
        >
          ← Return to <span style={{ color: "#00e676" }}>Socilis</span>
        </button>
      </div>
    </div>
  );
}