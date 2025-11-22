import React, { useState } from "react";
import {
  useCreateDiscountMutation,
  useEndDiscountMutation,
  useGetDiscountsQuery,
} from "../../store/discountApi";
import toast, { Toaster } from "react-hot-toast";
import { CircularProgress } from "@mui/material";

function DiscountsAdmin() {
  const { data, isLoading, refetch } = useGetDiscountsQuery();
  const [createDiscount] = useCreateDiscountMutation();
  const [endDiscount] = useEndDiscountMutation();

  const [discountPercent, setDiscountPercent] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!discountPercent || !startTime || !endTime)
      return toast.error("Заполните все поля");

    try {
      await createDiscount({
        discountPercent: Number(discountPercent),
        startTime,
        endTime,
      }).unwrap();
      toast.success("Скидка успешно создана!");
      refetch();
      setDiscountPercent("");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      toast.error("Ошибка при создании скидки");
    }
  };

  const handleEnd = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3 text-sm">
        <span>Вы уверены, что хотите завершить эту скидку?</span>
        <div className="flex justify-end gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await endDiscount(id).unwrap();
                toast.success("Скидка завершена!");
                refetch();
              } catch {
                toast.error("Ошибка при завершении");
              }
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          >
            Да
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
          >
            Отмена
          </button>
        </div>
      </div>
    ));
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40 text-white py-20">
        <CircularProgress color="inherit" />
      </div>
    );

  const discounts = data?.data || [];

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">🎉 Акции и скидки</h1>
      <Toaster />
      {/* Создание новой скидки */}
      <form
        onSubmit={handleCreate}
        className="bg-[#1f1f1f] p-4 rounded-lg mb-6 flex flex-col sm:flex-row gap-4 sm:items-end"
      >
        <div>
          <label className="block mb-1 text-sm text-gray-300">
            Процент скидки
          </label>
          <input
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            placeholder="50"
            className="px-3 py-2 rounded bg-[#2a2a2a] text-white w-full sm:w-28"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Начало</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="px-3 py-2 rounded bg-[#2a2a2a] text-white w-full"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-300">Конец</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="px-3 py-2 rounded bg-[#2a2a2a] text-white w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-[#8b6af0] hover:bg-[#9a7df5] text-black px-5 py-2 rounded-lg transition"
        >
          Создать
        </button>
      </form>

      {/* Таблица акций */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#1f1f1f] text-left text-sm">
              <th className="p-3">#</th>
              <th className="p-3">Процент</th>
              <th className="p-3">Начало</th>
              <th className="p-3">Конец</th>
              <th className="p-3 text-right">Действие</th>
            </tr>
          </thead>
          <tbody>
            {discounts.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  Нет активных акций
                </td>
              </tr>
            ) : (
              discounts.map((d, i) => (
                <tr
                  key={d.id}
                  className="border-t border-[#2a2a2a] hover:bg-[#1a1a1a]"
                >
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">{d.discountPercent}%</td>
                  <td className="p-3">
                    {new Date(d.startTime).toLocaleString("ru-RU")}
                  </td>
                  <td className="p-3">
                    {new Date(d.endTime).toLocaleString("ru-RU")}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleEnd(d.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Завершить
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
}
export default React.memo(DiscountsAdmin);
