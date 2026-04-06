import { CATEGORY_COLORS } from "../../constants";

export default function CategoryDot({ cat }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#d1d5db" }}>
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: CATEGORY_COLORS[cat] || "#6b7280",
          display: "inline-block",
        }}
      />
      {cat}
    </span>
  );
}
