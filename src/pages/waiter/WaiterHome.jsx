import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import { toast, Toaster } from "react-hot-toast";
import { Bell, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useGetAllTablesQuery,
  useCreateOrderMutation,
  useLazyGetOrderIdQuery,
  useLazyGetOrderTotalQuery,
} from "../../store/orderApi";

export default function WaiterHome() {
  const { data, isLoading, isError, refetch } = useGetAllTablesQuery({
    pageNumber: 1,
    pageSize: 200,
    OnlyActive: true,
    OnlyFree: false,
  });

  const [getOrderId] = useLazyGetOrderIdQuery();
  const [getOrderTotal] = useLazyGetOrderTotalQuery();
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
        totalPrice: "...",
      }));
      setTables(mapped);

      const updatedOrders = {};
      const updatedTables = [...mapped];

      for (const table of mapped) {
        try {
          const response = await getOrderId({ tableId: table.id }).unwrap();
          const orderId = response?.data?.id;

          if (orderId) {
            updatedOrders[table.id] = orderId;
            const totalResp = await getOrderTotal({ orderId }).unwrap();
            const total = totalResp?.data || 0;

            const index = updatedTables.findIndex((t) => t.id === table.id);
            if (index !== -1) updatedTables[index].totalPrice = total;
          }
        } catch (err) {
          console.error(
            `Ошибка при загрузке данных для стола ${table.id}:`,
            err
          );
        }
      }

      setOrdersByTable(updatedOrders);
      setTables(updatedTables);
    }

    initTables();
  }, [data, getOrderId, getOrderTotal]);

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
      <div className="p-4 text-black bg-black min-h-screen flex justify-center items-center">
        <div className="animate-spin border-4 border-t-white border-white/30 w-16 h-16 rounded-full" />
      </div>
    );

  if (isError)
    return <div className="p-4 text-red-500 text-center">Ошибка загрузки</div>;

  return (
    <div className="p-2 sm:p-4 bg-black text-white min-h-screen">
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-start sm:items-center mb-4 gap-3">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white/90">
            Главная официанта
          </h1>
          <Link
            to={"/"}
            className="bg-[#1f1f1f] px-3 py-2 rounded-lg text-sm hover:bg-[#2a2a2a]"
          >
            Админ
          </Link>
          <Link
            to={"/Kitchen"}
            className="bg-[#1f1f1f] px-3 py-2 rounded-lg text-sm hover:bg-[#2a2a2a]"
          >
            Кухня
          </Link>
        </div>

        <div className="flex gap-2">
          <button className="px-3 py-2 bg-white/20 rounded-lg">
            <Search size={18} />
          </button>
          <button className="px-3 py-2 bg-white/20 rounded-lg flex items-center gap-1">
            <Bell size={18} />
            <span className="text-xs sm:text-sm">2</span>
          </button>
        </div>
      </div>

      {/* Tables grid */}
      <div
        className="
        grid 
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        lg:grid-cols-5 
        xl:grid-cols-6
        gap-3 
        py-4
      "
      >
        {tables.map((table) => (
          <div
            key={table.id}
            onClick={() => handleTableClick(table)}
            className={`rounded-xl p-3 sm:p-4 flex flex-col justify-between border border-white/10 h-28 sm:h-32 cursor-pointer transition-all duration-200
              ${
                table.isActive
                  ? table.isFree
                    ? "bg-green-800 hover:bg-green-700"
                    : "bg-white/10 hover:bg-white/20"
                  : "bg-gray-700 opacity-50 cursor-not-allowed"
              }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-base sm:text-lg font-semibold">
                  {table.name}
                </h2>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  Мест: {table.numberOfSeats}
                </p>
              </div>
              <div
                className={`text-[10px] sm:text-xs px-2 py-1 rounded-lg ${
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
              <span className="text-[11px] sm:text-sm text-white/60">
                {table.isFree ? (
                  "Нажмите, чтобы принять заказ"
                ) : ordersByTable[table.id] ? (
                  `Заказ #${ordersByTable[table.id]}`
                ) : (
                  <Skeleton width={40} style={{ backgroundColor: "#010101" }} />
                )}
              </span>

              <div className="text-sm sm:text-lg font-bold">
                {table.isFree ? "" : `${table.totalPrice} ₽`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
