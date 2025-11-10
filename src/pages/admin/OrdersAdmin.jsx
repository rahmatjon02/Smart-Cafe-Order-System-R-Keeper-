import { useState } from "react";
import { useGetAllOrdersQuery } from "../../store/orderApi"; // твой RTK Query
import { Eye } from "lucide-react";

export function OrdersAdmin() {
  const [searchId, setSearchId] = useState("");
  const [searchWaiter, setSearchWaiter] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  const { data, isLoading, refetch } = useGetAllOrdersQuery({
    pageNumber: 1,
    pageSize: 100,
  });

  const orders = data?.data || [];

  // Фильтруем локально по трём полям
  const filteredOrders = orders.filter((o) => {
    const matchesId = searchId ? o.id.toString().includes(searchId) : true;
    const matchesWaiter = searchWaiter
      ? o.waiterId?.toString().includes(searchWaiter)
      : true;
    const matchesStatus = searchStatus ? o.status.includes(searchStatus) : true;
    return matchesId && matchesWaiter && matchesStatus;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок и фильтры */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
          <h2 className="text-xl font-semibold">Управление заказами</h2>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="bg-[#141414] px-3 py-2 rounded-lg text-sm"
              placeholder="Поиск по ID заказа"
            />
            <input
              value={searchWaiter}
              onChange={(e) => setSearchWaiter(e.target.value)}
              className="bg-[#141414] px-3 py-2 rounded-lg text-sm"
              placeholder="Поиск по ID официанта"
            />
            <select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              className="bg-[#141414] px-3 py-2 rounded-lg text-sm"
            >
              <option value="">Все статусы</option>
              <option value="Paid">Оплачен</option>
              <option value="Cancelled">Отменён</option>
              <option value="Created">Создан</option>
            </select>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-[#8b6af0] text-black rounded-lg"
            >
              Обновить
            </button>
          </div>
        </div>

        {/* Таблица заказов */}
        {isLoading ? (
          <div className="text-white text-center py-10">Загрузка...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-gray-400 text-center py-10">
            Нет заказов для отображения
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-[#141414] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#1f1f1f] rounded-lg flex items-center justify-center font-bold">
                    {order.tableId ?? "—"}
                  </div>
                  <div>
                    <div className="font-semibold">
                      Заказ #{order.id} — Официант #{order.waiterId ?? "—"}
                    </div>
                    <div className="text-xs text-gray-400">
                      Создан: {formatDate(order.createdAt)}
                      <br />
                      Завершён: {formatDate(order.completedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm font-semibold">
                    {order.totalAmount ?? 0} ₽
                  </div>
                  <div
                    className={`px-3 py-1 rounded-lg text-sm ${
                      order.status === "Paid"
                        ? "bg-green-600 text-black"
                        : order.status === "Cancelled"
                        ? "bg-red-600 text-black"
                        : "bg-gray-700"
                    }`}
                  >
                    {order.status}
                  </div>
                  <button
                    className="p-2 bg-[#2a2a2a] rounded-lg"
                    title="Открыть заказ"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
