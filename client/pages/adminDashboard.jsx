import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

// ── Data ─────────────────────────────────────────────────────────────────────
const monthlyData = [
  { month: "Aug", amount: 84000, approved: 72000, rejected: 12000 },
  { month: "Sep", amount: 96000, approved: 88000, rejected: 8000 },
  { month: "Oct", amount: 112000, approved: 98000, rejected: 14000 },
  { month: "Nov", amount: 104000, approved: 91000, rejected: 13000 },
  { month: "Dec", amount: 138000, approved: 124000, rejected: 14000 },
  { month: "Jan", amount: 121000, approved: 108000, rejected: 13000 },
];
const deptData = [
  { dept: "Sales", amount: 42000 },
  { dept: "Eng", amount: 28000 },
  { dept: "Mkt", amount: 18000 },
  { dept: "HR", amount: 8000 },
  { dept: "Fin", amount: 5000 },
];
const categoryPie = [
  { name: "Travel", value: 42, color: "#BFA45A" },
  { name: "Meals", value: 21, color: "#8a6e2e" },
  { name: "Software", value: 24, color: "#5a4a1e" },
  { name: "Office", value: 13, color: "#3a3010" },
];
const adminExpenses = [
  { id: "EXP-2041", employee: "Priya Sharma",  dept: "Sales",       category: "Travel",   amount: 12400, status: "Pending",  risk: "Low",    date: "Mar 05" },
  { id: "EXP-2040", employee: "Rohan Mehta",   dept: "Engineering", category: "Software", amount: 28000, status: "Pending",  risk: "High",   date: "Mar 05" },
  { id: "EXP-2038", employee: "Anika Patel",   dept: "Marketing",   category: "Meals",    amount: 3200,  status: "Pending",  risk: "Low",    date: "Mar 03" },
  { id: "EXP-2035", employee: "Dev Kapoor",    dept: "Finance",     category: "Travel",   amount: 45000, status: "Pending",  risk: "Medium", date: "Mar 02" },
  { id: "EXP-2031", employee: "Kavya Nair",    dept: "HR",          category: "Office",   amount: 5499,  status: "Approved", risk: "Low",    date: "Feb 28" },
  { id: "EXP-2028", employee: "Arjun Singh",   dept: "Sales",       category: "Travel",   amount: 18600, status: "Approved", risk: "Low",    date: "Feb 26" },
  { id: "EXP-2025", employee: "Sneha Reddy",   dept: "Marketing",   category: "Software", amount: 9800,  status: "Rejected", risk: "Medium", date: "Feb 24" },
];
const employees = [
  { name: "Priya Sharma",  dept: "Sales",       limit: 50000,  used: 18280, id: "EMP-0042", status: "Active" },
  { name: "Rohan Mehta",   dept: "Engineering", limit: 40000,  used: 28000, id: "EMP-0038", status: "Active" },
  { name: "Anika Patel",   dept: "Marketing",   limit: 30000,  used: 3200,  id: "EMP-0051", status: "Active" },
  { name: "Dev Kapoor",    dept: "Finance",      limit: 50000,  used: 45000, id: "EMP-0029", status: "Active" },
  { name: "Kavya Nair",    dept: "HR",           limit: 20000,  used: 5499,  id: "EMP-0063", status: "Active" },
  { name: "Arjun Singh",   dept: "Sales",        limit: 50000,  used: 18600, id: "EMP-0071", status: "Active" },
  { name: "Sneha Reddy",   dept: "Marketing",    limit: 30000,  used: 9800,  id: "EMP-0055", status: "Suspended" },
];
const auditLogs = [
  { time: "10:42 AM", action: "Expense EXP-2039 approved",                  user: "Admin",  type: "approve" },
  { time: "10:15 AM", action: "Flag raised on EXP-2040 — unusual amount",   user: "System", type: "flag"    },
  { time: "09:58 AM", action: "Employee D. Kapoor limit updated to ₹50,000", user: "Admin",  type: "edit"    },
  { time: "09:30 AM", action: "Tax validation passed for Feb batch",          user: "System", type: "tax"     },
  { time: "Yesterday","action": "Reimbursement batch ₹1,24,000 processed",   user: "Admin",  type: "payment" },
  { time: "Yesterday","action": "New employee EMP-0071 onboarded",           user: "Admin",  type: "edit"    },
  { time: "Mar 09",   action: "Fraud alert dismissed for EXP-2020",          user: "Admin",  type: "flag"    },
];
const taxData = [
  { id: "EXP-2041", merchant: "Air India",  amount: 12400, gstin: "27AADCA0001A1Z3",  tax: 18, status: "Approved" },
  { id: "EXP-2040", merchant: "Adobe CC",   amount: 28000, gstin: "29AAGCA8789B1ZP",  tax: 18, status: "Approved" },
  { id: "EXP-2038", merchant: "Taj Hotel",  amount: 3200,  gstin: "Pending",           tax: 28, status: "Pending"  },
  { id: "EXP-2031", merchant: "Staples",    amount: 5499,  gstin: "—",                 tax: 12, status: "Rejected" },
];
const fraudAlerts = [
  { id: "EXP-2040", employee: "Rohan Mehta",  issue: "Amount 340% above category average",    risk: "High",   amount: 28000, dept: "Engineering" },
  { id: "EXP-2035", employee: "Dev Kapoor",   issue: "Duplicate merchant submission (7 days)", risk: "Medium", amount: 45000, dept: "Finance"      },
];
const payments = [
  { name: "Priya Sharma", bank: "HDFC ••4821",  amount: 12400, count: 1, method: "NEFT" },
  { name: "Anika Patel",  bank: "ICICI ••9302", amount: 3200,  count: 1, method: "NEFT" },
  { name: "Kavya Nair",   bank: "SBI ••1156",   amount: 5499,  count: 1, method: "UPI"  },
  { name: "Arjun Singh",  bank: "HDFC ••7743",  amount: 18600, count: 2, method: "NEFT" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

const StatusBadge = ({ status }) => {
  const map = {
    Approved:  { bg: "rgba(39,174,96,0.12)",  color: "#27ae60", border: "rgba(39,174,96,0.3)"  },
    Pending:   { bg: "rgba(191,164,90,0.12)", color: "#BFA45A", border: "rgba(191,164,90,0.3)" },
    Rejected:  { bg: "rgba(192,57,43,0.12)",  color: "#c0392b", border: "rgba(192,57,43,0.3)"  },
    Active:    { bg: "rgba(39,174,96,0.12)",  color: "#27ae60", border: "rgba(39,174,96,0.3)"  },
    Suspended: { bg: "rgba(192,57,43,0.12)",  color: "#c0392b", border: "rgba(192,57,43,0.3)"  },
  };
  const s = map[status] || map.Pending;
  return (
    <span style={{ padding: "4px 11px", borderRadius: "2px", fontSize: "11px", fontFamily: "'Cinzel',serif", letterSpacing: "1px", background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
};

const RiskBadge = ({ risk }) => {
  const map = { Low: { color: "#27ae60", bg: "rgba(39,174,96,0.1)" }, Medium: { color: "#e67e22", bg: "rgba(230,126,34,0.1)" }, High: { color: "#c0392b", bg: "rgba(192,57,43,0.1)" } };
  const s = map[risk] || map.Low;
  return <span style={{ padding: "3px 9px", borderRadius: "2px", fontSize: "10px", fontFamily: "'Cinzel',serif", letterSpacing: "1px", background: s.bg, color: s.color, whiteSpace: "nowrap" }}>{risk}</span>;
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

const tooltipStyle = { background: "#0e0e0c", border: "1px solid #2a2a1a", color: "#e8e0cc", fontFamily: "'Cinzel',serif", fontSize: 12, borderRadius: 0 };

// ── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [active, setActive]           = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile]       = useState(false);
  const [approvals, setApprovals]     = useState(adminExpenses);
  const [notifDismissed, setNotifDismissed] = useState([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleApproval = (id, action) => {
    setApprovals(prev => prev.map(e => e.id === id ? { ...e, status: action } : e));
  };

  const navItems = [
    { id: "overview",   label: "Overview",    icon: "▦" },
    { id: "approvals",  label: "Approvals",   icon: "✓" },
    { id: "analytics",  label: "Analytics",   icon: "◈" },
    { id: "employees",  label: "Employees",   icon: "◉" },
    { id: "fraud",      label: "Fraud",       icon: "⚑" },
    { id: "tax",        label: "Tax",         icon: "⬡" },
    { id: "audit",      label: "Audit Logs",  icon: "≡" },
    { id: "payments",   label: "Payments",    icon: "⇄" },
  ];

  const navigate = (id) => { setActive(id); setSidebarOpen(false); };
  const pendingCount = approvals.filter(e => e.status === "Pending").length;

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const Sidebar = () => (
    <aside style={{
      width: isMobile ? "80%" : 240, maxWidth: isMobile ? 300 : "none",
      minHeight: "100vh", background: "#0a0a08",
      borderRight: "1px solid #1a1a10",
      display: "flex", flexDirection: "column", flexShrink: 0,
      position: isMobile ? "fixed" : "relative",
      top: 0, left: isMobile ? (sidebarOpen ? 0 : "-100%") : "auto",
      zIndex: isMobile ? 250 : "auto",
      transition: "left 0.3s ease",
      overflowY: "auto",
    }}>
      {/* Brand */}
      <div style={{ padding: "24px 20px", borderBottom: "1px solid #1a1a10", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #BFA45A", background: "rgba(191,164,90,0.08)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M3 17l4-8 4 5 3-3 4 6" stroke="#BFA45A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="19" cy="5" r="2" stroke="#BFA45A" strokeWidth="1.5"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: "14px", color: "#d4c49a", letterSpacing: "4px" }}>AURUM</div>
            <div style={{ fontSize: "10px", color: "#BFA45A", letterSpacing: "2px", marginTop: 1 }}>ADMIN CONSOLE</div>
          </div>
        </div>
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", color: "#4a4535", fontSize: "22px", cursor: "pointer" }}>×</button>
        )}
      </div>

      {/* Admin chip */}
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #111109" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(191,164,90,0.15)", border: "1px solid rgba(191,164,90,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cinzel',serif", fontSize: "13px", color: "#BFA45A", flexShrink: 0 }}>AK</div>
          <div>
            <div style={{ fontSize: "15px", color: "#d4c49a" }}>Aditi Kulkarni</div>
            <div style={{ fontSize: "11px", color: "#BFA45A", marginTop: 2, letterSpacing: "1px" }}>Super Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "14px 12px" }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => navigate(item.id)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", marginBottom: 3, background: active === item.id ? "rgba(191,164,90,0.09)" : "transparent", border: active === item.id ? "1px solid rgba(191,164,90,0.18)" : "1px solid transparent", cursor: "pointer", color: active === item.id ? "#BFA45A" : "#5a5040", fontFamily: "'Cinzel',serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", textAlign: "left", transition: "all 0.2s", position: "relative" }}>
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            {item.label}
            {item.id === "approvals" && pendingCount > 0 && (
              <span style={{ marginLeft: "auto", background: "#BFA45A", color: "#0b0b09", borderRadius: "10px", fontSize: "10px", fontFamily: "'Cinzel',serif", padding: "1px 7px", fontWeight: 700 }}>{pendingCount}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Alert strip */}
      <div style={{ margin: "0 12px 24px" }}>
        <div style={{ padding: "12px 14px", background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.2)" }}>
          <div style={{ fontSize: "10px", color: "#c0392b", fontFamily: "'Cinzel',serif", letterSpacing: "2px", marginBottom: 4 }}>⚑ ACTIVE ALERTS</div>
          <div style={{ fontSize: "13px", color: "#8a7a5a" }}>2 high-risk flags require immediate review</div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080808; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .shimmer-title {
          background: linear-gradient(90deg,#BFA45A 0%,#e8c96a 40%,#BFA45A 60%,#9a7e3a 100%);
          background-size: 200% auto; -webkit-background-clip: text;
          -webkit-text-fill-color: transparent; background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .table-row:hover { background: rgba(191,164,90,0.025) !important; }
        .action-approve:hover { background: rgba(39,174,96,0.2) !important; }
        .action-reject:hover  { background: rgba(192,57,43,0.2)  !important; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.65); z-index: 249; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #080808; }
        ::-webkit-scrollbar-thumb { background: #2a2410; }
        select option { background: #111109; }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", background: "#080808", fontFamily: "'Cormorant Garamond',serif", flexDirection: isMobile ? "column" : "row" }}>

        {isMobile && sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}
        <Sidebar />

        {/* ── Main Column ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Mobile top bar */}
          {isMobile && (
            <div style={{ background: "#0a0a08", borderBottom: "1px solid #1a1a10", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, position: "sticky", top: 0, zIndex: 100 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #BFA45A", background: "rgba(191,164,90,0.07)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M3 17l4-8 4 5 3-3 4 6" stroke="#BFA45A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: "13px", color: "#d4c49a", letterSpacing: "3px" }}>AURUM</span>
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: "10px", color: "#BFA45A", letterSpacing: "2px", marginLeft: 8 }}>ADMIN</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {pendingCount > 0 && (
                  <span style={{ background: "#c0392b", color: "#fff", borderRadius: "10px", fontSize: "11px", padding: "2px 8px", fontFamily: "'Cinzel',serif" }}>{pendingCount}</span>
                )}
                <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "1px solid #2a2a1a", color: "#BFA45A", padding: "8px 12px", cursor: "pointer", fontSize: "16px" }}>☰</button>
              </div>
            </div>
          )}

          {/* Mobile bottom tab bar */}
          {isMobile && (
            <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#0a0a08", borderTop: "1px solid #1a1a10", display: "flex", zIndex: 100, padding: "4px 0 8px" }}>
              {navItems.slice(0, 5).map(item => (
                <button key={item.id} onClick={() => navigate(item.id)}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 2px", background: "none", border: "none", cursor: "pointer", color: active === item.id ? "#BFA45A" : "#3a3528", position: "relative" }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  <span style={{ fontSize: "9px", fontFamily: "'Cinzel',serif", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                    {item.label.split(" ")[0]}
                  </span>
                  {item.id === "approvals" && pendingCount > 0 && (
                    <span style={{ position: "absolute", top: 4, right: "50%", transform: "translateX(10px)", background: "#c0392b", color: "#fff", borderRadius: "50%", width: 14, height: 14, fontSize: "9px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cinzel',serif" }}>{pendingCount}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* ── Content ── */}
          <main style={{ flex: 1, overflowY: "auto", padding: isMobile ? "20px 16px 100px" : "36px 36px 48px" }}>

            {/* Page header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: "11px", color: "#BFA45A", letterSpacing: "3px", fontFamily: "'Cinzel',serif", marginBottom: 6 }}>
                  {navItems.find(n => n.id === active)?.label.toUpperCase()}
                </div>
                <h1 className="shimmer-title" style={{ fontFamily: "'Cinzel',serif", fontSize: isMobile ? "22px" : "26px", fontWeight: 400 }}>
                  {active === "overview" ? "Financial Command" : navItems.find(n => n.id === active)?.label}
                </h1>
                <p style={{ fontSize: "14px", color: "#4a4535", marginTop: 5, fontStyle: "italic" }}>
                  Expense governance · March 2026
                </p>
              </div>
              {!isMobile && (
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ padding: "8px 16px", background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.2)", fontSize: "12px", color: "#c0392b", fontFamily: "'Cinzel',serif", letterSpacing: "1px" }}>
                    ⚑ 2 High Risk Flags
                  </div>
                  <div style={{ padding: "8px 16px", background: "rgba(191,164,90,0.08)", border: "1px solid rgba(191,164,90,0.2)", fontSize: "12px", color: "#BFA45A", fontFamily: "'Cinzel',serif", letterSpacing: "1px" }}>
                    {pendingCount} Pending Approvals
                  </div>
                </div>
              )}
            </div>

            {/* ══ OVERVIEW ══════════════════════════════════════════════════ */}
            {active === "overview" && (
              <div className="fade-up">
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                  <MetricCard label="Total Expenses (MTD)" value="₹2.4L"   sub="Mar 1–8, 2026" />
                  <MetricCard label="Pending Approval"     value="₹94,099" sub="5 expenses"        accent="#e67e22" />
                  <MetricCard label="Reimbursed (MTD)"     value="₹1.24L"  sub="Batch: Mar 01"     accent="#27ae60" />
                  <MetricCard label="Flagged Items"        value="2"        sub="Needs review"      accent="#c0392b" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr", gap: 12, marginBottom: 20 }}>
                  <Card>
                    <SectionHeading title="Monthly Expense Trend" sub="Approved vs rejected — company-wide" />
                    <ResponsiveContainer width="100%" height={isMobile ? 160 : 200}>
                      <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="approvedGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#BFA45A" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#BFA45A" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="rejectedGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#c0392b" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#c0392b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" tick={{ fill: "#4a4535", fontSize: 11, fontFamily: "'Cinzel',serif" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#4a4535", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Area type="monotone" dataKey="approved" stroke="#BFA45A" strokeWidth={2} fill="url(#approvedGrad)" name="Approved" />
                        <Area type="monotone" dataKey="rejected" stroke="#c0392b" strokeWidth={1.5} fill="url(#rejectedGrad)" name="Rejected" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                  <Card>
                    <SectionHeading title="Quick Actions" sub="Common admin tasks" />
                    {[
                      { label: "Process Reimbursements", color: "#27ae60", section: "payments"  },
                      { label: "Review Fraud Flags",     color: "#c0392b", section: "fraud"     },
                      { label: "Export Tax Report",      color: "#BFA45A", section: "tax"       },
                      { label: "Manage Employees",       color: "#3498db", section: "employees" },
                      { label: "View Audit Logs",        color: "#9b59b6", section: "audit"     },
                    ].map(a => (
                      <button key={a.label} onClick={() => setActive(a.section)}
                        style={{ display: "block", width: "100%", padding: "11px 14px", marginBottom: 8, background: "transparent", border: `1px solid ${a.color}22`, color: a.color, fontFamily: "'Cinzel',serif", fontSize: "11px", letterSpacing: "1.5px", cursor: "pointer", textTransform: "uppercase", textAlign: "left", transition: "all 0.2s" }}>
                        {a.label}
                      </button>
                    ))}
                  </Card>
                </div>

                {/* Recent approvals preview */}
                <Card>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
                    <SectionHeading title="Pending Approvals" sub="Expenses awaiting your decision" />
                    <button onClick={() => setActive("approvals")} style={{ background: "none", border: "1px solid rgba(191,164,90,0.3)", color: "#BFA45A", fontFamily: "'Cinzel',serif", fontSize: "10px", letterSpacing: "2px", padding: "6px 14px", cursor: "pointer", textTransform: "uppercase" }}>View All</button>
                  </div>
                  {isMobile ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {approvals.filter(e => e.status === "Pending").slice(0, 3).map(e => (
                        <div key={e.id} style={{ padding: 14, background: "#111109", border: "1px solid #1a1a10" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ fontSize: 12, color: "#BFA45A", fontFamily: "'Cinzel',serif" }}>{e.id}</span>
                            <RiskBadge risk={e.risk} />
                          </div>
                          <div style={{ fontSize: 16, color: "#d4c49a", marginBottom: 4 }}>{e.employee}</div>
                          <div style={{ fontSize: 13, color: "#5a5040", marginBottom: 10 }}>{e.category} · {fmt(e.amount)}</div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => handleApproval(e.id, "Approved")} style={{ flex: 1, padding: "8px", background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.25)", color: "#27ae60", fontFamily: "'Cinzel',serif", fontSize: "10px", letterSpacing: "1px", cursor: "pointer" }}>Approve</button>
                            <button onClick={() => handleApproval(e.id, "Rejected")} style={{ flex: 1, padding: "8px", background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.25)", color: "#c0392b", fontFamily: "'Cinzel',serif", fontSize: "10px", letterSpacing: "1px", cursor: "pointer" }}>Reject</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #1a1a10" }}>
                            {["ID","Employee","Dept","Category","Amount","Risk","Actions"].map(h => (
                              <th key={h} style={{ textAlign: "left", padding: "0 0 12px", fontSize: "11px", color: "#3a3528", letterSpacing: "2px", fontFamily: "'Cinzel',serif", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {approvals.filter(e => e.status === "Pending").map(e => (
                            <tr key={e.id} className="table-row" style={{ borderBottom: "1px solid #0f0f0d", transition: "background 0.2s" }}>
                              <td style={{ padding: "13px 0", fontSize: 13, color: "#BFA45A", fontFamily: "'Cinzel',serif" }}>{e.id}</td>
                              <td style={{ padding: "13px 0", fontSize: 15, color: "#d4c49a" }}>{e.employee}</td>
                              <td style={{ padding: "13px 0", fontSize: 13, color: "#5a5040" }}>{e.dept}</td>
                              <td style={{ padding: "13px 0", fontSize: 13, color: "#5a5040" }}>{e.category}</td>
                              <td style={{ padding: "13px 0", fontSize: 14, color: "#e8e0cc", fontFamily: "'Cinzel',serif" }}>{fmt(e.amount)}</td>
                              <td style={{ padding: "13px 0" }}><RiskBadge risk={e.risk} /></td>
                              <td style={{ padding: "13px 0" }}>
                                <div style={{ display: "flex", gap: 6 }}>
                                  <button onClick={() => handleApproval(e.id, "Approved")} className="action-approve" style={{ padding: "5px 12px", background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.25)", color: "#27ae60", fontFamily: "'Cinzel',serif", fontSize: "10px", letterSpacing: "1px", cursor: "pointer", transition: "background 0.2s" }}>Approve</button>
                                  <button onClick={() => handleApproval(e.id, "Rejected")} className="action-reject"  style={{ padding: "5px 12px", background: "rgba(192,57,43,0.1)",  border: "1px solid rgba(192,57,43,0.25)",  color: "#c0392b", fontFamily: "'Cinzel',serif", fontSize: "10px", letterSpacing: "1px", cursor: "pointer", transition: "background 0.2s" }}>Reject</button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* ══ APPROVALS ════════════════════════════════════════════════ */}
            {active === "approvals" && (
              <div className="fade-up">
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                  <MetricCard label="Pending"  value={approvals.filter(e=>e.status==="Pending").length}   sub="Awaiting decision" accent="#e67e22" />
                  <MetricCard label="Approved" value={approvals.filter(e=>e.status==="Approved").length}  sub="This month"        accent="#27ae60" />
                  <MetricCard label="Rejected" value={approvals.filter(e=>e.status==="Rejected").length}  sub="This month"        accent="#c0392b" />
                  <MetricCard label="Total"    value={approvals.length}                                    sub="All submissions" />
                </div>
                {isMobile ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {approvals.map(e => (
                      <Card key={e.id}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 13, color: "#BFA45A", fontFamily: "'Cinzel',serif" }}>{e.id}</span>
                          <div style={{ display: "flex", gap: 6 }}>
                            <RiskBadge risk={e.risk} />
                            <StatusBadge status={e.status} />
                          </div>
                        </div>
                        <div style={{ fontSize: 17, color: "#d4c49a", marginBottom: 4 }}>{e.employee}</div>
                        <div style={{ fontSize: 14, color: "#5a5040", marginBottom: 4 }}>{e.dept} · {e.category}</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                          <span style={{ fontSize: 13, color: "#5a5040" }}>{e.date}</span>
                          <span style={{ fontSize: 17, color: "#e8e0cc", fontFamily: "'Cinzel',serif" }}>{fmt(e.amount)}</span>
                        </div>
                        {e.status === "Pending" && (
                          <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={() => handleApproval(e.id, "Approved")} style={{ flex: 1, padding: "10px", background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.25)", color: "#27ae60", fontFamily: "'Cinzel',serif", fontSize: "11px", cursor: "pointer" }}>✓ Approve</button>
                            <button onClick={() => handleApproval(e.id, "Rejected")} style={{ flex: 1, padding: "10px", background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.25)", color: "#c0392b", fontFamily: "'Cinzel',serif", fontSize: "11px", cursor: "pointer" }}>✗ Reject</button>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <SectionHeading title="All Expense Submissions" sub="Review and take action on employee expenses" />
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #1a1a10" }}>
                            {["ID","Employee","Dept","Category","Amount","Risk","Date","Status","Actions"].map(h => (
                              <th key={h} style={{ textAlign: "left", padding: "0 0 12px", fontSize: "11px", color: "#3a3528", letterSpacing: "2px", fontFamily: "'Cinzel',serif", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {approvals.map(e => (
                            <tr key={e.id} className="table-row" style={{ borderBottom: "1px solid #0f0f0d", transition: "background 0.2s" }}>
                              <td style={{ padding: "13px 0", fontSize: 13, color: "#BFA45A", fontFamily: "'Cinzel',serif" }}>{e.id}</td>
                              <td style={{ padding: "13px 0", fontSize: 15, color: "#d4c49a" }}>{e.employee}</td>
                              <td style={{ padding: "13px 0", fontSize: 13, color: "#5a5040" }}>{e.dept}</td>
                              <td style={{ padding: "13px 0", fontSize: 13, color: "#5a5040" }}>{e.category}</td>
                              <td style={{ padding: "13px 0", fontSize: 14, color: "#e8e0cc", fontFamily: "'Cinzel',serif" }}>{fmt(e.amount)}</td>
                              <td style={{ padding: "13px 0" }}><RiskBadge risk={e.risk} /></td>
                              <td style={{ padding: "13px 0", fontSize: 13, color: "#4a4535" }}>{e.date}</td>
                              <td style={{ padding: "13px 0" }}><StatusBadge status={e.status} /></td>
                              <td style={{ padding: "13px 0" }}>
                                {e.status === "Pending" ? (
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <button onClick={() => handleApproval(e.id, "Approved")} className="action-approve" style={{ padding: "5px 11px", background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.25)", color: "#27ae60", fontFamily: "'Cinzel',serif", fontSize: "10px", cursor: "pointer", transition: "background 0.2s" }}>Approve</button>
                                    <button onClick={() => handleApproval(e.id, "Rejected")} className="action-reject"  style={{ padding: "5px 11px", background: "rgba(192,57,43,0.1)",  border: "1px solid rgba(192,57,43,0.25)",  color: "#c0392b", fontFamily: "'Cinzel',serif", fontSize: "10px", cursor: "pointer", transition: "background 0.2s" }}>Reject</button>
                                  </div>
                                ) : <StatusBadge status={e.status} />}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* ══ ANALYTICS ════════════════════════════════════════════════ */}
            {active === "analytics" && (
              <div className="fade-up">
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                  <MetricCard label="Avg Per Employee" value="₹8,420"  sub="This month" />
                  <MetricCard label="Highest Single"   value="₹45,000" sub="Dev Kapoor" accent="#e67e22" />
                  <MetricCard label="Top Category"     value="Travel"  sub="42% of spend" accent="#BFA45A" />
                  <MetricCard label="YoY Change"       value="+12.4%"  sub="vs last year" accent="#27ae60" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  <Card>
                    <SectionHeading title="Dept. Spend (MTD)" sub="By department — current month" />
                    <ResponsiveContainer width="100%" height={isMobile ? 160 : 190}>
                      <BarChart data={deptData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <XAxis dataKey="dept" tick={{ fill: "#4a4535", fontSize: 11, fontFamily: "'Cinzel',serif" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#4a4535", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Bar dataKey="amount" fill="#8a6e2e" radius={[3, 3, 0, 0]} name="Amount" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                  <Card>
                    <SectionHeading title="Category Breakdown" sub="By spend type" />
                    <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: isMobile ? "center" : "stretch", gap: isMobile ? 12 : 0 }}>
                      <ResponsiveContainer width={isMobile ? "50%" : "100%"} height={130}>
                        <PieChart>
                          <Pie data={categoryPie} cx="50%" cy="50%" innerRadius={35} outerRadius={56} dataKey="value" strokeWidth={0}>
                            {categoryPie.map((c, i) => <Cell key={i} fill={c.color} />)}
                          </Pie>
                          <Tooltip contentStyle={tooltipStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div style={{ flex: 1, marginTop: isMobile ? 0 : 10 }}>
                        {categoryPie.map(c => (
                          <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                              <div style={{ width: 7, height: 7, background: c.color, borderRadius: 1 }} />
                              <span style={{ fontSize: 13, color: "#6a6050", fontFamily: "'Cinzel',serif" }}>{c.name}</span>
                            </div>
                            <span style={{ fontSize: 13, color: "#BFA45A", fontFamily: "'Cinzel',serif" }}>{c.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
                <Card>
                  <SectionHeading title="6-Month Trend" sub="Company-wide expense trajectory" />
                  <ResponsiveContainer width="100%" height={isMobile ? 160 : 200}>
                    <LineChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                      <XAxis dataKey="month" tick={{ fill: "#4a4535", fontSize: 11, fontFamily: "'Cinzel',serif" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#4a4535", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Line type="monotone" dataKey="amount"   stroke="#BFA45A" strokeWidth={2} dot={{ fill: "#BFA45A", r: 3 }} name="Total" />
                      <Line type="monotone" dataKey="approved" stroke="#27ae60" strokeWidth={1.5} dot={false} name="Approved" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            )}

            {/* ══ EMPLOYEES ════════════════════════════════════════════════ */}
            {active === "employees" && (
              <div className="fade-up">
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                  <MetricCard label="Total Employees"  value={employees.length}                                         sub="On platform" />
                  <MetricCard label="Active"           value={employees.filter(e=>e.status==="Active").length}          sub="This month"    accent="#27ae60" />
                  <MetricCard label="Suspended"        value={employees.filter(e=>e.status==="Suspended").length}       sub="Under review"  accent="#c0392b" />
                  <MetricCard label="Avg Utilization"  value={Math.round(employees.reduce((a,e)=>a+(e.used/e.limit)*100,0)/employees.length)+"%"} sub="Of monthly limit" accent="#BFA45A" />
                </div>
                {isMobile ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {employees.map(emp => {
                      const pct = Math.round((emp.used / emp.limit) * 100);
                      return (
                        <Card key={emp.id}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <div>
                              <div style={{ fontSize: 16, color: "#d4c49a", marginBottom: 3 }}>{emp.name}</div>
                              <div style={{ fontSize: 12, color: "#4a4535", fontFamily: "'Cinzel',serif" }}>{emp.id} · {emp.dept}</div>
                            </div>
                            <StatusBadge status={emp.status} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontSize: 13, color: "#5a5040" }}>Used: {fmt(emp.used)}</span>
                            <span style={{ fontSize: 13, color: "#5a5040" }}>Limit: {fmt(emp.limit)}</span>
                          </div>
                          <div style={{ width: "100%", height: 4, background: "#1a1a10", borderRadius: 2, marginBottom: 4 }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: pct > 80 ? "#c0392b" : "linear-gradient(90deg,#BFA45A,#d4b86a)", borderRadius: 2 }} />
                          </div>
                          <span style={{ fontSize: 12, color: pct > 80 ? "#c0392b" : "#BFA45A", fontFamily: "'Cinzel',serif" }}>{pct}% utilized</span>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card>
                    <SectionHeading title="Employee Roster" sub="Manage accounts and expense limits" />
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #1a1a10" }}>
                            {["Employee","ID","Dept","Monthly Limit","Used (MTD)","Utilization","Status"].map(h => (
                              <th key={h} style={{ textAlign: "left", padding: "0 0 12px", fontSize: "11px", color: "#3a3528", letterSpacing: "2px", fontFamily: "'Cinzel',serif", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {employees.map(emp => {
                            const pct = Math.round((emp.used / emp.limit) * 100);
                            return (
                              <tr key={emp.id} className="table-row" style={{ borderBottom: "1px solid #0f0f0d", transition: "background 0.2s" }}>
                                <td style={{ padding: "13px 0", fontSize: 15, color: "#d4c49a" }}>{emp.name}</td>
                                <td style={{ padding: "13px 0", fontSize: 12, color: "#4a4535", fontFamily: "'Cinzel',serif" }}>{emp.id}</td>
                                <td style={{ padding: "13px 0", fontSize: 13, color: "#5a5040" }}>{emp.dept}</td>
                                <td style={{ padding: "13px 0", fontSize: 14, color: "#e8e0cc", fontFamily: "'Cinzel',serif" }}>{fmt(emp.limit)}</td>
                                <td style={{ padding: "13px 0", fontSize: 14, color: "#BFA45A", fontFamily: "'Cinzel',serif" }}>{fmt(emp.used)}</td>
                                <td style={{ padding: "13px 0", minWidth: 120 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ flex: 1, height: 3, background: "#1a1a10", borderRadius: 2 }}>
                                      <div style={{ width: `${pct}%`, height: "100%", background: pct > 80 ? "#c0392b" : "#BFA45A", borderRadius: 2 }} />
                                    </div>
                                    <span style={{ fontSize: 12, color: pct > 80 ? "#c0392b" : "#6a6050", fontFamily: "'Cinzel',serif", minWidth: 32 }}>{pct}%</span>
                                  </div>
                                </td>
                                <td style={{ padding: "13px 0" }}><StatusBadge status={emp.status} /></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* ══ FRAUD ════════════════════════════════════════════════════ */}
            {active === "fraud" && (
              <div className="fade-up">
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                  <MetricCard label="High Risk"         value="2"  sub="Immediate review" accent="#c0392b" />
                  <MetricCard label="Medium Risk"       value="1"  sub="Monitor closely"  accent="#e67e22" />
                  <MetricCard label="Clean Submissions" value="28" sub="This month"       accent="#27ae60" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                  {fraudAlerts.map(f => (
                    <Card key={f.id} style={{ borderLeft: `2px solid ${f.risk === "High" ? "#c0392b" : "#e67e22"}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "'Cinzel',serif", fontSize: "13px", color: "#BFA45A" }}>{f.id}</span>
                            <RiskBadge risk={f.risk} />
                          </div>
                          <p style={{ fontSize: 16, color: "#d4c49a", marginBottom: 5 }}>{f.employee} <span style={{ color: "#4a4535", fontSize: 13 }}>· {f.dept}</span></p>
                          <p style={{ fontSize: 14, color: "#6a6050", fontStyle: "italic", marginBottom: 8 }}>{f.issue}</p>
                          <p style={{ fontSize: 15, color: "#e67e22", fontFamily: "'Cinzel',serif" }}>{fmt(f.amount)}</p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          <button style={{ padding: "9px 18px", background: "transparent", border: `1px solid ${f.risk === "High" ? "#c0392b" : "#e67e22"}`, color: f.risk === "High" ? "#c0392b" : "#e67e22", fontFamily: "'Cinzel',serif", fontSize: "10px", letterSpacing: "2px", cursor: "pointer", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                            {f.risk === "High" ? "Freeze & Investigate" : "Request Clarification"}
                          </button>
                          <button style={{ padding: "9px 18px", background: "transparent", border: "1px solid #1a1a10", color: "#4a4535", fontFamily: "'Cinzel',serif", fontSize: "10px", letterSpacing: "2px", cursor: "pointer", textTransform: "uppercase" }}>
                            Dismiss Flag
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <Card>
                  <SectionHeading title="Risk Detection Rules" sub="Auto-flagging criteria applied to all submissions" />
                  {[
                    { rule: "Amount exceeds 300% of category average",          status: "Active" },
                    { rule: "Duplicate merchant submission within 7 days",       status: "Active" },
                    { rule: "Missing receipt for amounts above ₹5,000",          status: "Active" },
                    { rule: "Expense submitted outside business hours",          status: "Active" },
                    { rule: "Round-number amounts (₹10K, ₹20K, ₹50K exactly)",  status: "Active" },
                  ].map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 4 ? "1px solid #111109" : "none" }}>
                      <span style={{ fontSize: 15, color: "#8a7a5a", lineHeight: "1.6", flex: 1, marginRight: 16 }}>{r.rule}</span>
                      <span style={{ fontSize: "11px", color: "#27ae60", fontFamily: "'Cinzel',serif", letterSpacing: "1px" }}>{r.status}</span>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {/* ══ TAX ══════════════════════════════════════════════════════ */}
            {active === "tax" && (
              <div className="fade-up">
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                  <MetricCard label="GST Eligible"        value="₹1.8L"  sub="Valid GSTIN invoices"  accent="#27ae60" />
                  <MetricCard label="Pending Verification" value="₹42,000" sub="GSTIN check in progress" accent="#e67e22" />
                  <MetricCard label="Non-Compliant"        value="₹5,499"  sub="Missing GSTIN"          accent="#c0392b" />
                </div>
                {isMobile ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {taxData.map(t => {
                      const st = t.status === "Validated" || t.status === "Approved" ? "Approved" : t.status === "Missing" ? "Rejected" : "Pending";
                      return (
                        <Card key={t.id}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontSize: 13, color: "#BFA45A", fontFamily: "'Cinzel',serif" }}>{t.id}</span>
                            <StatusBadge status={st} />
                          </div>
                          <div style={{ fontSize: 17, color: "#d4c49a", marginBottom: 5 }}>{t.merchant}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <span style={{ fontSize: 14, color: "#e8e0cc", fontFamily: "'Cinzel',serif" }}>{fmt(t.amount)}</span>
                            <span style={{ fontSize: 13, color: "#BFA45A" }}>GST {t.tax}% = {fmt(Math.round(t.amount * t.tax / 100))}</span>
                          </div>
                          <div style={{ fontSize: 11, color: "#4a4535", fontFamily: "monospace", wordBreak: "break-all" }}>{t.gstin}</div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card>
                    <SectionHeading title="Tax Validation Status" sub="GSTIN compliance and GST calculation" />
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 580 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #1a1a10" }}>
                            {["Expense ID","Merchant","Amount","GSTIN","Tax %","Tax Amount","Status"].map(h => (
                              <th key={h} style={{ textAlign: "left", padding: "0 0 12px", fontSize: "11px", color: "#3a3528", letterSpacing: "2px", fontFamily: "'Cinzel',serif", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {taxData.map(t => {
                            const st = t.status === "Validated" || t.status === "Approved" ? "Approved" : t.status === "Missing" ? "Rejected" : "Pending";
                            return (
                              <tr key={t.id} className="table-row" style={{ borderBottom: "1px solid #0f0f0d", transition: "background 0.2s" }}>
                                <td style={{ padding: "13px 0", fontSize: 13, color: "#BFA45A", fontFamily: "'Cinzel',serif" }}>{t.id}</td>
                                <td style={{ padding: "13px 0", fontSize: 15, color: "#d4c49a" }}>{t.merchant}</td>
                                <td style={{ padding: "13px 0", fontSize: 14, color: "#e8e0cc", fontFamily: "'Cinzel',serif" }}>{fmt(t.amount)}</td>
                                <td style={{ padding: "13px 0", fontSize: 11, color: "#6a6050", fontFamily: "monospace" }}>{t.gstin}</td>
                                <td style={{ padding: "13px 0", fontSize: 14, color: "#BFA45A" }}>{t.tax}%</td>
                                <td style={{ padding: "13px 0", fontSize: 14, color: "#e8e0cc", fontFamily: "'Cinzel',serif" }}>{fmt(Math.round(t.amount * t.tax / 100))}</td>
                                <td style={{ padding: "13px 0" }}><StatusBadge status={st} /></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <button style={{ marginTop: 16, padding: "10px 24px", background: "transparent", border: "1px solid #BFA45A", color: "#BFA45A", fontFamily: "'Cinzel',serif", fontSize: "10px", letterSpacing: "2px", cursor: "pointer", textTransform: "uppercase" }}>
                      Export Tax Report (PDF)
                    </button>
                  </Card>
                )}
              </div>
            )}

            {/* ══ AUDIT LOGS ═══════════════════════════════════════════════ */}
            {active === "audit" && (
              <div className="fade-up">
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
                  <MetricCard label="Total Actions"  value="142"  sub="Last 30 days" />
                  <MetricCard label="Approvals"      value="98"   sub="By admin"    accent="#27ae60" />
                  <MetricCard label="System Events"  value="34"   sub="Auto-logged" accent="#3498db" />
                  <MetricCard label="Fraud Flags"    value="10"   sub="Last 30 days" accent="#c0392b" />
                </div>
                <Card>
                  <SectionHeading title="Activity Trail" sub="Tamper-proof log of all system and admin actions" />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {auditLogs.map((log, i) => {
                      const typeColor = { approve: "#27ae60", flag: "#c0392b", edit: "#BFA45A", tax: "#3498db", payment: "#9b59b6" };
                      const typeIcon  = { approve: "✓", flag: "⚑", edit: "✎", tax: "⬡", payment: "⇄" };
                      return (
                        <div key={i} style={{ display: "flex", gap: 14, padding: "15px 0", borderBottom: i < auditLogs.length - 1 ? "1px solid #111109" : "none" }}>
                          <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${typeColor[log.type]}18`, border: `1px solid ${typeColor[log.type]}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, color: typeColor[log.type] }}>
                            {typeIcon[log.type]}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 15, color: "#d4c49a", marginBottom: 5, lineHeight: "1.5" }}>{log.action}</p>
                            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                              <span style={{ fontSize: "12px", color: "#4a4535", fontFamily: "'Cinzel',serif", letterSpacing: "1px" }}>{log.time}</span>
                              <span style={{ fontSize: "12px", color: typeColor[log.type], fontFamily: "'Cinzel',serif", letterSpacing: "1px" }}>by {log.user}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            )}

            {/* ══ PAYMENTS ═════════════════════════════════════════════════ */}
            {active === "payments" && (
              <div className="fade-up">
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
                  <MetricCard label="Ready to Process" value={fmt(payments.reduce((a,p)=>a+p.amount,0))} sub={`${payments.length} employees`} accent="#BFA45A" />
                  <MetricCard label="Processed (MTD)"  value="₹1,24,000" sub="Batch: Mar 01"   accent="#27ae60" />
                  <MetricCard label="Next Batch Date"  value="Mar 15"    sub="In 7 days" />
                </div>
                {isMobile ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                    {payments.map((p, i) => (
                      <Card key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <span style={{ fontSize: 16, color: "#d4c49a" }}>{p.name}</span>
                          <span style={{ fontSize: 17, color: "#27ae60", fontFamily: "'Cinzel',serif" }}>{fmt(p.amount)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                          <span style={{ fontSize: 13, color: "#5a5040", fontFamily: "monospace" }}>{p.bank}</span>
                          <span style={{ fontSize: 12, color: "#4a4535" }}>{p.count} expense(s) · {p.method}</span>
                        </div>
                        <button style={{ width: "100%", padding: "10px", background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.25)", color: "#27ae60", fontFamily: "'Cinzel',serif", fontSize: "11px", letterSpacing: "1px", cursor: "pointer" }}>Pay Now</button>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
                      <SectionHeading title="Reimbursement Queue" sub="Approved expenses ready for payout" />
                      <button style={{ padding: "10px 24px", background: "linear-gradient(135deg,#BFA45A,#d4b86a)", border: "none", color: "#0b0b09", fontFamily: "'Cinzel',serif", fontSize: "10px", letterSpacing: "2px", cursor: "pointer", textTransform: "uppercase", fontWeight: 600 }}>
                        Process All Payments
                      </button>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid #1a1a10" }}>
                            {["Employee","Bank Account","Method","Expenses","Amount","Action"].map(h => (
                              <th key={h} style={{ textAlign: "left", padding: "0 0 12px", fontSize: "11px", color: "#3a3528", letterSpacing: "2px", fontFamily: "'Cinzel',serif", textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((p, i) => (
                            <tr key={i} className="table-row" style={{ borderBottom: "1px solid #0f0f0d", transition: "background 0.2s" }}>
                              <td style={{ padding: "13px 0", fontSize: 15, color: "#d4c49a" }}>{p.name}</td>
                              <td style={{ padding: "13px 0", fontSize: 13, color: "#6a6050", fontFamily: "monospace" }}>{p.bank}</td>
                              <td style={{ padding: "13px 0", fontSize: 13, color: "#4a4535" }}>{p.method}</td>
                              <td style={{ padding: "13px 0", fontSize: 13, color: "#4a4535" }}>{p.count} expense(s)</td>
                              <td style={{ padding: "13px 0", fontSize: 15, color: "#27ae60", fontFamily: "'Cinzel',serif" }}>{fmt(p.amount)}</td>
                              <td style={{ padding: "13px 0" }}>
                                <button className="action-approve" style={{ padding: "6px 14px", background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.25)", color: "#27ae60", fontFamily: "'Cinzel',serif", fontSize: "10px", letterSpacing: "1px", cursor: "pointer", transition: "background 0.2s" }}>Pay Now</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}
                <Card>
                  <SectionHeading title="Payment History" sub="Processed reimbursement batches" />
                  {[
                    { date: "Mar 01, 2026", employees: 8,  total: 124000, method: "NEFT Batch",  ref: "BATCH-0031" },
                    { date: "Feb 15, 2026", employees: 11, total: 198400, method: "NEFT Batch",  ref: "BATCH-0030" },
                    { date: "Feb 01, 2026", employees: 9,  total: 142800, method: "NEFT Batch",  ref: "BATCH-0029" },
                  ].map((b, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 0", borderBottom: i < 2 ? "1px solid #111109" : "none", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <div style={{ fontSize: 15, color: "#d4c49a", marginBottom: 4 }}>{b.date}</div>
                        <div style={{ fontSize: 13, color: "#4a4535" }}>{b.employees} employees · {b.method} · <span style={{ fontFamily: "monospace", color: "#BFA45A" }}>{b.ref}</span></div>
                      </div>
                      <span style={{ fontSize: 17, color: "#27ae60", fontFamily: "'Cinzel',serif" }}>{fmt(b.total)}</span>
                    </div>
                  ))}
                </Card>
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
}