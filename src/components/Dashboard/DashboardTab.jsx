import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";

import SummaryCard from "../ui/SummaryCard";
import CustomTooltip from "../ui/CustomTooltip";
import CategoryDot from "../ui/CategoryDot";
import { BALANCE_TREND } from "../../data/seedData";
import { CATEGORY_COLORS } from "../../constants";
import { fmtShort } from "../../utils/formatters";
import { sharedStyles } from "../../styles/shared";

export default function DashboardTab({ transactions }) {
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

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em" }}>Financial Overview</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>All figures based on recorded transactions</div>
      </div>

      {/* Summary-cards */}
      <div className="grid-4">
        <SummaryCard label="Total Balance"  value={fmtShort(balance)}       sub={`${savingsRate}% savings rate`} color="#f59e0b" icon="💳" />
        <SummaryCard label="Total Income"   value={fmtShort(totalIncome)}   sub={`${transactions.filter(t => t.type === "income").length} transactions`} color="#22c55e" icon="📈" />
        <SummaryCard label="Total Expenses" value={fmtShort(totalExpenses)} sub={`${transactions.filter(t => t.type === "expense").length} transactions`} color="#ef4444" icon="📉" />
        <SummaryCard label="Transactions"   value={transactions.length}     sub="recorded entries" color="#8b5cf6" icon="🗒️" />
      </div>

      {/* charts row*/}
      <div className="grid-2">
        <div style={sharedStyles.card}>
          <div style={sharedStyles.cardTitle}>Balance Trend</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={BALANCE_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "var(--chart-tick)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={fmtShort} tick={{ fill: "var(--chart-tick)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="balance" name="Balance" stroke="#f59e0b" strokeWidth={2.5}
                dot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#f59e0b" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* spending-breakdown */}
        <div style={sharedStyles.card}>
          <div style={sharedStyles.cardTitle}>Spending Breakdown</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ResponsiveContainer width="50%" height={220}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#6b7280"} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => fmtShort(v)}
                  contentStyle={{ background: "var(--bg-tooltip)", border: "1px solid var(--border-tooltip)", borderRadius: 10, color: "var(--text-primary)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              {categoryData.slice(0, 6).map((d) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <CategoryDot cat={d.name} />
                  <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "#9ca3af" }}>{fmtShort(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/*monthly bar chart */}
      <div style={sharedStyles.card}>
        <div style={sharedStyles.cardTitle}>Monthly Income vs Expenses</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyMap} barGap={4} barCategoryGap="30%">
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
