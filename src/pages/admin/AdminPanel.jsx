import React from "react";
import AdminDashboard from "./AdminDashboard";
import  OrdersAdmin  from "./OrdersAdmin";
import { Link } from "react-router-dom";
import TablesAdmin from "./TablesAdmin";
import CategoriesAdmin from "./CategoriesAdmin";
import WaitersAdmin from "./WaitersAdmin";
import DiscountsAdmin from "./DiscountsAdmin";

export default function AdminPanel() {
  const [tab, setTab] = React.useState("dashboard");

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white">
      <div className="p-4 max-w-7xl mx-auto px-3 sm:px-6">
        {/* Шапка */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          {/* Левая часть */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-center lg:justify-start">
            <div className="text-2xl font-bold whitespace-nowrap">
              Smart Cafe
            </div>

            <Link
              to={"/WaiterHome"}
              className="bg-[#1f1f1f] px-3 py-2 rounded-md text-sm hover:bg-[#2a2a2a] transition"
            >
              Официант
            </Link>
            <Link
              to={"/Kitchen"}
              className="bg-[#1f1f1f] px-3 py-2 rounded-md text-sm hover:bg-[#2a2a2a] transition"
            >
              Кухня
            </Link>
          </div>

          {/* Кнопки навигации */}
          <div className="relative">
            <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 sm:pb-0">
              {[
                { key: "dashboard", label: "Панель" },
                { key: "orders", label: "Заказы" },
                { key: "tables", label: "Столы" },
                { key: "categories", label: "Категории" },
                { key: "waiters", label: "Официанты" },
                { key: "discounts", label: "Акции" },
              ].map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setTab(btn.key)}
                  className={`px-4 py-2 rounded-md text-sm sm:text-base whitespace-nowrap snap-start transition ${
                    tab === btn.key
                      ? "bg-[#8b6af0] "
                      : "bg-[#1f1f1f] hover:bg-[#2a2a2a]"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Градиентные края — для красоты на мобильных */}
            {/* <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0b0b0b] to-transparent pointer-events-none"></div> */}
            {/* <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0b0b0b] to-transparent pointer-events-none"></div> */}
          </div>
        </div>

        {/* Контент */}
        <div className="mt-4">
          {tab === "dashboard" && <AdminDashboard setTab={setTab} />}
          {tab === "orders" && <OrdersAdmin />}
          {tab === "tables" && <TablesAdmin />}
          {tab === "categories" && <CategoriesAdmin />}
          {tab === "waiters" && <WaitersAdmin />}
          {tab === "discounts" && <DiscountsAdmin />}
        </div>
      </div>
    </div>
  );
}
