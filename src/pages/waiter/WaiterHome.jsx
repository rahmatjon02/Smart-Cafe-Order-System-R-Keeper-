import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import { toast, Toaster } from "react-hot-toast";
import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllTablesQuery,
  useCreateOrderMutation,
  useLazyGetOrderIdQuery,
} from "../../store/orderApi";

export default function WaiterHome() {
  const { data, isLoading, isError, refetch } = useGetAllTablesQuery({
    pageNumber: 1,
    pageSize: 200,
    OnlyActive: true,
    OnlyFree: false,
  });

  const [getOrderId] = useLazyGetOrderIdQuery();
  const waiterId = 1;
  const [createOrder] = useCreateOrderMutation();
  const [tables, setTables] = useState([]);
  const [ordersByTable, setOrdersByTable] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    refetch();

    if (!data?.data?.length) return;

    async function initTables() {
      const mapped = data.data.map((table) => ({
        id: table.id,
        name: `Стол ${table.id}`,
        isFree: table.isFree,
        isActive: table.isActive,
        numberOfSeats: table.numberOfSeats,
      }));
      setTables(mapped);

      const updatedOrders = {};
      for (const table of mapped) {
        try {
          const response = await getOrderId({ tableId: table.id }).unwrap();
          if (response?.data?.id) updatedOrders[table.id] = response.data.id;
        } catch (err) {
          console.error(`Ошибка получения заказа для стола ${table.id}`, err);
        }
      }
      setOrdersByTable(updatedOrders);
    }

    initTables();
  }, [data, getOrderId, refetch]);

  // 🔹 Создание нового заказа
  const handleCreateOrder = async (tableId) => {
    try {
      const payload = { tableId, waiterId };
      const response = await createOrder(payload).unwrap();
      const orderId = response.data.id;

      navigate(`/WaiterEdit/${tableId}/${orderId}`);
    } catch (error) {
      console.error("❌ Ошибка при создании заказа:", error);
    }
  };

  // 🔹 Переход при клике на стол
  const handleTableClick = async (table) => {
    if (!table.isActive) return;

    const savedOrderId = ordersByTable[table.id];

    if (table.isFree) {
      await handleCreateOrder(table.id);
    } else if (savedOrderId) {
      navigate(`/WaiterEdit/${table.id}/${savedOrderId}`);
    } else {
      toast.error("Подождите, идет загрузка...");
    }
  };

  if (isLoading)
    return (
      <div className="p-4 text-black bg-black min-h-screen">
        <div className="animate-spin border border-y-4 border-white w-40 h-40 rounded-full" />
      </div>
    );

  if (isError)
    return <div className="p-4 text-red-500 text-center">Ошибка загрузки</div>;

  return (
    <div className="p-2 bg-black text-white min-h-screen">
      <Toaster />
      {/* Header */}
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
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-5 gap-3 py-4">
        {tables.map((table) => (
          <div
            key={table.id}
            onClick={() => handleTableClick(table)}
            className={`rounded-xl p-4 flex flex-col justify-between border border-white/10 h-30 cursor-pointer ${
              table.isActive
                ? table.isFree
                  ? "bg-green-800 hover:bg-green-700"
                  : "bg-white/10 hover:bg-white/20"
                : "bg-gray-700 opacity-50 cursor-not-allowed"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{table.name}</h2>
                <p className="text-xs text-gray-400">
                  Мест: {table.numberOfSeats}
                </p>
              </div>
              <div
                className={`text-xs px-2 py-1 rounded-lg ${
                  !table.isActive
                    ? "bg-gray-500 text-gray-200"
                    : table.isFree
                    ? "bg-green-600 text-white"
                    : "bg-yellow-500 text-black"
                }`}
              >
                {!table.isActive
                  ? "Неактивен"
                  : table.isFree
                  ? "Свободен"
                  : "Занят"}
              </div>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-sm text-white/60">
                {table.isFree ? (
                  "Нажмите, чтобы принять заказ"
                ) : ordersByTable[table.id] ? (
                  `Заказ #${ordersByTable[table.id]}`
                ) : (
                  <Skeleton width={40} />
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
