import { useState, useMemo } from "react";
import Badge from "../ui/Badge";
import CategoryDot from "../ui/CategoryDot";
import { fmt } from "../../utils/formatters";
import { sharedStyles } from "../../styles/shared";

export default function TransactionsTab({ transactions, role, onEdit, onDelete, onAdd }) {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  const allCategories = useMemo(() => [...new Set(transactions.map(t => t.category))].sort(), [transactions]);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search)list = list.filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (filterType !== "all") list = list.filter(t => t.type === filterType);
    if (filterCat  !== "all") list = list.filter(t => t.category === filterCat);
    list.sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === "amount") { av = Math.abs(av); bv = Math.abs(bv); }
      if (av < bv) return sortDir === "asc" ? -1 :  1;
      if (av > bv) return sortDir === "asc" ?  1 : -1;
      return 0;
    });
    return list;
  }, [transactions, search, filterType, filterCat, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const exportCSV = () => {
    const header = "Date,Description,Category,Type,Amount\n";
    const rows = transactions.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="tx-header">
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Transactions</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>{filtered.length} of {transactions.length} entries</div>
        </div>
        <div className="tx-header-actions">
          <button style={sharedStyles.btn("secondary")} onClick={exportCSV}>⬇ Export CSV</button>
          {role === "admin" && (
            <button style={sharedStyles.btn("primary")} onClick={onAdd}>+ Add Transaction</button>
          )}
        </div>
      </div>

      {/* filters */}
      <div className="filters-row">
        <input
          className="search-input"
          style={{ ...sharedStyles.input, maxWidth: 260 }}
          placeholder="🔍 Search description or category…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={sharedStyles.select} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select style={sharedStyles.select} value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="all">All Categories</option>
          {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(search || filterType !== "all" || filterCat !== "all") && (
          <button
            style={sharedStyles.btn("secondary")}
            onClick={() => { setSearch(""); setFilterType("all"); setFilterCat("all"); }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ ...sharedStyles.card, padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[["date", "Date"], ["description", "Description"], ["category", "Category"], ["type", "Type"], ["amount", "Amount"]].map(([k, label]) => (
                  <th key={k} style={sharedStyles.th} onClick={() => toggleSort(k)}>
                    {label} {sortKey === k ? (sortDir === "asc" ? "↑" : "↓") : ""}
                  </th>
                ))}
                {role === "admin" && <th style={sharedStyles.th}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...sharedStyles.td, textAlign: "center", padding: 40, color: "#6b7280" }}>
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id}>
                    <td style={sharedStyles.td}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12 }}>{tx.date}</span>
                    </td>
                    <td style={{ ...sharedStyles.td, color: "#f9fafb", fontWeight: 500 }}>{tx.description}</td>
                    <td style={sharedStyles.td}><CategoryDot cat={tx.category} /></td>
                    <td style={sharedStyles.td}><Badge type={tx.type} /></td>
                    <td style={{
                      ...sharedStyles.td,
                      fontFamily: "'DM Mono', monospace",
                      fontWeight: 700,
                      color: tx.type === "income" ? "#4ade80" : "#f87171",
                    }}>
                      {tx.type === "income" ? "+" : "−"}{fmt(tx.amount)}
                    </td>
                    {role === "admin" && (
                      <td style={sharedStyles.td}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button style={{ ...sharedStyles.btn("secondary"), padding: "5px 10px", fontSize: 12 }} onClick={() => onEdit(tx)}>✏️</button>
                          <button style={{ ...sharedStyles.btn("secondary"), padding: "5px 10px", fontSize: 12, color: "#f87171" }} onClick={() => onDelete(tx.id)}>🗑️</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

