 import { useState, useEffect } from "react";

const FloatingInput = ({ id, label, type = "text", value, onChange, onToggle, showToggle }) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div style={{ position: "relative", marginBottom: "32px", paddingTop: "20px" }}>
      <label
        htmlFor={id}
        style={{
          position: "absolute",
          left: 0,
          top: active ? "0px" : "32px",
          fontSize: active ? "10px" : "15px",
          letterSpacing: active ? "3px" : "1px",
          color: focused ? "#BFA45A" : active ? "#8a7a5a" : "#4a4535",
          fontFamily: "'Cinzel', serif",
          textTransform: "uppercase",
          fontWeight: "500",
          pointerEvents: "none",
          transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          lineHeight: 1,
        }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          display: "block",
          width: "100%",
          background: "transparent",
          border: "none",
          borderBottom: `1px solid ${focused ? "#BFA45A" : "#2a2a1a"}`,
          padding: "10px 32px 10px 0",
          color: "#e8e0cc",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "17px",
          letterSpacing: "0.5px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: "absolute", right: 0, bottom: "10px",
            background: "none", border: "none", cursor: "pointer",
            color: "#4a4535", padding: 0, lineHeight: 1,
          }}
        >
          {type === "password" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          )}
        </button>
      )}
      <div style={{
        position: "absolute", bottom: 0, left: 0, height: "1px",
        width: focused ? "100%" : "0%",
        background: "linear-gradient(90deg, #BFA45A, #e8c96a)",
        transition: "width 0.45s cubic-bezier(0.4,0,0.2,1)",
      }} />
    </div>
  );
};

