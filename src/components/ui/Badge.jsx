export default function Badge({ type }) {
  const isIncome = type === "income";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.05em",
        background: isIncome ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
        color: isIncome ? "#4ade80" : "#f87171",
      }}
    >
      {isIncome ? "▲ INCOME" : "▼ EXPENSE"}
    </span>
  );
}
