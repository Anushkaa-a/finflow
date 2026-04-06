# FinFlow – Finance Dashboard UI

A simple finance dashboard built using React and Recharts.

## Project Structure

```
src/
├── App.jsx (main file, handles state + layout)
├── data/
│   └── seedData.js (dummy transactions)
├── constants/
│   └── index.js (category colors)
├── utils/
│   └── formatters.js (helper functions)
├── styles/
│   └── shared.js (common styles)
└── components/
    ├── Topbar.jsx (navigation + role switch)
    ├── AddTransactionModal.jsx (add/edit form)
    ├── ui/
    │   ├── SummaryCard.jsx
    │   ├── Badge.jsx
    │   ├── CategoryDot.jsx
    │   └── CustomTooltip.jsx
    ├── Dashboard/
    │   └── DashboardTab.jsx
    ├── Transactions/
    │   └── TransactionsTab.jsx
    └── Insights/
        └── InsightsTab.jsx
```

## How to Run

```
npm install
npm run dev
```

## Features

* Dashboard with balance, income, and expense summary
* Charts (line, pie, bar) using Recharts
* Transactions table with search, filter, and sorting
* Add / edit / delete transactions (admin mode)
* Insights section with spending breakdown
* Export data as CSV
* Basic light/dark mode toggle
* Responsive layout

## Notes

* No backend used, everything is handled in React state
* Data is pre-filled using dummy data
* Role switching is just for UI (no authentication)
