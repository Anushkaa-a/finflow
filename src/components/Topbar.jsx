export default function Topbar({ tab, setTab, role, setRole, darkMode, setDarkMode }) {
  const roleBadgeStyle = {
    padding: "4px 12px",
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    background: role === "admin" ? "rgba(245,158,11,0.2)" : "rgba(99,102,241,0.2)",
    color: role === "admin" ? "#fbbf24" : "#a5b4fc",
    border: `1px solid ${role === "admin" ? "rgba(245,158,11,0.3)" : "rgba(99,102,241,0.3)"}`,
  };

  return (
    <div
      className="topbar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 28px",
        borderBottom: "1px solid var(--border-topbar)",
        background: "var(--bg-topbar)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}
        >
          💰
        </div>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>FinFlow</span>
      </div>

      {/* Nav Tabs */}
      <nav className="topbar-nav">
        {["dashboard", "transactions", "insights"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              transition: "all 0.2s",
              background: tab === t ? "rgba(245,158,11,0.15)" : "transparent",
              color: tab === t ? "#f59e0b" : "var(--text-secondary)",
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Dark / Light toggle */}
        <button
          onClick={() => setDarkMode(d => !d)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            width: 36, height: 36, borderRadius: 10, border: "none",
            background: "var(--toggle-bg)", color: "var(--toggle-color)",
            cursor: "pointer", fontSize: 17, display: "flex",
            alignItems: "center", justifyContent: "center",
            transition: "background 0.2s",
          }}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <span className="role-badge" style={roleBadgeStyle}>{role === "admin" ? "👑 ADMIN" : "👁 VIEWER"}</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid var(--border-input)",
            background: "var(--bg-input)",
            color: "var(--text-primary)",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>
  );
}