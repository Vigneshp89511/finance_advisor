 import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const spendData = [
  { month: "Aug", amount: 4200 }, { month: "Sep", amount: 3800 }, { month: "Oct", amount: 5100 },
  { month: "Nov", amount: 4700 }, { month: "Dec", amount: 6200 }, { month: "Jan", amount: 5400 },
];
const categoryData = [
  { name: "Travel", value: 38, color: "#BFA45A" },
  { name: "Meals", value: 24, color: "#8a6e2e" },
  { name: "Software", value: 20, color: "#5a4a1e" },
  { name: "Office", value: 18, color: "#3a3010" },
];
const clientExpenses = [
  { id: "EXP-2041", date: "Mar 05", category: "Travel", merchant: "Air India", amount: 12400, status: "Approved", receipt: true },
  { id: "EXP-2038", date: "Mar 03", category: "Meals", merchant: "Taj Hotel", amount: 3200, status: "Pending", receipt: true },
  { id: "EXP-2031", date: "Feb 28", category: "Software", merchant: "Adobe CC", amount: 5499, status: "Pending", receipt: false },
  { id: "EXP-2024", date: "Feb 22", category: "Office", merchant: "Staples", amount: 1800, status: "Rejected", receipt: true },
  { id: "EXP-2019", date: "Feb 18", category: "Travel", merchant: "Uber Biz", amount: 680, status: "Approved", receipt: true },
];
const notifications = [
  { id: 1, text: "EXP-2038 is pending review — estimated 2 days", type: "info", time: "2h ago" },
  { id: 2, text: "Your monthly limit resets on Mar 31", type: "warning", time: "1d ago" },
  { id: 3, text: "₹12,400 reimbursed to your account", type: "success", time: "2d ago" },
  { id: 4, text: "Receipt missing for EXP-2031 — action needed", type: "error", time: "3d ago" },
];
const policyRules = [
  "All expenses above ₹5,000 require an original receipt.",
  "Travel expenses must be pre-approved by your reporting manager.",
  "Meal expenses are reimbursable up to ₹800 per person per meal.",
  "Software subscriptions require IT department approval.",
  "Reimbursements are processed every 1st and 15th of the month.",
];
const policyLimits = [
  { cat: "Travel (Domestic)", limit: 50000, used: 18280 },
  { cat: "Travel (International)", limit: 200000, used: 0 },
  { cat: "Meals & Entertainment", limit: 15000, used: 3200 },
  { cat: "Software & Subscriptions", limit: 20000, used: 5499 },
];

