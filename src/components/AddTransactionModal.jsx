import { sharedStyles } from "../styles/shared";
import { ALL_CATEGORIES } from "../constants";

export default function AddTransactionModal({ isEditing, newTx, setNewTx, onSubmit, onClose }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200,
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "var(--bg-modal)",
          border: "1px solid var(--border-modal)",
          borderRadius: 20,
          padding: 32,
          width: "min(480px, 90vw)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
          {isEditing ? "Edit Transaction" : "New Transaction"}
        </div>

        {/* number fields */}
        {[
          { label: "Date", key: "date", type: "date" },
          { label: "Description", key: "description", type: "text" },
          { label: "Amount (₹)",  key: "amount", type: "number" },
        ].map(({ label, key, type }) => (
          <div key={key}>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 600 }}>{label}</div>
            <input
              style={sharedStyles.input}
              type={type}
              placeholder={label}
              value={newTx[key]}
              onChange={(e) => setNewTx((prev) => ({ ...prev, [key]: e.target.value }))}
            />
          </div>
        ))}

        {/* Category */}
        <div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 600 }}>Category</div>
          <select
            style={{ ...sharedStyles.input, ...sharedStyles.select }}
            value={newTx.category}
            onChange={(e) => setNewTx((prev) => ({ ...prev, category: e.target.value }))}
          >
            {ALL_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Type toggle */}
        <div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6, fontWeight: 600 }}>Type</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["income", "expense"].map((t) => {
              const active = newTx.type === t;
              const color = t === "income" ? "#22c55e" : "#ef4444";
              const textColor = t === "income" ? "#4ade80" : "#f87171";
              return (
                <button
                  key={t}
                  onClick={() => setNewTx((prev) => ({ ...prev, type: t }))}
                  style={{
                    flex: 1, padding: "9px 0", borderRadius: 10, border: "1px solid",
                    borderColor: active ? color : "rgba(255,255,255,0.1)",
                    background: active ? `${color}26` : "transparent",
                    color: active ? textColor : "#9ca3af",
                    cursor: "pointer", fontWeight: 700, fontSize: 13,
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button style={{ ...sharedStyles.btn("secondary"), flex: 1 }} onClick={onClose}>Cancel</button>
          <button style={{ ...sharedStyles.btn("primary"), flex: 2 }} onClick={onSubmit}>
            {isEditing ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
