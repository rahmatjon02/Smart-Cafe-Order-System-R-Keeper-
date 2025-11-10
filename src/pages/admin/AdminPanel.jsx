import React from "react";
import { AdminDashboard } from "./AdminDashboard";
import { OrdersAdmin } from "./OrdersAdmin";
import { Link } from "react-router-dom";
import TablesAdmin from "./TablesAdmin";
import CategoriesAdmin from "./CategoriesAdmin";

export default function AdminPanel() {
  const [tab, setTab] = React.useState("dashboard");

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="p-4 max-w-7xl mx-auto">
        {/* Шапка */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">Smart Cafe</div>
            <Link
              to={"/"}
              className="bg-[#1f1f1f] px-3 py-2 rounded-lg text-sm"
            >
              Админ
            </Link>
            <Link
              to={"/WaiterHome"}
              className="bg-[#1f1f1f] px-3 py-2 rounded-lg text-sm"
            >
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
          </div>
        </div>

        {/* Контент */}
        {tab === "dashboard" && <AdminDashboard setTab={setTab} />}
        {tab === "orders" && <OrdersAdmin />}
        {tab === "tables" && <TablesAdmin />}
        {tab === "categories" && <CategoriesAdmin />}
      </div>
    </div>
  );
}
