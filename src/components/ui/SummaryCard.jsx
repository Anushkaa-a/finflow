export default function SummaryCard({ label, value, sub, color, icon }) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-card)",
        borderRadius: 16,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 32px ${color}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: color }} />
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'DM Mono', monospace", letterSpacing: "-0.02em" }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color }}>{sub}</div>}
    </div>
  );
}

