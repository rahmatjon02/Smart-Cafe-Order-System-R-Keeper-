import { memo, useState } from "react";
import {
  useGetAllOrdersQuery,
  useLazyGetSingleOrderByIdQuery,
} from "../../store/orderApi";
import { Eye, X } from "lucide-react";
import { CircularProgress } from "@mui/material";

 function OrdersAdmin() {
  const [searchId, setSearchId] = useState("");
  const [searchWaiter, setSearchWaiter] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [openedOrderId, setOpenedOrderId] = useState(null);

  const { data, isLoading, refetch } = useGetAllOrdersQuery({
    pageNumber: 1,
    pageSize: 1000,
  });

  const [
    getSingleOrder,
    { data: singleOrderData, isFetching, refetch: refetchSingleOrder },
  ] = useLazyGetSingleOrderByIdQuery();

  const orders = data?.data || [];

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

  const handleOpenOrder = async (id) => {
    if (openedOrderId === id) {
      setOpenedOrderId(null);
      return;
    }
    try {
      await getSingleOrder({ OrderId: id });
      setOpenedOrderId(id);
    } catch (err) {
      console.error("Ошибка загрузки заказа:", err);
    }
  };

  const orderItems = singleOrderData?.data?.orderItems || [];

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок и фильтры */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-center lg:text-left">
            Управление заказами
          </h2>

          <div className="flex flex-wrap justify-center lg:justify-end gap-2">
            <input
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="bg-[#141414] px-3 py-2 rounded-lg text-sm w-full sm:w-auto"
              placeholder="Поиск по ID заказа"
            />
            <input
              value={searchWaiter}
              onChange={(e) => setSearchWaiter(e.target.value)}
              className="bg-[#141414] px-3 py-2 rounded-lg text-sm w-full sm:w-auto"
              placeholder="Поиск по ID официанта"
            />
            <select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              className="bg-[#141414] px-3 py-2 rounded-lg text-sm w-full sm:w-auto"
            >
              <option value="">Все статусы</option>
              <option value="Paid">Оплачен</option>
              <option value="Cancelled">Отменён</option>
              <option value="Created">Создан</option>
              <option value="Confirmed">Подтверждён</option>
            </select>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-[#8b6af0]  rounded-lg w-full sm:w-auto"
            >
              Обновить
            </button>
          </div>
        </div>

        {/* Таблица заказов */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40 text-white py-20">
            <CircularProgress color="inherit" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-gray-400 text-center py-10">
            Нет заказов для отображения
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-[#141414] rounded-lg p-3">
                {/* Основная строка заказа */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <div className="w-12 h-12 bg-[#1f1f1f] rounded-lg flex items-center justify-center font-bold text-sm">
                      {order.tableId ?? "—"}
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base">
                        Заказ #{order.id} — Официант #{order.waiterId ?? "—"}
                      </div>
                      <div className="text-xs text-gray-400 leading-tight">
                        Создан: {formatDate(order.createdAt)}
                        <br />
                        Завершён: {formatDate(order.completedAt)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-between sm:justify-end">
                    <div className="text-sm font-semibold">
                      {order.totalAmount ?? 0} TJS
                    </div>
                    <div
                      className={`px-3 py-1 rounded-lg text-xs sm:text-sm ${
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
                      onClick={() => handleOpenOrder(order.id)}
                    >
                      {openedOrderId === order.id ? (
                        <X size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Таблица блюд */}
                {openedOrderId === order.id && (
                  <div className="mt-4 overflow-x-auto">
                    {isFetching ? (
                      <div className="text-center text-gray-400 py-4">
                        Загрузка блюд...
                      </div>
                    ) : orderItems.length === 0 ? (
                      <div className="text-gray-400 text-center py-3">
                        Нет блюд в заказе
                      </div>
                    ) : (
                      <table className="w-full border-collapse text-sm bg-white/5 rounded-lg overflow-hidden">
                        <thead className="bg-white/10 text-left">
                          <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Блюдо</th>
                            <th className="p-3">Кол-во</th>
                            <th className="p-3">Цена</th>
                            <th className="p-3">Статус</th>
                            <th className="p-3">Начато</th>
                            <th className="p-3">Завершено</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderItems.map((item, i) => (
                            <tr
                              key={item.id}
                              className="border-b border-white/10 hover:bg-white/10 transition"
                            >
                              <td className="p-3">{i + 1}</td>
                              <td className="p-3">{item.menuItemName}</td>
                              <td className="p-3">{item.quantity}</td>
                              <td className="p-3">
                                {item.priceAtOrderTime} TJS
                              </td>
                              <td className="p-3">{item.status}</td>
                              <td className="p-3">
                                {formatDate(item.startedAt)}
                              </td>
                              <td className="p-3">
                                {formatDate(item.completedAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(OrdersAdmin);