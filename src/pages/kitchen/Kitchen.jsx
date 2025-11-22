import { use, useEffect, useState } from "react";
import {
  useGetKitchenQueueQuery,
  useMarkAsReadyMutation,
} from "../../store/orderApi";
import { toast, Toaster } from "react-hot-toast";
import { Check, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGetRoleFromTokenMutation } from "../../store/authApi";
import useAuth from "../../hooks/useAuth";
import { CircularProgress } from "@mui/material";

const Kitchen = () => {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetKitchenQueueQuery();
  const [markAsReady] = useMarkAsReadyMutation();
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);

    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    roleCheck();
    const updateClock = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(formatted);
    };
    updateClock(); // сразу установить при монтировании
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);

  const roleCheck = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      // теперь просто используем твой готовый хук useAuth
      const { role } = useAuth();

      if (role === "Admin") {
        setIsAdmin(true);
      }
    }
  };

  useEffect(() => {
    roleCheck();
  }, []);

  const handleReady = async (id) => {
    try {
      await markAsReady({ orderItemId: id }).unwrap();
      toast.success("Блюдо отмечено как готовое!");
      refetch();
    } catch (err) {
      toast.error("Ошибка при обновлении статуса");
      console.error(err);
    }
  };

  const queue = data?.data || [];

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col">
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <h1 className="text-2xl font-bold">🍳 Кухня</h1>
          {isAdmin && (
            <div className="flex gap-2">
              <Link
                to={"/"}
                className="bg-[#1f1f1f] px-3 py-2 rounded-xs text-sm hover:bg-[#2a2a2a]"
              >
                Админ
              </Link>
              <Link
                to={"/WaiterHome"}
                className="bg-[#1f1f1f] px-3 py-2 rounded-xs text-sm hover:bg-[#2a2a2a]"
              >
                Официант
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Текущее время */}
          <div className="text-white/70 font-mono text-sm min-w-[90px] text-right">
            {currentTime}
          </div>

          {/* Кнопка обновления */}
          <button
            onClick={refetch}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xs text-sm font-medium transition-all"
          >
            Обновить
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="px-3 py-2 bg-red-500/70 hover:bg-red-600 text-white rounded-xs transition-all duration-200 flex items-center gap-2"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Выйти</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full border-collapse border border-white/10 text-sm">
          <thead>
            <tr className="bg-white/10 text-left text-white uppercase text-xs tracking-wider">
              <th className="px-4 py-3 border-b border-white/10">#</th>
              <th className="px-4 py-3 border-b border-white/10">
                Название блюда
              </th>
              <th className="px-4 py-3 border-b border-white/10">Заказ №</th>
              <th className="px-4 py-3 border-b border-white/10">Кол-во</th>
              <th className="px-4 py-3 border-b border-white/10">Начато</th>
              <th className="px-4 py-3 border-b border-white/10 text-center">
                Действие
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-10 text-white/60 text-base"
                >
                  <CircularProgress color="inherit" />
                </td>
              </tr>
            ) : queue.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-10 text-white/60 text-base"
                >
                  Нет активных заказов
                </td>
              </tr>
            ) : (
              queue.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-white/10 transition-colors border-b border-white/5"
                >
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3 font-medium">{item.menuItemName}</td>
                  <td className="px-4 py-3">#{item.orderId}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3 text-white/70">
                    {new Date(item.startedAt).toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleReady(item.id)}
                      disabled={item.status === "Ready"}
                      className={`${
                        item.status === "Ready"
                          ? "bg-green-900/40 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      } px-4 py-2 rounded-xs text-white flex items-center justify-center gap-1 mx-auto transition-all`}
                    >
                      <Check size={16} />
                      Готово
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Kitchen;