const StrengthBar = ({ password }) => {
  const getStrength = () => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };
  const strength = getStrength();
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#c0392b", "#e67e22", "#BFA45A", "#27ae60"];
  if (!password) return null;
  return (
    <div style={{ marginTop: "-16px", marginBottom: "24px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            height: "3px", flex: 1, borderRadius: "9999px",
            background: i <= strength ? colors[strength] : "#1e1e14",
            transition: "background 0.4s ease",
          }} />
        ))}
      </div>
      <span style={{ fontSize: "11px", color: colors[strength], letterSpacing: "2px", fontFamily: "'Cinzel', serif" }}>
        {labels[strength]}
      </span>
    </div>
  );
};

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirm: "" });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2200);
  };

  const switchMode = (m) => {
    setMode(m);
    setForm({ firstName: "", lastName: "", email: "", phone: "", password: "", confirm: "" });
    setShowPass(false); setShowConfirm(false); setAgreed(false);
  };

  const isLogin = mode === "login";
  const canSubmit = isLogin
    ? form.email && form.password
    : agreed && form.password === form.confirm && form.firstName && form.email && form.password;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; }

        @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes slideLeft { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideRight{ from{opacity:0;transform:translateX(-24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes panelIn   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        .fade-up    { animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .slide-left { animation: slideLeft  0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .slide-right{ animation: slideRight 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .panel-in   { animation: panelIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }

        .shimmer-text {
          background: linear-gradient(90deg,#BFA45A 0%,#e8c96a 40%,#BFA45A 60%,#9a7e3a 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .stat-card { transition: all 0.3s ease; cursor: default; }
        .stat-card:hover { transform: translateY(-2px); border-color: #3a3520 !important; }

        .sso-btn { transition: all 0.3s ease; }
        .sso-btn:hover { border-color: #3a3528 !important; color: #a09070 !important; }

        .tab-btn { transition: color 0.3s ease; }
        .tab-btn:hover { color: #BFA45A !important; }

        .cta-btn { transition: all 0.3s ease; }
        .cta-btn:hover:not(:disabled) { opacity: 0.88 !important; }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #0b0b09; }
        ::-webkit-scrollbar-thumb { background: #2a2410; }

        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #0e0e0c inset !important;
          -webkit-text-fill-color: #e8e0cc !important;
        }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.3); }
        select option { background: #111109; }

        /* ── Responsive layout ── */
        .auth-root {
          min-height: 100vh;
          display: flex;
          background: #0b0b09;
          font-family: 'Cormorant Garamond', serif;
        }

        /* LEFT PANEL — hidden on mobile */
        .left-panel {
          flex: 1;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 64px;
          overflow: hidden;
        }
        @media (max-width: 899px) {
          .left-panel { display: none; }
        }

        /* RIGHT PANEL */
        .right-panel {
          width: 460px;
          min-height: 100vh;
          background: #0e0e0c;
          border-left: 1px solid #1a1a10;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 52px;
          position: relative;
          overflow-y: auto;
        }
        @media (max-width: 899px) {
          .right-panel {
            width: 100%;
            min-height: 100vh;
            border-left: none;
            padding: 40px 24px 60px;
            justify-content: flex-start;
          }
        }
        @media (max-width: 400px) {
          .right-panel { padding: 32px 18px 56px; }
        }

        /* Mobile logo strip */
        .mobile-logo {
          display: none;
          align-items: center;
          gap: 12px;
          margin-bottom: 36px;
        }
        @media (max-width: 899px) {
          .mobile-logo { display: flex; }
        }

        /* Corner accents — hide on mobile */
        .corner-accent { position: absolute; }
        @media (max-width: 899px) {
          .corner-accent { display: none; }
        }

        /* Mobile hero strip (stats) */
        .mobile-hero {
          display: none;
          background: #0c0c0a;
          border: 1px solid #1a1a10;
          padding: 18px 20px;
          margin-bottom: 32px;
        }
        @media (max-width: 899px) {
          .mobile-hero { display: block; }
        }

        /* Name row */
        .name-row {
          display: flex;
          gap: 24px;
        }
        @media (max-width: 400px) {
          .name-row { flex-direction: column; gap: 0; }
        }

        /* Tab bar */
        .tab-bar {
          display: flex;
          border-bottom: 1px solid #1a1a10;
          margin-bottom: 36px;
        }

        /* Stat cards row */
        .stat-row {
          display: flex;
          gap: 16px;
        }
        @media (max-width: 1100px) {
          .stat-row { gap: 10px; }
        }

        /* Form heading size */
        .form-heading {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          color: #e8e0cc;
          font-weight: 400;
          letter-spacing: 1px;
        }
        @media (max-width: 899px) {
          .form-heading { font-size: 22px; }
        }

        /* CTA button */
        .cta-btn {
          width: 100%;
          height: 54px;
          position: relative;
          overflow: hidden;
          border: 1px solid #BFA45A;
          font-family: 'Cinzel', serif;
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          font-weight: 500;
          cursor: pointer;
        }
        @media (max-width: 899px) {
          .cta-btn { height: 52px; font-size: 12px; }
        }

        /* SSO button */
        .sso-btn {
          width: 100%;
          height: 48px;
          background: transparent;
          border: 1px solid #1a1a10;
          color: #4a4535;
          font-family: 'Cinzel', serif;
          font-size: 10px;
          letter-spacing: 3px;
          cursor: pointer;
          text-transform: uppercase;
        }
        @media (max-width: 899px) {
          .sso-btn { height: 50px; font-size: 11px; }
        }

        /* Security badge */
        .security-badge {
          display: flex;
          justify-content: center;
          margin-top: 28px;
          font-size: 10px;
          color: #252515;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        @media (max-width: 899px) {
          .security-badge { margin-top: 24px; font-size: 11px; }
        }
      `}</style>

      <div className="auth-root">

        {/* ═══════════════════════════════════════════════════════
            LEFT PANEL  (desktop only)
        ═══════════════════════════════════════════════════════ */}
        <div className="left-panel">
          {/* bg grid */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "linear-gradient(rgba(191,164,90,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(191,164,90,0.035) 1px,transparent 1px)",
            backgroundSize: "72px 72px",
          }} />
          {/* radial glow */}
          <div style={{
            position: "absolute", width: "700px", height: "700px", borderRadius: "50%", pointerEvents: "none",
            background: "radial-gradient(circle,rgba(191,164,90,0.055) 0%,transparent 65%)",
            top: "-150px", left: "-150px",
          }} />

          {/* Logo */}
          <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: "14px", animationDelay: "0.1s" }}>
            <div style={{
              width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid #BFA45A", background: "rgba(191,164,90,0.07)",
              clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 17l4-8 4 5 3-3 4 6" stroke="#BFA45A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="19" cy="5" r="2" stroke="#BFA45A" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: "16px", color: "#d4c49a", letterSpacing: "4px" }}>AURUM</div>
              <div style={{ fontSize: "10px", color: "#4a4030", letterSpacing: "3px", marginTop: "1px" }}>WEALTH ADVISORY</div>
            </div>
          </div>

          {/* Hero text */}
          <div className="fade-up" style={{ animationDelay: "0.3s", maxWidth: "500px" }}>
            <div style={{ fontSize: "12px", color: "#BFA45A", letterSpacing: "5px", fontFamily: "'Cinzel',serif", marginBottom: "22px" }}>
              EST. MCMXCVIII
            </div>
            <h1 className="shimmer-text" style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "clamp(32px,4vw,54px)",
              lineHeight: "1.2", fontWeight: "500", marginBottom: "22px",
            }}>
              {isLogin ? <>Your Wealth,<br/>Expertly Guided</> : <>Begin Your<br/>Financial Journey</>}
            </h1>
            <p style={{ color: "#6a6050", fontSize: "18px", lineHeight: "1.8", fontStyle: "italic", maxWidth: "380px" }}>
              {isLogin
                ? "Precision portfolio management and strategic financial counsel — crafted for discerning individuals."
                : "Join a community of high-net-worth clients who trust Aurum to protect and grow their legacy."}
            </p>

            {/* divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "40px 0" }}>
              <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg,transparent,#2a2410)" }} />
              <div style={{ width: 4, height: 4, transform: "rotate(45deg)", background: "#BFA45A" }} />
              <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg,#2a2410,transparent)" }} />
            </div>

            {/* Stats */}
            <div className="stat-row">
              {[
                { value: "$4.2B", label: "Assets Under Management" },
                { value: "98%",  label: "Client Retention Rate" },
                { value: "26yr", label: "Years of Excellence" },
              ].map((s, i) => (
                <div key={i} className="stat-card" style={{
                  padding: "16px 18px", border: "1px solid #1a1a10",
                  background: "rgba(255,255,255,0.012)", flex: 1,
                }}>
                  <div style={{ fontFamily: "'Cinzel',serif", fontSize: "22px", color: "#d4c49a", fontWeight: "500" }}>{s.value}</div>
                  <div style={{ fontSize: "10px", color: "#3a3528", letterSpacing: "1.5px", marginTop: "5px", textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="fade-up" style={{ animationDelay: "0.5s", fontSize: "11px", color: "#2e2820", letterSpacing: "2px" }}>
            © 2026 AURUM WEALTH ADVISORY — REGULATED BY SEBI
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            RIGHT PANEL  (form — full width on mobile)
        ═══════════════════════════════════════════════════════ */}
        <div className="right-panel">

          {/* Corner accents (desktop) */}
          <div className="corner-accent" style={{ top: 20, right: 20, width: 20, height: 20, borderTop: "1px solid #252515", borderRight: "1px solid #252515" }} />
          <div className="corner-accent" style={{ bottom: 20, left: 20, width: 20, height: 20, borderBottom: "1px solid #252515", borderLeft: "1px solid #252515" }} />

          {/* Mobile-only logo */}
          <div className="mobile-logo">
            <div style={{
              width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid #BFA45A", background: "rgba(191,164,90,0.07)",
              clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", flexShrink: 0,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M3 17l4-8 4 5 3-3 4 6" stroke="#BFA45A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="19" cy="5" r="2" stroke="#BFA45A" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: "15px", color: "#d4c49a", letterSpacing: "4px" }}>AURUM</div>
              <div style={{ fontSize: "10px", color: "#4a4030", letterSpacing: "3px" }}>WEALTH ADVISORY</div>
            </div>
          </div>

          {/* Mobile-only hero strip */}
          <div className="mobile-hero">
            <div style={{ fontSize: "11px", color: "#BFA45A", letterSpacing: "4px", fontFamily: "'Cinzel',serif", marginBottom: "14px" }}>
              {isLogin ? "YOUR WEALTH, EXPERTLY GUIDED" : "BEGIN YOUR FINANCIAL JOURNEY"}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {[
                { value: "$4.2B", label: "AUM" },
                { value: "98%",  label: "Retention" },
                { value: "26yr", label: "Excellence" },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, padding: "10px 12px", border: "1px solid #1a1a10", background: "rgba(255,255,255,0.01)" }}>
                  <div style={{ fontFamily: "'Cinzel',serif", fontSize: "16px", color: "#d4c49a", fontWeight: "500" }}>{s.value}</div>
                  <div style={{ fontSize: "10px", color: "#3a3528", letterSpacing: "1px", marginTop: "3px", textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab switcher */}
          <div className="tab-bar panel-in" style={{ animationDelay: "0.1s" }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => switchMode(m)} className="tab-btn"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Cinzel',serif", fontSize: "11px", letterSpacing: "3px",
                  textTransform: "uppercase", marginRight: "32px",
                  color: mode === m ? "#BFA45A" : "#3a3528",
                  borderBottom: mode === m ? "1px solid #BFA45A" : "1px solid transparent",
                  marginBottom: "-1px", paddingBottom: "14px",
                }}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Animated form */}
          <div key={mode} className={isLogin ? "slide-right" : "slide-left"}>

            {/* Heading */}
            <div style={{ marginBottom: "36px" }}>
              <h2 className="form-heading">
                {isLogin ? "Welcome Back" : "Open Your Account"}
              </h2>
              <p style={{ color: "#3a3528", fontSize: "14px", marginTop: "8px", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif" }}>
                {isLogin ? "Access your private portfolio dashboard" : "Start your journey with Aurum Advisory"}
              </p>
            </div>

            {/* Name row (signup only) */}
            {!isLogin && (
              <div className="name-row">
                <div style={{ flex: 1 }}>
                  <FloatingInput id="firstName" label="First Name" value={form.firstName} onChange={set("firstName")} />
                </div>
                <div style={{ flex: 1 }}>
                  <FloatingInput id="lastName" label="Last Name" value={form.lastName} onChange={set("lastName")} />
                </div>
              </div>
            )}

            <FloatingInput id="email" label="Email Address" type="email" value={form.email} onChange={set("email")} />

            {!isLogin && (
              <FloatingInput id="phone" label="Phone Number" type="tel" value={form.phone} onChange={set("phone")} />
            )}

            <FloatingInput
              id="password" label="Password"
              type={showPass ? "text" : "password"}
              value={form.password} onChange={set("password")}
              showToggle onToggle={() => setShowPass(p => !p)}
            />

            {!isLogin && <StrengthBar password={form.password} />}

            {!isLogin && (
              <FloatingInput
                id="confirm" label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                value={form.confirm} onChange={set("confirm")}
                showToggle onToggle={() => setShowConfirm(p => !p)}
              />
            )}

            {/* Mismatch */}
            {!isLogin && form.confirm && form.password !== form.confirm && (
              <div style={{ marginTop: "-20px", marginBottom: "20px" }}>
                <span style={{ fontSize: "12px", color: "#c0392b", letterSpacing: "1.5px", fontFamily: "'Cinzel',serif" }}>
                  Passwords do not match
                </span>
              </div>
            )}

            {/* Remember / Terms */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "10px" }}>
              {isLogin ? (
                <>
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <div style={{ width: 16, height: 16, border: "1px solid #2a2a1a", flexShrink: 0 }} />
                    <span style={{ fontSize: "11px", color: "#3a3528", letterSpacing: "2px", fontFamily: "'Cinzel',serif", textTransform: "uppercase" }}>
                      Remember Me
                    </span>
                  </label>
                  <button style={{ fontSize: "11px", color: "#BFA45A", letterSpacing: "1.5px", textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", fontFamily: "'Cinzel',serif" }}>
                    Forgot Password?
                  </button>
                </>
              ) : (
                <label onClick={() => setAgreed(a => !a)} style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                  <div style={{
                    width: 17, height: 17, flexShrink: 0, marginTop: "2px",
                    border: `1px solid ${agreed ? "#BFA45A" : "#2a2a1a"}`,
                    background: agreed ? "rgba(191,164,90,0.15)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}>
                    {agreed && (
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#BFA45A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: "13px", color: "#4a4535", letterSpacing: "0.5px", lineHeight: "1.6", fontFamily: "'Cormorant Garamond',serif" }}>
                    I agree to the{" "}
                    <span style={{ color: "#BFA45A" }}>Terms of Service</span>
                    {" "}and{" "}
                    <span style={{ color: "#BFA45A" }}>Privacy Policy</span>
                  </span>
                </label>
              )}
            </div>

            {/* CTA */}
            <button
              className="cta-btn"
              onClick={handleSubmit}
              disabled={loading || !canSubmit}
              style={{
                background: (!canSubmit || loading) ? "transparent" : "linear-gradient(135deg,#BFA45A 0%,#d4b86a 50%,#BFA45A 100%)",
                opacity: !canSubmit ? 0.4 : 1,
                color: loading ? "#BFA45A" : "#0b0b09",
                backgroundSize: "200% auto",
                cursor: canSubmit && !loading ? "pointer" : "default",
              }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                  <span style={{
                    width: 17, height: 17, borderRadius: "50%",
                    border: "2px solid #BFA45A", borderTopColor: "transparent",
                    animation: "spin 0.7s linear infinite", display: "inline-block",
                  }} />
                  {isLogin ? "Authenticating..." : "Creating Account..."}
                </span>
              ) : (
                isLogin ? "Access Portfolio" : "Create Account"
              )}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "22px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "#161610" }} />
              <span style={{ fontSize: "11px", color: "#2e2820", letterSpacing: "3px", fontFamily: "'Cinzel',serif" }}>OR</span>
              <div style={{ flex: 1, height: "1px", background: "#161610" }} />
            </div>

            {/* SSO */}
            <button className="sso-btn">
              Continue with Single Sign-On (SSO)
            </button>

            {/* Switch mode */}
            <p style={{ textAlign: "center", marginTop: "22px", fontSize: "14px", color: "#3a3528", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif" }}>
              {isLogin ? "New to Aurum? " : "Already a client? "}
              <button onClick={() => switchMode(isLogin ? "signup" : "login")} style={{
                color: "#BFA45A", background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "14px",
              }}>
                {isLogin ? "Request Onboarding →" : "Sign In →"}
              </button>
            </p>
          </div>

          {/* Security badge */}
          <div className="security-badge">
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 6v6c0 5.5 3.6 10.7 8 12 4.4-1.3 8-6.5 8-12V6L12 2z" stroke="#252515" strokeWidth="1.5"/>
              </svg>
              256-bit SSL · Regulated & Insured
            </div>
          </div>
        </div>
      </div>
    </>
  );
}