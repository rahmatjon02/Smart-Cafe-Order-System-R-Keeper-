import { useEffect, useState } from "react";
import {
  useGetNumberOfOrdersQuery,
  useGetTodayTotalRevenueQuery,
  useGetAvgCheckTotalQuery,
  useGetAvgOrderDurationQuery,
  useGetPopularMenuItemsQuery,
} from "../../store/reportApi";
import { useGetAllOrdersQuery } from "../../store/orderApi";

export function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState("");

  // RTK Query
  const { data: ordersData, isLoading: ordersLoading } =
    useGetNumberOfOrdersQuery();
  const { data: revenueData, isLoading: revenueLoading } =
    useGetTodayTotalRevenueQuery();
  const { data: avgCheckData, isLoading: avgCheckLoading } =
    useGetAvgCheckTotalQuery();
  const { data: avgTimeData, isLoading: avgTimeLoading } =
    useGetAvgOrderDurationQuery();
  const { data: popularData, isLoading: popularLoading } =
    useGetPopularMenuItemsQuery({
      pageNumber: 1,
      pageSize: 5,
    });

  // Получаем все заказы для последних заказов
  const { data: allOrdersData, isLoading: allOrdersLoading } =
    useGetAllOrdersQuery({
      pageNumber: 1,
      pageSize: 100,
    });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted = now.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(formatted);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Заглушки для рейтинга официантов
  const waiters = ["Алексей", "Марина", "Иван", "Светлана"];

  // Сортируем и берём последние 10 заказов
  const latestOrders = allOrdersData?.data
    ? [...allOrdersData.data]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
    : [];

  return (
    <div className="bg-[#0b0b0b] text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold">
            Панель администратора
          </h1>
          <div className="text-lg text-gray-400 text-center sm:text-right">
            {currentTime}
          </div>
        </div>

        {/* Верхние карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="rounded-2xl p-4 bg-[#141414]">
            <div className="text-sm text-gray-400">Выручка (сегодня)</div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-2xl font-bold">
                {revenueLoading ? "..." : `${revenueData?.data ?? 0} TJS`}
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-[#141414]">
            <div className="text-sm text-gray-400">Средний чек</div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-2xl font-bold">
                {avgCheckLoading
                  ? "..."
                  : `${Math.round(avgCheckData?.data ?? 0)} TJS`}
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-[#141414]">
            <div className="text-sm text-gray-400">Заказы (сегодня)</div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-2xl font-bold">
                {ordersLoading ? "..." : ordersData?.data ?? 0}
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-[#141414]">
            <div className="text-sm text-gray-400">Заказы (сегодня)</div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-2xl font-bold">
                {avgTimeLoading
                  ? "..."
                  : avgTimeData?.data?.split(".")[0] || "00:00:00"}
              </div>
            </div>
          </div>
        </div>

        {/* Нижние карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Рейтинг официантов */}
          <div className="bg-[#141414] rounded-2xl p-4">
            <div className="text-sm text-gray-400">Рейтинг официантов</div>
            <div className="mt-3 space-y-2">
              {waiters.map((n, i) => (
                <div key={n} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#2a2a2a] rounded-full flex items-center justify-center">
                      {n[0]}
                    </div>
                    <div className="text-sm">{n}</div>
                  </div>
                  <div className="text-sm font-semibold">{90 - i * 5}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Популярные блюда */}
          <div className="bg-[#141414] rounded-2xl p-4">
            <div className="text-sm text-gray-400">Популярные блюда</div>
            {popularLoading ? (
              <div className="mt-3">Загрузка...</div>
            ) : popularData?.data?.length ? (
              <table className="w-full text-left border-collapse mt-3">
                <thead className="text-xs uppercase text-gray-400">
                  <tr>
                    <th className="p-2 border-b border-white/10">Название</th>
                    <th className="p-2 border-b border-white/10">Заказы</th>
                  </tr>
                </thead>
                <tbody>
                  {popularData.data.map((item) => (
                    <tr key={item.menuItemId} className="hover:bg-white/10">
                      <td className="p-2">{item.menuItemName}</td>
                      <td className="p-2">{item.ordersCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="mt-3">Нет данных</div>
            )}
          </div>

          {/* Последние заказы */}
          <div className="bg-[#141414] rounded-2xl p-4">
            <div className="text-sm text-gray-400">Последние заказы</div>
            <div className="mt-3 space-y-2">
              {allOrdersLoading ? (
                "Загрузка..."
              ) : latestOrders?.length ? (
                latestOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-2 bg-[#1f1f1f] rounded-lg"
                  >
                    <div>
                      <div className="text-sm">
                        Стол {order.tableId} · Официант {order.waiterId}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="font-semibold">
                      {order.totalAmount ?? 0} TJS
                    </div>
                  </div>
                ))
              ) : (
                <div>Нет заказов</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
