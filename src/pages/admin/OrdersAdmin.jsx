import StatCard from "../../components/adminUI/StatCard";
import OrderRow from "./OrderRow";

export function OrdersAdmin() {
  const orders = [
    {
      id: 1023,
      waiter: "Алексей",
      table: 4,
      time: "16:30",
      guestCount: 3,
      total: 1240,
      status: "Готовится",
    },
    {
      id: 1024,
      waiter: "Марина",
      table: 2,
      time: "16:32",
      guestCount: 2,
      total: 890,
      status: "Готов",
    },
    {
      id: 1025,
      waiter: "Иван",
      table: 10,
      time: "16:35",
      guestCount: 5,
      total: 3200,
      status: "Создан",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Управление заказами</h2>
          <div className="flex items-center gap-2">
            <input
              className="bg-[#141414] px-3 py-2 rounded-lg text-sm"
              placeholder="Поиск по номеру / официанту"
            />
            <button className="px-4 py-2 bg-[#8b6af0] text-black rounded-lg">
              Фильтр
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {orders.map((o) => (
            <OrderRow key={o.id} order={o} />

          ))}
        </div>
        <div className="mt-6 bg-[#141414] rounded-2xl p-4">
          <div className="text-sm text-gray-400">Статистика по фильтру</div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <StatCard title="Выручка" value="245 000 ₽" small />
            <StatCard title="Средний чек" value="1 110 ₽" small />
            <StatCard title="Кол-во заказов" value="412" small />
          </div>
        </div>
      </div>
    </div>
  );
}
