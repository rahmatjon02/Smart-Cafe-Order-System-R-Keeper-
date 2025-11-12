import React from "react";
import { AdminDashboard } from "./AdminDashboard";
import { OrdersAdmin } from "./OrdersAdmin";
import { Link } from "react-router-dom";
import TablesAdmin from "./TablesAdmin";
import CategoriesAdmin from "./CategoriesAdmin";
import WaitersAdmin from "./WaitersAdmin";

export default function AdminPanel() {
  const [tab, setTab] = React.useState("dashboard");

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="p-4 max-w-7xl mx-auto">
        {/* Шапка */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          {/* Левая часть */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-center lg:justify-start">
            <div className="text-2xl font-bold whitespace-nowrap">
              Smart Cafe
            </div>

            <Link
              to={"/WaiterHome"}
              className="bg-[#1f1f1f] px-3 py-2 rounded-xs text-sm hover:bg-[#2a2a2a] transition"
            >
              Официант
            </Link>
            <Link
              to={"/Kitchen"}
              className="bg-[#1f1f1f] px-3 py-2 rounded-xs text-sm hover:bg-[#2a2a2a] transition"
            >
              Кухня
            </Link>
          </div>

          {/* Кнопки навигации */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 justify-center lg:justify-end overflow-x-auto scrollbar-hide">
            <button
              className={`px-3 sm:px-4 py-2 rounded-xs text-sm sm:text-base whitespace-nowrap ${
                tab === "dashboard"
                  ? "bg-[#8b6af0] text-black"
                  : "bg-[#1f1f1f] hover:bg-[#2a2a2a]"
              }`}
              onClick={() => setTab("dashboard")}
            >
              Панель
            </button>
            <button
              className={`px-3 sm:px-4 py-2 rounded-xs text-sm sm:text-base whitespace-nowrap ${
                tab === "orders"
                  ? "bg-[#8b6af0] text-black"
                  : "bg-[#1f1f1f] hover:bg-[#2a2a2a]"
              }`}
              onClick={() => setTab("orders")}
            >
              Заказы
            </button>
            <button
              onClick={() => setTab("tables")}
              className={`px-3 sm:px-4 py-2 rounded-xs text-sm sm:text-base whitespace-nowrap ${
                tab === "tables"
                  ? "bg-[#8b6af0] text-black"
                  : "bg-[#1f1f1f] hover:bg-[#2a2a2a]"
              }`}
            >
              Столы
            </button>
            <button
              onClick={() => setTab("categories")}
              className={`px-3 sm:px-4 py-2 rounded-xs text-sm sm:text-base whitespace-nowrap ${
                tab === "categories"
                  ? "bg-[#8b6af0] text-black"
                  : "bg-[#1f1f1f] hover:bg-[#2a2a2a]"
              }`}
            >
              Категории
            </button>
            <button
              onClick={() => setTab("waiters")}
              className={`px-3 sm:px-4 py-2 rounded-xs text-sm sm:text-base whitespace-nowrap ${
                tab === "waiters"
                  ? "bg-[#8b6af0] text-black"
                  : "bg-[#1f1f1f] hover:bg-[#2a2a2a]"
              }`}
            >
              Официанты
            </button>
          </div>
        </div>

        {/* Контент */}
        <div className="mt-4">
          {tab === "dashboard" && <AdminDashboard setTab={setTab} />}
          {tab === "orders" && <OrdersAdmin />}
          {tab === "tables" && <TablesAdmin />}
          {tab === "categories" && <CategoriesAdmin />}
          {tab === "waiters" && <WaitersAdmin />}
        </div>
      </div>
    </div>
  );
}
