import { useState } from "react";

import Topbar from "./components/Topbar";
import DashboardTab from "./components/Dashboard/DashboardTab";
import TransactionsTab from "./components/Transactions/TransactionsTab";
import InsightsTab from "./components/Insights/InsightsTab";
import AddTransactionModal from "./components/AddTransactionModal";

import { SEED_TRANSACTIONS } from "./data/seedData";

export default function App() {
  
  const [transactions, setTransactions] = useState(SEED_TRANSACTIONS);
  const [role, setRole] = useState("viewer");
  const [tab, setTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(true);

  
  const [showModal, setShowModal]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);   
  const [newTx, setNewTx] = useState({
    date: "", description: "", category: "Food", amount: "", type: "expense",
  });


  const openAddModal = () => {
    setEditTarget(null);
    setNewTx({ date: "", description: "", category: "Food", amount: "", type: "expense" });
    setShowModal(true);
  };

  const openEditModal = (tx) => {
    setEditTarget(tx.id);
    setNewTx({ date: tx.date, description: tx.description, category: tx.category, amount: Math.abs(tx.amount), type: tx.type });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!newTx.date || !newTx.description || !newTx.amount) return;
    const amt = newTx.type === "expense"
      ? -Math.abs(parseFloat(newTx.amount))
      :  Math.abs(parseFloat(newTx.amount));

    if (editTarget !== null) {
      setTransactions(ts => ts.map(t => t.id === editTarget ? { ...t, ...newTx, amount: amt } : t));
    } else {
      setTransactions(ts => [...ts, { id: Date.now(), ...newTx, amount: amt }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => setTransactions(ts => ts.filter(t => t.id !== id));


  return (
    <div
      className={darkMode ? "dark" : "light"}
      style={{ minHeight: "100vh", background: "var(--bg-root)", color: "var(--text-primary)", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 3px; }
        select option { background: var(--bg-modal); color: var(--text-primary); }
        tr:hover td { background: var(--bg-hover-row) !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.35s ease both; }

        /* ── Theme Variables ─────────────────────────────── */
        .dark {
          --bg-root:      #0a0b0f;
          --bg-card:      rgba(255,255,255,0.03);
          --bg-card-hover:rgba(255,255,255,0.05);
          --border-card:  rgba(255,255,255,0.07);
          --bg-topbar:    rgba(10,11,15,0.95);
          --border-topbar:rgba(255,255,255,0.06);
          --bg-input:     rgba(255,255,255,0.05);
          --border-input: rgba(255,255,255,0.1);
          --text-primary: #f9fafb;
          --text-secondary:#9ca3af;
          --text-body:    #d1d5db;
          --border-subtle:rgba(255,255,255,0.06);
          --border-row:   rgba(255,255,255,0.04);
          --border-insight:rgba(255,255,255,0.05);
          --bg-progress:  rgba(255,255,255,0.06);
          --bg-tooltip:   #1a1c23;
          --border-tooltip:rgba(255,255,255,0.1);
          --bg-modal:     #111318;
          --border-modal: rgba(255,255,255,0.1);
          --bg-hover-row: rgba(255,255,255,0.02);
          --scrollbar:    rgba(255,255,255,0.1);
          --chart-grid:   rgba(255,255,255,0.04);
          --chart-tick:   #6b7280;
          --toggle-bg:    rgba(255,255,255,0.07);
          --toggle-color: #f9fafb;
        }
        .light {
          --bg-root:      #f1f3f7;
          --bg-card:      #ffffff;
          --bg-card-hover:#f8fafc;
          --border-card:  rgba(0,0,0,0.07);
          --bg-topbar:    rgba(255,255,255,0.95);
          --border-topbar:rgba(0,0,0,0.07);
          --bg-input:     rgba(0,0,0,0.04);
          --border-input: rgba(0,0,0,0.12);
          --text-primary: #111318;
          --text-secondary:#6b7280;
          --text-body:    #374151;
          --border-subtle:rgba(0,0,0,0.06);
          --border-row:   rgba(0,0,0,0.04);
          --border-insight:rgba(0,0,0,0.06);
          --bg-progress:  rgba(0,0,0,0.06);
          --bg-tooltip:   #ffffff;
          --border-tooltip:rgba(0,0,0,0.1);
          --bg-modal:     #ffffff;
          --border-modal: rgba(0,0,0,0.1);
          --bg-hover-row: rgba(0,0,0,0.02);
          --scrollbar:    rgba(0,0,0,0.15);
          --chart-grid:   rgba(0,0,0,0.05);
          --chart-tick:   #9ca3af;
          --toggle-bg:    rgba(0,0,0,0.06);
          --toggle-color: #374151;
        }

        /* ── Responsive Layout ───────────────────────────── */
        .page-main { padding: 28px; max-width: 1300px; margin: 0 auto; }
        @media (max-width: 640px) { .page-main { padding: 14px; } }

        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
        @media (max-width: 1024px) { .grid-4 { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px)  { .grid-4 { grid-template-columns: 1fr; } }

        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 28px; }
        @media (max-width: 900px) { .grid-2 { grid-template-columns: 1fr; } }

        .topbar { flex-wrap: wrap; gap: 8px; }
        @media (max-width: 640px) { .topbar { padding: 10px 14px; } }
        .topbar-nav { display: flex; gap: 4px; }
        @media (max-width: 640px) {
          .topbar-nav { order: 3; width: 100%; }
          .topbar-nav button { flex: 1; padding: 8px 0 !important; font-size: 12px !important; text-align: center; }
        }
        @media (max-width: 640px) { .role-badge { display: none; } }

        .tx-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        @media (max-width: 640px) { .tx-header { flex-direction: column; align-items: flex-start; gap: 12px; } }
        .tx-header-actions { display: flex; gap: 8px; }
        @media (max-width: 640px) { .tx-header-actions { width: 100%; } .tx-header-actions button { flex: 1; } }

        .filters-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
        @media (max-width: 640px) { .filters-row .search-input { width: 100% !important; max-width: 100% !important; } }
      `}</style>

      <Topbar tab={tab} setTab={setTab} role={role} setRole={setRole} darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="page-main">
        {tab === "dashboard"    && <DashboardTab    transactions={transactions} />}
        {tab === "transactions" && <TransactionsTab transactions={transactions} role={role} onAdd={openAddModal} onEdit={openEditModal} onDelete={handleDelete} />}
        {tab === "insights"     && <InsightsTab     transactions={transactions} />}
      </div>

      {showModal && (
        <AddTransactionModal
          isEditing={editTarget !== null}
          newTx={newTx}
          setNewTx={setNewTx}
          onSubmit={handleSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

