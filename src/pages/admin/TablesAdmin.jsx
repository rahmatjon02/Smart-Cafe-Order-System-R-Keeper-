import React, { useState } from "react";
import {
  useGetAllTablesQuery,
  useCreateTableMutation,
  useDeactivateTableMutation,
  useActivateTableMutation,
} from "../../store/orderApi.js";
import { CircularProgress } from "@mui/material";
import { CheckCircle, XCircle } from "lucide-react";

export default function TablesAdmin() {
  const { data, isLoading, refetch } = useGetAllTablesQuery({
    pageNumber: 1,
    pageSize: 1000,
  });

  const [createTable] = useCreateTableMutation();
  const [deactivateTable] = useDeactivateTableMutation();
  const [activateTable] = useActivateTableMutation();
  const [newName, setNewName] = useState("");

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await createTable(newName).unwrap();
      setNewName("");
      refetch();
    } catch (err) {
      console.error("Ошибка при создании стола:", err);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateTable({ tableId: id }).unwrap();
      refetch();
    } catch (err) {
      console.error("Ошибка при деактивации:", err);
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateTable({ tableId: id }).unwrap();
      refetch();
    } catch (err) {
      console.error("Ошибка при активации:", err);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40 text-white">
        <CircularProgress color="inherit" />
      </div>
    );

  const tables = data?.data || [];

  return (
    <div className="p-4 sm:p-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
          🪑 Редактировать столы
        </h2>
        <button
          onClick={refetch}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xs text-sm sm:text-base"
        >
          Обновить
        </button>
      </div>

      {/* Create new table */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          className="bg-[#141414] px-4 py-2 rounded-xs w-full sm:w-64 text-sm sm:text-base"
          placeholder="Укажите сколько мест у стола"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-xs text-sm sm:text-base"
        >
          Добавить
        </button>
      </div>

      {/* Table list */}
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full border-collapse bg-white/5 rounded-xl overflow-hidden lg:text-sm text-xs">
          <thead className="bg-white/10 text-left uppercase lg:text-sm text-[10px]">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Мест</th>
              <th className="p-3">Статус</th>
              <th className="p-3">Актив</th>
              <th className="p-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((t) => (
              <tr
                key={t.id}
                className="border-b border-white/10 hover:bg-white/10 transition"
              >
                <td className="p-3">{t.id}</td>
                <td className="p-3">{t.numberOfSeats}</td>
                <td
                  className={`p-3 ${
                    t.isFree ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {t.isFree ? "Свободен" : "Занят"}
                </td>
                <td className="p-3">{t.isActive ? "🟢" : "🔴"}</td>
                <td className="p-3 flex justify-end gap-2 flex-wrap">
                  {t.isActive ? (
                    <button
                      onClick={() => handleDeactivate(t.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-xs text-xs sm:text-sm"
                      title="Деактивировать стол"
                    >
                      <XCircle size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(t.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-xs text-xs sm:text-sm"
                      title="Активировать стол"
                    >
                      <CheckCircle size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
