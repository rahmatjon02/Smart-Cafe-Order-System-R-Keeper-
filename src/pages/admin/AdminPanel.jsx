import React from "react";
import { AdminDashboard } from "./AdminDashboard";
import { OrdersAdmin } from "./OrdersAdmin";
import { ReportsAdmin } from "./ReportsAdmin";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  const [tab, setTab] = React.useState("dashboard");

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">Smart Cafe</div>
            <Link to={'/'} className="bg-[#1f1f1f] px-3 py-2 rounded-lg text-sm">
              Админ
            </Link>
            <Link to={'/WaiterHome'} className="bg-[#1f1f1f] px-3 py-2 rounded-lg text-sm">
              Официант
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              className={`px-4 py-2 rounded-lg ${
                tab === "dashboard" ? "bg-[#8b6af0] text-black" : "bg-[#1f1f1f]"
              }`}
              onClick={() => setTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                tab === "orders" ? "bg-[#8b6af0] text-black" : "bg-[#1f1f1f]"
              }`}
              onClick={() => setTab("orders")}
            >
              Orders
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                tab === "reports" ? "bg-[#8b6af0] text-black" : "bg-[#1f1f1f]"
              }`}
              onClick={() => setTab("reports")}
            >
              Reports
            </button>
          </div>
        </div>
        <div>
          {tab === "dashboard" && <AdminDashboard />}
          {tab === "orders" && <OrdersAdmin />}
          {tab === "reports" && <ReportsAdmin />}
        </div>
      </div>
    </div>
  );
}
