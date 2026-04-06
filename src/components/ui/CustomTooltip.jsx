import { fmtShort } from "../../utils/formatters";

export default function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "var(--bg-tooltip)",
        border: "1px solid var(--border-tooltip)",
        borderRadius: 10,
        padding: "10px 14px",
      }}
    >
      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, fontWeight: 700, color: p.color }}>
          {p.name}: {fmtShort(p.value)}
        </div>
      ))}
    </div>
  );
}