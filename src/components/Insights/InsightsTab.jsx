import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

import CategoryDot from "../ui/CategoryDot";
import CustomTooltip from "../ui/CustomTooltip";
import { CATEGORY_COLORS } from "../../constants";
import { fmt, fmtShort } from "../../utils/formatters";
import { sharedStyles } from "../../styles/shared";

export default function InsightsTab({ transactions }) {
  const totalIncome = useMemo(() => transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.filter(t => t.type === "expense").reduce((s, t) => s + Math.abs(t.amount), 0), [transactions]);
  const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);
  const savingsRate = useMemo(() => totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : "0.0", [balance, totalIncome]);

  const categoryData = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const monthlyMap = useMemo(() => {
    const m = {};
    transactions.forEach(t => {
      const mo = t.date.slice(0, 7);
      if (!m[mo]) m[mo] = { month: mo, income: 0, expense: 0 };
      if (t.type === "income")  m[mo].income  += t.amount;
      if (t.type === "expense") m[mo].expense += Math.abs(t.amount);
    });
    return Object.values(m)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(r => ({
        ...r,
        month: new Date(r.month + "-01").toLocaleString("default", { month: "short", year: "2-digit" }),
      }));
  }, [transactions]);

  const allCategories = useMemo(() => [...new Set(transactions.map(t => t.category))].sort(), [transactions]);
  const topCategory = categoryData[0]?.name || "—";
  const expenseTxs = transactions.filter(t => t.type === "expense");
  const incomeTxs = transactions.filter(t => t.type === "income");

  const keyInsights = [
    { label: "Highest Spending Category", value: topCategory, icon: "🏆", color: "#f59e0b" },
    { label: "Savings Rate", value: `${savingsRate}%`, icon: "💰", color: savingsRate >= 20 ? "#22c55e" : "#ef4444" },
    { label: "Avg. Transaction Value", value: fmtShort(totalExpenses / (expenseTxs.length || 1)), icon: "📊", color: "#8b5cf6" },
    { label: "Largest Expense", value: fmt(Math.max(...expenseTxs.map(t => Math.abs(t.amount)))), icon: "⚠️", color: "#ef4444" },
    { label: "Largest Income", value: fmt(Math.max(...incomeTxs.map(t => t.amount))), icon: "✅", color: "#22c55e" },
    { label: "Categories Tracked", value: allCategories.length, icon: "🗂️", color: "#06b6d4" },
  ];

  return (
    <div className="fade-in">
      <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 24 }}>Spending Insights</div>

      <div className="grid-2">
        {/* key observations */}
        <div style={sharedStyles.card}>
          <div style={sharedStyles.cardTitle}>Key Observations</div>
          {keyInsights.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 0", borderBottom: "1px solid var(--border-insight)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{item.label}</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: item.color, fontFamily: "'DM Mono', monospace" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/*progress bars */}
        <div style={sharedStyles.card}>
          <div style={sharedStyles.cardTitle}>Category Breakdown</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {categoryData.map((d) => {
              const pct = totalExpenses > 0 ? ((d.value / totalExpenses) * 100).toFixed(1) : 0;
              return (
                <div key={d.name}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <CategoryDot cat={d.name} />
                    <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "var(--text-secondary)" }}>
                      {fmtShort(d.value)} ({pct}%)
                    </span>
                  </div>
                  <div style={{ height: 5, borderRadius: 99, background: "var(--bg-progress)", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${pct}%`, borderRadius: 99,
                      background: CATEGORY_COLORS[d.name] || "#6b7280",
                      transition: "width 0.6s ease",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* monthly bar chart*/}
      <div style={sharedStyles.card}>
        <div style={sharedStyles.cardTitle}>Monthly Income vs Expenses</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyMap}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis dataKey="month" tick={{ fill: "var(--chart-tick)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmtShort} tick={{ fill: "var(--chart-tick)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
            <Bar dataKey="income"  name="Income"  fill="#22c55e" radius={[5, 5, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