const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const StatusBadge = ({ status }) => {
  const map = {
    Approved: { bg: "rgba(39,174,96,0.12)", color: "#27ae60", border: "rgba(39,174,96,0.3)" },
    Pending:  { bg: "rgba(191,164,90,0.12)", color: "#BFA45A", border: "rgba(191,164,90,0.3)" },
    Rejected: { bg: "rgba(192,57,43,0.12)",  color: "#c0392b", border: "rgba(192,57,43,0.3)" },
  };
  const s = map[status] || map.Pending;
  return (
    <span style={{ padding: "5px 12px", borderRadius: "2px", fontSize: "11px", fontFamily: "'Cinzel',serif", letterSpacing: "1px", background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: "#0e0e0c", border: "1px solid #1e1e14", padding: "20px", borderRadius: "2px", ...style }}>
    {children}
  </div>
);

const SectionHeading = ({ title, sub }) => (
  <div style={{ marginBottom: "18px" }}>
    <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "13px", color: "#d4c49a", letterSpacing: "3px", textTransform: "uppercase" }}>{title}</h2>
    {sub && <p style={{ fontSize: "14px", color: "#4a4535", marginTop: "5px", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif" }}>{sub}</p>}
  </div>
);

const MetricCard = ({ label, value, sub, accent = "#BFA45A" }) => (
  <Card>
    <div style={{ fontSize: "11px", color: "#4a4535", letterSpacing: "2px", fontFamily: "'Cinzel',serif", textTransform: "uppercase", marginBottom: "10px" }}>{label}</div>
    <div style={{ fontFamily: "'Cinzel',serif", fontSize: "22px", color: accent, fontWeight: "500" }}>{value}</div>
    {sub && <div style={{ fontSize: "13px", color: "#4a4535", marginTop: "6px", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif" }}>{sub}</div>}
  </Card>
);

// ── Submit Expense Modal ──────────────────────────────────────────────────────
const SubmitModal = ({ onClose }) => {
  const [form, setForm] = useState({ category: "", merchant: "", amount: "", date: "", notes: "" });
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const inputStyle = {
    width: "100%", background: "#111109", border: "1px solid #2a2a1a",
    color: "#e8e0cc", padding: "12px 14px", fontFamily: "'Cormorant Garamond',serif",
    fontSize: "16px", outline: "none", boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block", fontSize: "11px", color: "#4a4535", letterSpacing: "2px",
    fontFamily: "'Cinzel',serif", textTransform: "uppercase", marginBottom: "8px",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: "16px" }}>
      <div style={{ background: "#0e0e0c", border: "1px solid #2a2a1a", width: "100%", maxWidth: "520px", padding: "28px", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ position: "absolute", top: 12, right: 12, width: 14, height: 14, borderTop: "1px solid #2a2a1a", borderRight: "1px solid #2a2a1a" }} />
        <div style={{ position: "absolute", bottom: 12, left: 12, width: 14, height: 14, borderBottom: "1px solid #2a2a1a", borderLeft: "1px solid #2a2a1a" }} />

        <SectionHeading title="Submit New Expense" sub="Fill in the details and upload your receipt" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={set("category")} style={{ ...inputStyle, cursor: "pointer" }}>
              <option value="">Select…</option>
              {["Travel", "Meals", "Software", "Office", "Other"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={labelStyle}>Date</label>
            <input type="date" value={form.date} onChange={set("date")} style={inputStyle} />
          </div>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Merchant / Vendor</label>
          <input type="text" value={form.merchant} onChange={set("merchant")} placeholder="e.g. Air India" style={inputStyle} />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Amount (₹)</label>
          <input type="number" value={form.amount} onChange={set("amount")} placeholder="0.00" style={inputStyle} />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Notes</label>
          <textarea value={form.notes} onChange={set("notes")} rows={2} style={{ ...inputStyle, resize: "none" }} />
        </div>
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Upload Receipt</label>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); setFileName(e.dataTransfer.files[0]?.name || ""); }}
            onClick={() => document.getElementById("receipt-input").click()}
            style={{ border: `1px dashed ${dragging ? "#BFA45A" : "#2a2a1a"}`, padding: "22px", textAlign: "center", cursor: "pointer", background: dragging ? "rgba(191,164,90,0.04)" : "transparent", transition: "all 0.2s" }}
          >
            <input id="receipt-input" type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={e => setFileName(e.target.files[0]?.name || "")} />
            <div style={{ fontSize: "22px", marginBottom: "6px", color: "#3a3528" }}>⬆</div>
            <div style={{ fontSize: "13px", color: fileName ? "#BFA45A" : "#4a4535", fontFamily: "'Cinzel',serif", letterSpacing: "1px" }}>
              {fileName || "Drop file or tap to browse"}
            </div>
            <div style={{ fontSize: "11px", color: "#2e2820", marginTop: "4px" }}>PDF, JPG, PNG accepted</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onClose} style={{ flex: 1, height: 48, background: "transparent", border: "1px solid #2a2a1a", color: "#6a6050", fontFamily: "'Cinzel',serif", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", textTransform: "uppercase" }}>Cancel</button>
          <button onClick={onClose} style={{ flex: 2, height: 48, background: "linear-gradient(135deg,#BFA45A,#d4b86a)", border: "none", color: "#0b0b09", fontFamily: "'Cinzel',serif", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", textTransform: "uppercase", fontWeight: 600 }}>Submit Expense</button>
        </div>
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function ClientDashboard() {
  const [active, setActive] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const navItems = [
    { id: "overview",      label: "Overview",        icon: "▦" },
    { id: "expenses",      label: "Expense History",  icon: "≡" },
    { id: "reimbursement", label: "Reimbursement",    icon: "⇄" },
    { id: "receipts",      label: "Receipts",         icon: "◈" },
    { id: "notifications", label: "Alerts",           icon: "◎" },
    { id: "profile",       label: "Profile",          icon: "◉" },
    { id: "policy",        label: "Policy",           icon: "⬡" },
  ];

  const navigate = (id) => { setActive(id); setSidebarOpen(false); };
  const filtered = filterStatus === "All" ? clientExpenses : clientExpenses.filter(e => e.status === filterStatus);

  const Sidebar = () => (
    <aside style={{
      width: isMobile ? "100%" : 240,
      minHeight: isMobile ? "auto" : "100vh",
      background: "#0c0c0a",
      borderRight: isMobile ? "none" : "1px solid #1a1a10",
      borderBottom: isMobile ? "1px solid #1a1a10" : "none",
      display: "flex", flexDirection: "column", flexShrink: 0,
      position: isMobile ? "fixed" : "relative",
      top: isMobile ? 0 : "auto",
      left: isMobile ? (sidebarOpen ? 0 : "-100%") : "auto",
      zIndex: isMobile ? 200 : "auto",
      height: isMobile ? "100vh" : "auto",
      transition: isMobile ? "left 0.3s ease" : "none",
      overflowY: "auto",
    }}>
      {/* Brand */}
      <div style={{ padding: "24px 20px", borderBottom: "1px solid #1a1a10", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #BFA45A", background: "rgba(191,164,90,0.07)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M3 17l4-8 4 5 3-3 4 6" stroke="#BFA45A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="19" cy="5" r="2" stroke="#BFA45A" strokeWidth="1.5"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: "14px", color: "#d4c49a", letterSpacing: "4px" }}>AURUM</div>
            <div style={{ fontSize: "10px", color: "#3a3020", letterSpacing: "2px", marginTop: 1 }}>CLIENT PORTAL</div>
          </div>
        </div>
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: "#4a4535", fontSize: "22px", cursor: "pointer", lineHeight: 1 }}>×</button>
        )}
      </div>

      {/* Employee chip */}
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #111109" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(191,164,90,0.15)", border: "1px solid rgba(191,164,90,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cinzel',serif", fontSize: "14px", color: "#BFA45A", flexShrink: 0 }}>PS</div>
          <div>
            <div style={{ fontSize: "15px", color: "#d4c49a" }}>Priya Sharma</div>
            <div style={{ fontSize: "11px", color: "#3a3528", marginTop: 2, letterSpacing: "1px" }}>Sales · EMP-0042</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "14px 12px" }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => navigate(item.id)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", marginBottom: 3, background: active === item.id ? "rgba(191,164,90,0.09)" : "transparent", border: active === item.id ? "1px solid rgba(191,164,90,0.18)" : "1px solid transparent", cursor: "pointer", color: active === item.id ? "#BFA45A" : "#5a5040", fontFamily: "'Cinzel',serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", textAlign: "left", transition: "all 0.2s" }}>
            <span style={{ fontSize: 15, opacity: 0.8 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Submit CTA */}
      <div style={{ padding: "0 12px 24px" }}>
        <button onClick={() => { setShowModal(true); setSidebarOpen(false); }}
          style={{ width: "100%", padding: "13px", background: "linear-gradient(135deg,#BFA45A,#d4b86a)", border: "none", color: "#0b0b09", fontFamily: "'Cinzel',serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontWeight: 600 }}>
          + Submit Expense
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0b0b09; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .shimmer-name {
          background: linear-gradient(90deg,#BFA45A 0%,#e8c96a 40%,#BFA45A 60%,#9a7e3a 100%);
          background-size: 200% auto; -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .nav-btn-hover:hover { background: rgba(191,164,90,0.07) !important; color: #BFA45A !important; }
        .table-row:hover { background: rgba(191,164,90,0.025) !important; }
        .filter-btn:hover { border-color: rgba(191,164,90,0.4) !important; color: #BFA45A !important; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 199; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #0b0b09; }
        ::-webkit-scrollbar-thumb { background: #2a2410; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.3); }
        select option { background: #111109; }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", background: "#0b0b09", fontFamily: "'Cormorant Garamond',serif", flexDirection: isMobile ? "column" : "row" }}>

        {/* Mobile overlay */}
        {isMobile && sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        {!isMobile && <Sidebar />}
        {isMobile && <Sidebar />}

        {/* ── Main ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Mobile top nav bar */}
          {isMobile && (
            <div style={{ background: "#0c0c0a", borderBottom: "1px solid #1a1a10", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #BFA45A", background: "rgba(191,164,90,0.07)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M3 17l4-8 4 5 3-3 4 6" stroke="#BFA45A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ fontFamily: "'Cinzel',serif", fontSize: "13px", color: "#d4c49a", letterSpacing: "3px" }}>AURUM</span>
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button onClick={() => setShowModal(true)} style={{ padding: "8px 14px", background: "linear-gradient(135deg,#BFA45A,#d4b86a)", border: "none", color: "#0b0b09", fontFamily: "'Cinzel',serif", fontSize: "10px", letterSpacing: "1px", cursor: "pointer", textTransform: "uppercase", fontWeight: 600 }}>+ Add</button>
                <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "1px solid #2a2a1a", color: "#BFA45A", padding: "8px 12px", cursor: "pointer", fontSize: "16px", lineHeight: 1 }}>☰</button>
              </div>
            </div>
          )}

          {/* Mobile bottom tab bar */}
          {isMobile && (
            <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0c0c0a", borderTop: "1px solid #1a1a10", display: "flex", zIndex: 100, padding: "4px 0 8px" }}>
              {navItems.slice(0, 5).map(item => (
                <button key={item.id} onClick={() => navigate(item.id)}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 4px", background: "none", border: "none", cursor: "pointer", color: active === item.id ? "#BFA45A" : "#3a3528" }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: "9px", fontFamily: "'Cinzel',serif", letterSpacing: "0.5px", textTransform: "uppercase", lineHeight: 1 }}>
                    {item.label.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <main style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 16px 100px" : "36px 36px 48px" }}>

            {/* Page header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: "11px", color: "#BFA45A", letterSpacing: "3px", fontFamily: "'Cinzel',serif", marginBottom: 6 }}>
                  {navItems.find(n => n.id === active)?.label.toUpperCase()}
                </div>
                <h1 className="shimmer-name" style={{ fontFamily: "'Cinzel',serif", fontSize: isMobile ? "22px" : "26px", fontWeight: 400 }}>
                  {active === "overview" ? "Good Morning, Priya" : navItems.find(n => n.id === active)?.label}
                </h1>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "10px", color: "#3a3528", letterSpacing: "2px", fontFamily: "'Cinzel',serif", marginBottom: 4 }}>MARCH 2026 · LIMIT</div>
                <div style={{ fontSize: "13px", color: "#6a6050", marginBottom: 5 }}>₹18,280 / ₹50,000</div>
                <div style={{ width: isMobile ? 120 : 160, height: 3, background: "#1a1a10", marginLeft: "auto" }}>
                  <div style={{ width: "36.56%", height: "100%", background: "linear-gradient(90deg,#BFA45A,#d4b86a)" }} />
                </div>
              </div>
            </div>

            {/* ── OVERVIEW ── */}
            {active === "overview" && (
              <div className="fade-up">
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                  <MetricCard label="Total Submitted" value="₹52,179" sub="This financial year" />
                  <MetricCard label="Pending" value="₹17,099" sub="2 awaiting" accent="#e67e22" />
                  <MetricCard label="Reimbursed" value="₹34,080" sub="Last: Mar 01" accent="#27ae60" />
                  <MetricCard label="Rejected" value="₹1,800" sub="1 expense" accent="#c0392b" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 12, marginBottom: 20 }}>
                  <Card>
                    <SectionHeading title="Spend Overview" sub="Monthly trend — last 6 months" />
                    <ResponsiveContainer width="100%" height={isMobile ? 160 : 190}>
                      <AreaChart data={spendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#BFA45A" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#BFA45A" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" tick={{ fill: "#4a4535", fontSize: isMobile ? 10 : 11, fontFamily: "'Cinzel',serif" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#4a4535", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#0e0e0c", border: "1px solid #2a2a1a", color: "#e8e0cc", fontFamily: "'Cinzel',serif", fontSize: 12, borderRadius: 0 }} />
                        <Area type="monotone" dataKey="amount" stroke="#BFA45A" strokeWidth={2} fill="url(#goldGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                  <Card>
                    <SectionHeading title="By Category" sub="Spend split" />
                    <ResponsiveContainer width="100%" height={120}>
                      <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                          {categoryData.map((c, i) => <Cell key={i} fill={c.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: "#0e0e0c", border: "1px solid #2a2a1a", color: "#e8e0cc", fontFamily: "'Cinzel',serif", fontSize: 12, borderRadius: 0 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: 8 }}>
                      {categoryData.map(c => (
                        <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <div style={{ width: 7, height: 7, background: c.color, borderRadius: 1 }} />
                            <span style={{ fontSize: 12, color: "#6a6050", fontFamily: "'Cinzel',serif" }}>{c.name}</span>
                          </div>
                          <span style={{ fontSize: 12, color: "#BFA45A", fontFamily: "'Cinzel',serif" }}>{c.value}%</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Recent — mobile cards, desktop table */}
                <Card>
                  <SectionHeading title="Recent Expenses" sub="Your 5 latest submissions" />
                  {isMobile ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {clientExpenses.map(e => (
                        <div key={e.id} style={{ padding: "14px", background: "#111109", border: "1px solid #1a1a10" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 12, color: "#BFA45A", fontFamily: "'Cinzel',serif" }}>{e.id}</span>
                            <StatusBadge status={e.status} />
                          </div>
                          <div style={{ fontSize: 16, color: "#d4c49a", marginBottom: 4 }}>{e.merchant}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 13, color: "#5a5040" }}>{e.category} · {e.date}</span>
                            <span style={{ fontSize: 15, color: "#e8e0cc", fontFamily: "'Cinzel',serif" }}>{fmt(e.amount)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #1a1a10" }}>
                            {["ID", "Date", "Category", "Merchant", "Amount", "Status"].map(h => (
                              <th key={h} style={{ textAlign: "left", padding: "0 0 12px", fontSize: "11px", color: "#3a3528", letterSpacing: "2px", fontFamily: "'Cinzel',serif", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {clientExpenses.map(e => (
                            <tr key={e.id} className="table-row" style={{ borderBottom: "1px solid #0f0f0d", transition: "background 0.2s" }}>
                              <td style={{ padding: "13px 0", fontSize: 13, color: "#BFA45A", fontFamily: "'Cinzel',serif" }}>{e.id}</td>
                              <td style={{ padding: "13px 0", fontSize: 14, color: "#5a5040" }}>{e.date}</td>
                              <td style={{ padding: "13px 0", fontSize: 14, color: "#5a5040" }}>{e.category}</td>
                              <td style={{ padding: "13px 0", fontSize: 15, color: "#d4c49a" }}>{e.merchant}</td>
                              <td style={{ padding: "13px 0", fontSize: 14, color: "#e8e0cc", fontFamily: "'Cinzel',serif" }}>{fmt(e.amount)}</td>
                              <td style={{ padding: "13px 0" }}><StatusBadge status={e.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* ── EXPENSE HISTORY ── */}
            {active === "expenses" && (
              <div className="fade-up">
                <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                  {["All", "Approved", "Pending", "Rejected"].map(f => (
                    <button key={f} onClick={() => setFilterStatus(f)} className="filter-btn"
                      style={{ padding: "8px 16px", background: filterStatus === f ? "rgba(191,164,90,0.1)" : "transparent", border: filterStatus === f ? "1px solid rgba(191,164,90,0.4)" : "1px solid #1a1a10", color: filterStatus === f ? "#BFA45A" : "#4a4535", fontFamily: "'Cinzel',serif", fontSize: "11px", letterSpacing: "1.5px", cursor: "pointer", textTransform: "uppercase", transition: "all 0.2s" }}>
                      {f}
                    </button>
                  ))}
                </div>
                {isMobile ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {filtered.map(e => (
                      <Card key={e.id}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 13, color: "#BFA45A", fontFamily: "'Cinzel',serif" }}>{e.id}</span>
                          <StatusBadge status={e.status} />
                        </div>
                        <div style={{ fontSize: 17, color: "#d4c49a", marginBottom: 6 }}>{e.merchant}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: 14, color: "#5a5040" }}>{e.category} · {e.date}</span>
                          <span style={{ fontSize: 16, color: "#e8e0cc", fontFamily: "'Cinzel',serif" }}>{fmt(e.amount)}</span>
                        </div>
                        <div style={{ fontSize: 13, color: e.receipt ? "#27ae60" : "#c0392b" }}>
                          {e.receipt ? "✓ Receipt uploaded" : "✗ Receipt missing"}
                        </div>
                      </Card>
                    ))}
                    {filtered.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", fontSize: 15, color: "#3a3528", fontStyle: "italic" }}>No expenses found</div>}
                  </div>
                ) : (
                  <Card>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #1a1a10" }}>
                            {["ID", "Date", "Category", "Merchant", "Amount", "Receipt", "Status"].map(h => (
                              <th key={h} style={{ textAlign: "left", padding: "0 0 12px", fontSize: "11px", color: "#3a3528", letterSpacing: "2px", fontFamily: "'Cinzel',serif", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map(e => (
                            <tr key={e.id} className="table-row" style={{ borderBottom: "1px solid #0f0f0d", transition: "background 0.2s" }}>
                              <td style={{ padding: "13px 0", fontSize: 13, color: "#BFA45A", fontFamily: "'Cinzel',serif" }}>{e.id}</td>
                              <td style={{ padding: "13px 0", fontSize: 14, color: "#5a5040" }}>{e.date}</td>
                              <td style={{ padding: "13px 0", fontSize: 14, color: "#5a5040" }}>{e.category}</td>
                              <td style={{ padding: "13px 0", fontSize: 15, color: "#d4c49a" }}>{e.merchant}</td>
                              <td style={{ padding: "13px 0", fontSize: 14, color: "#e8e0cc", fontFamily: "'Cinzel',serif" }}>{fmt(e.amount)}</td>
                              <td style={{ padding: "13px 0" }}><span style={{ fontSize: 16, color: e.receipt ? "#27ae60" : "#c0392b" }}>{e.receipt ? "✓" : "✗"}</span></td>
                              <td style={{ padding: "13px 0" }}><StatusBadge status={e.status} /></td>
                            </tr>
                          ))}
                          {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: "28px 0", textAlign: "center", fontSize: 15, color: "#3a3528", fontStyle: "italic" }}>No expenses found</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* ── REIMBURSEMENT ── */}
            {active === "reimbursement" && (
              <div className="fade-up">
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                  <MetricCard label="Total Approved" value="₹34,080" sub="Ready or paid out" accent="#27ae60" />
                  <MetricCard label="Awaiting Payout" value="₹12,400" sub="Next batch: Mar 15" accent="#BFA45A" />
                  <MetricCard label="Paid Out (FY)" value="₹21,680" sub="2 batches processed" />
                </div>
                {isMobile ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { date: "Mar 01, 2026", exps: "EXP-2019", amount: 680, method: "NEFT", ref: "TXN-9842", status: "Approved" },
                      { date: "Feb 15, 2026", exps: "EXP-2008, EXP-2009", amount: 21000, method: "NEFT", ref: "TXN-9731", status: "Approved" },
                      { date: "Mar 15, 2026", exps: "EXP-2041", amount: 12400, method: "Pending", ref: "—", status: "Pending" },
                    ].map((r, i) => (
                      <Card key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 14, color: "#d4c49a" }}>{r.date}</span>
                          <StatusBadge status={r.status} />
                        </div>
                        <div style={{ fontSize: 18, color: "#27ae60", fontFamily: "'Cinzel',serif", marginBottom: 6 }}>{fmt(r.amount)}</div>
                        <div style={{ fontSize: 13, color: "#5a5040", marginBottom: 4 }}>{r.exps}</div>
                        <div style={{ fontSize: 12, color: "#3a3528", fontFamily: "monospace" }}>{r.ref} · {r.method}</div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <SectionHeading title="Reimbursement History" sub="Detailed payout records" />
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #1a1a10" }}>
                            {["Batch Date","Expenses","Amount","Method","Reference","Status"].map(h => (
                              <th key={h} style={{ textAlign: "left", padding: "0 0 12px", fontSize: "11px", color: "#3a3528", letterSpacing: "2px", fontFamily: "'Cinzel',serif", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { date: "Mar 01, 2026", exps: "EXP-2019", amount: 680, method: "NEFT", ref: "TXN-9842", status: "Approved" },
                            { date: "Feb 15, 2026", exps: "EXP-2008, EXP-2009", amount: 21000, method: "NEFT", ref: "TXN-9731", status: "Approved" },
                            { date: "Mar 15, 2026", exps: "EXP-2041", amount: 12400, method: "Pending", ref: "—", status: "Pending" },
                          ].map((r, i) => (
                            <tr key={i} className="table-row" style={{ borderBottom: "1px solid #0f0f0d", transition: "background 0.2s" }}>
                              <td style={{ padding: "13px 0", fontSize: 14, color: "#d4c49a" }}>{r.date}</td>
                              <td style={{ padding: "13px 0", fontSize: 13, color: "#5a5040", fontFamily: "'Cinzel',serif" }}>{r.exps}</td>
                              <td style={{ padding: "13px 0", fontSize: 15, color: "#27ae60", fontFamily: "'Cinzel',serif" }}>{fmt(r.amount)}</td>
                              <td style={{ padding: "13px 0", fontSize: 14, color: "#5a5040" }}>{r.method}</td>
                              <td style={{ padding: "13px 0", fontSize: 13, color: "#BFA45A", fontFamily: "monospace" }}>{r.ref}</td>
                              <td style={{ padding: "13px 0" }}><StatusBadge status={r.status} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* ── RECEIPTS ── */}
            {active === "receipts" && (
              <div className="fade-up">
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 12 }}>
                  {clientExpenses.filter(e => e.receipt).map(e => (
                    <Card key={e.id} style={{ cursor: "pointer" }}>
                      <div style={{ background: "#111109", height: isMobile ? 70 : 90, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, border: "1px dashed #1a1a10" }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#3a3528" strokeWidth="1.5"/>
                          <polyline points="14 2 14 8 20 8" stroke="#3a3528" strokeWidth="1.5"/>
                          <line x1="16" y1="13" x2="8" y2="13" stroke="#3a3528" strokeWidth="1.5"/>
                          <line x1="16" y1="17" x2="8" y2="17" stroke="#3a3528" strokeWidth="1.5"/>
                        </svg>
                      </div>
                      <div style={{ fontSize: 12, color: "#BFA45A", fontFamily: "'Cinzel',serif", marginBottom: 4 }}>{e.id}</div>
                      <div style={{ fontSize: isMobile ? 14 : 15, color: "#d4c49a", marginBottom: 4 }}>{e.merchant}</div>
                      <div style={{ fontSize: 12, color: "#5a5040", marginBottom: 10 }}>{fmt(e.amount)}</div>
                      <StatusBadge status={e.status} />
                    </Card>
                  ))}
                  {clientExpenses.filter(e => !e.receipt).map(e => (
                    <div key={e.id} onClick={() => setShowModal(true)} style={{ border: "1px dashed #2a2a1a", padding: 16, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, minHeight: isMobile ? 140 : 180 }}>
                      <div style={{ fontSize: 12, color: "#BFA45A", fontFamily: "'Cinzel',serif", textAlign: "center" }}>{e.id}</div>
                      <div style={{ fontSize: 12, color: "#c0392b", fontFamily: "'Cinzel',serif" }}>⚠ Missing</div>
                      <div style={{ fontSize: 11, color: "#3a3528", fontFamily: "'Cinzel',serif", letterSpacing: "1px", textTransform: "uppercase" }}>+ Upload</div>
                    </div>
                  ))}
                  <div onClick={() => setShowModal(true)} style={{ border: "1px dashed #1a1a10", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 16px", cursor: "pointer", color: "#3a3528", minHeight: isMobile ? 140 : 180 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>+</div>
                    <div style={{ fontSize: "11px", fontFamily: "'Cinzel',serif", letterSpacing: "1.5px", textTransform: "uppercase" }}>Upload Receipt</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {active === "notifications" && (
              <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {notifications.map(n => {
                  const c = { info: "#3498db", warning: "#BFA45A", success: "#27ae60", error: "#c0392b" }[n.type];
                  return (
                    <Card key={n.id} style={{ display: "flex", alignItems: "flex-start", gap: 14, borderLeft: `2px solid ${c}` }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, marginTop: 6, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 15, color: "#d4c49a", lineHeight: "1.65", marginBottom: 6 }}>{n.text}</p>
                        <span style={{ fontSize: "12px", color: "#3a3528", fontFamily: "'Cinzel',serif", letterSpacing: "1px" }}>{n.time}</span>
                      </div>
                      <button style={{ background: "none", border: "none", color: "#3a3528", cursor: "pointer", fontSize: "20px", lineHeight: 1, flexShrink: 0 }}>×</button>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* ── PROFILE ── */}
            {active === "profile" && (
              <div className="fade-up">
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
                  <Card>
                    <SectionHeading title="Personal Information" sub="Your identity and contact details" />
                    {[["Full Name","Priya Sharma"],["Employee ID","EMP-0042"],["Department","Sales"],["Designation","Senior Associate"],["Email","priya.sharma@aurum.in"],["Phone","+91 98765 43210"]].map(([k,v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #111109", padding: "12px 0", flexWrap: "wrap", gap: 4 }}>
                        <span style={{ fontSize: "12px", color: "#4a4535", fontFamily: "'Cinzel',serif", letterSpacing: "1px" }}>{k}</span>
                        <span style={{ fontSize: 15, color: "#d4c49a" }}>{v}</span>
                      </div>
                    ))}
                    <button style={{ width: "100%", marginTop: 16, padding: "12px", background: "transparent", border: "1px solid #2a2a1a", color: "#6a6050", fontFamily: "'Cinzel',serif", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", textTransform: "uppercase" }}>Edit Profile</button>
                  </Card>
                  <Card>
                    <SectionHeading title="Bank Details" sub="Your registered reimbursement account" />
                    {[["Account Holder","Priya Sharma"],["Bank","HDFC Bank"],["Account No.","••••••••4821"],["IFSC Code","HDFC0001234"],["Branch","Bengaluru MG Road"],["UPI ID","priya@hdfcbank"]].map(([k,v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #111109", padding: "12px 0", flexWrap: "wrap", gap: 4 }}>
                        <span style={{ fontSize: "12px", color: "#4a4535", fontFamily: "'Cinzel',serif", letterSpacing: "1px" }}>{k}</span>
                        <span style={{ fontSize: 15, color: "#d4c49a" }}>{v}</span>
                      </div>
                    ))}
                    <button style={{ width: "100%", marginTop: 16, padding: "12px", background: "transparent", border: "1px solid #BFA45A", color: "#BFA45A", fontFamily: "'Cinzel',serif", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", textTransform: "uppercase" }}>Update Bank Details</button>
                  </Card>
                </div>
              </div>
            )}

            {/* ── POLICY ── */}
            {active === "policy" && (
              <div className="fade-up">
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 12, marginBottom: 14 }}>
                  {policyLimits.map(p => {
                    const pct = Math.round((p.used / p.limit) * 100);
                    return (
                      <Card key={p.cat}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 4 }}>
                          <span style={{ fontSize: 14, color: "#d4c49a", fontFamily: "'Cinzel',serif" }}>{p.cat}</span>
                          <span style={{ fontSize: "12px", color: "#4a4535" }}>Limit: {fmt(p.limit)}</span>
                        </div>
                        <div style={{ width: "100%", height: 4, background: "#1a1a10", marginBottom: 8, borderRadius: 2 }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: pct > 80 ? "#c0392b" : "linear-gradient(90deg,#BFA45A,#d4b86a)", transition: "width 0.6s ease", borderRadius: 2 }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "13px", color: "#6a6050" }}>Used: {fmt(p.used)}</span>
                          <span style={{ fontSize: "13px", color: pct > 80 ? "#c0392b" : "#BFA45A", fontFamily: "'Cinzel',serif" }}>{pct}%</span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                <Card>
                  <SectionHeading title="Policy Guidelines" sub="Company reimbursement rules" />
                  {policyRules.map((rule, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, padding: "13px 0", borderBottom: i < policyRules.length - 1 ? "1px solid #111109" : "none" }}>
                      <span style={{ color: "#BFA45A", fontSize: "12px", fontFamily: "'Cinzel',serif", flexShrink: 0, marginTop: 2 }}>0{i + 1}</span>
                      <span style={{ fontSize: 15, color: "#8a7a5a", lineHeight: "1.7" }}>{rule}</span>
                    </div>
                  ))}
                </Card>
              </div>
            )}

          </main>
        </div>
      </div>

      {showModal && <SubmitModal onClose={() => setShowModal(false)} />}
    </>
  );
}