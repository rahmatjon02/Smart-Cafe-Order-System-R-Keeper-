import { Bell, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllOrdersQuery,
  useCreateOrderMutation,
} from "../../store/orderApi";

export default function WaiterHome() {
  const { data, isLoading, isError } = useGetAllOrdersQuery({
    pageNumber: 1,
    pageSize: 10,
  });

  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  // 🧠 Преобразование данных заказов
  useEffect(() => {
    if (data?.data) {
      const mapped = data.data.map((order) => ({
        id: order.id,
        name: `Стол ${order.tableId}`,
        total: order.totalAmount,
        status:
          order.status === "Created"
            ? "Создан"
            : order.status === "Confirmed"
            ? "Подтвержден"
            : order.status === "Paid"
            ? "Оплачен"
            : order.status === "CancelLed"
            ? "Отменён"
            : "Неизвестно",
        tableId: order.tableId,
        waiterId: order.waiterId,
      }));
      setTables(mapped);
    }
  }, [data]);

  const totalSum = tables.reduce((sum, t) => sum + t.total, 0);

  // 🧩 Создание нового заказа
  const handleCreateOrder = async () => {
    try {
      // waiterId = 1 (например, текущий официант), tableId можно сгенерировать динамически
      const newTable = { tableId: 7, waiterId: 1 };
      const response = await createOrder(newTable).unwrap();
      console.log("Создан заказ:", response);

      // после успешного создания — переход на страницу WaiterAdd
      navigate(`/waiter-add/${response.data.id}`);
    } catch (error) {
      console.error("Ошибка при создании заказа:", error);
    }
  };

  if (isLoading) return <div className="p-4 text-white">Загрузка...</div>;
  if (isError) return <div className="p-4 text-red-500">Ошибка загрузки</div>;

  return (
    <div className="p-2 bg-black text-white min-h-screen">
      {/* 🔹 Верхний блок */}
      <div className="flex justify-between items-center mb-3">
        <h1 className="text-lg font-bold text-white/90">Главная официанта</h1>
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-white/20 rounded-lg">
            <Search size={20} />
          </button>
          <button className="px-3 py-2 bg-white/20 rounded-lg flex items-center gap-1">
            <Bell size={20} />
            <span>2</span>
          </button>
          <button
            onClick={() => navigate("/waiter/add")}
            disabled={isCreating}
            className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
              isCreating
                ? "bg-green-900 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-600"
            }`}
          >
            <Plus size={20} />
            <span>{isCreating ? "Создание..." : "Создать заказ"}</span>
          </button>
        </div>
      </div>

      {/* 🔹 Список столов */}
      <div className="grid grid-cols-4 gap-3 py-4">
        {tables.map((table) => (
          <div
            key={table.id}
            className="rounded-xl p-4 flex flex-col justify-between border border-white/10 h-40 cursor-pointer bg-white/10 hover:bg-white/20"
            onClick={() =>
              navigate(
                `/waiter/edit/${table.id}?tableId=${table.tableId}&waiterId=${table.waiterId}`
              )
            }
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{table.name}</h2>
              </div>
              <div className="text-xs px-2 py-1 rounded-lg bg-black/30 text-gray-300">
                {table.status}
              </div>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-sm text-white/60">Итого</span>
              <span className="text-lg font-bold">{table.total} ₽</span>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Сумма снизу */}
      <div className="pt-4">
        <div className="flex gap-2">
          <button className="flex-1 py-4 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-lg flex justify-between items-center px-5">
            <span>Общая сумма</span>
            <span>{totalSum} ₽</span>
          </button>
        </div>
      </div>
    </div>
  );
}
