export default function OrderRow({ order }) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#141414] rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#1f1f1f] rounded-lg flex items-center justify-center font-bold">
          {order.table}
        </div>
        <div>
          <div className="font-semibold">
            Заказ #{order.id} — {order.waiter}
          </div>
          <div className="text-xs text-gray-400">
            {order.time} · {order.guestCount} гостей
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold">{order.total} ₽</div>
        <div
          className={`px-3 py-1 rounded-lg text-sm ${
            order.status === "Готов"
              ? "bg-green-600 text-black"
              : order.status === "Готовится"
              ? "bg-yellow-500 text-black"
              : "bg-gray-700"
          }`}
        >
          {order.status}
        </div>
        <button className="px-3 py-2 bg-[#2a2a2a] rounded-lg">Открыть</button>
      </div>
    </div>
  );
}
