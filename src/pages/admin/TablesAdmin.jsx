import React, { useState } from "react";
import {
  useGetAllTablesQuery,
  useCreateTableMutation,
  useDeactivateTableMutation,
  useActivateTableMutation,
} from "../../store/orderApi.js";
import { CircularProgress } from "@mui/material";

export default function TablesAdmin() {
  const { data, isLoading, refetch } = useGetAllTablesQuery({
    pageNumber: 1,
    pageSize: 100,
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
    <div className="p-6 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">🪑 Редактировать столы</h2>
        <button
          onClick={refetch}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
        >
          Обновить
        </button>
      </div>

      {/* Create new table */}
      <div className="flex gap-3 mb-4">
        <input
          className="bg-[#141414] px-4 py-2 rounded-lg w-64"
          placeholder="Укажите сколько мест у стола"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg"
        >
          Добавить
        </button>
      </div>

      {/* Table list */}
      <table className="w-full border-collapse bg-white/5 rounded-xl overflow-hidden">
        <thead className="bg-white/10 text-left text-sm uppercase">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Мест</th>
            <th className="p-3">Свободен</th>
            <th className="p-3">Активен</th>
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
              <td className="p-3">{t.isFree ? "✅ Свободен" : "❌ Занят"}</td>
              <td className="p-3">
                {t.isActive ? "🟢 Активен" : "🔴 Неактивен"}
              </td>
              <td className="p-3 flex justify-end gap-2">
                {t.isActive ? (
                  <button
                    onClick={() => handleDeactivate(t.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Деактивировать
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivate(t.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Активировать
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
