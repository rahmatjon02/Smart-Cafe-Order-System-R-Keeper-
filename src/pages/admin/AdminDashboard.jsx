import { useEffect, useState } from "react";

export function AdminDashboard({ setTab }) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted = now.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
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
  
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Панель администратора</h1>
          <div className="flex items-center gap-3">
            <div className="text-xl text-gray-400">{currentTime}</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <div className="grid grid-cols-3 gap-4">
              {/* Выручка */}
              <div className="rounded-2xl p-4 min-h-24 bg-[#141414]">
                <div className="text-sm text-gray-400">Выручка (сегодня)</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-2xl font-bold">154 320 ₽</div>
                  <div className="text-sm font-semibold text-green-400">
                    +12%
                  </div>
                </div>
              </div>

              {/* Средний чек */}
              <div className="rounded-2xl p-4 min-h-24 bg-[#141414]">
                <div className="text-sm text-gray-400">Средний чек</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-2xl font-bold">1 230 ₽</div>
                  <div className="text-sm font-semibold text-red-400">-2%</div>
                </div>
              </div>

              {/* Заказы */}
              <div className="rounded-2xl p-4 min-h-24 bg-[#141414]">
                <div className="text-sm text-gray-400">Заказы (сегодня)</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="text-2xl font-bold">128</div>
                  <div className="text-sm font-semibold text-green-400">
                    +8%
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              {/* Рейтинг официантов */}
              <div className="bg-[#141414] rounded-2xl p-4">
                <div className="text-sm text-gray-400">Рейтинг официантов</div>
                <div className="mt-3 space-y-2">
                  {["Алексей", "Марина", "Иван", "Светлана"].map((n, i) => (
                    <div key={n} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#2a2a2a] rounded-full flex items-center justify-center">
                          {n[0]}
                        </div>
                        <div className="text-sm">{n}</div>
                      </div>
                      <div className="text-sm font-semibold">{90 - i * 5}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Популярные блюда */}
              <div className="bg-[#141414] rounded-2xl p-4">
                <div className="text-sm text-gray-400">Популярные блюда</div>
                <div className="mt-3 space-y-2">
                  {["Пицца Маргарита", "Биг Тейсти", "Салат Цезарь"].map(
                    (d) => (
                      <div
                        key={d}
                        className="flex items-center justify-between"
                      >
                        <div className="text-sm">{d}</div>
                        <div className="text-sm text-gray-300">
                          {Math.floor(Math.random() * 120 + 20)} шт
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка */}
          <div className="col-span-4">
            <div className="bg-[#141414] rounded-2xl p-4">
              <div className="text-sm text-gray-400">Операции</div>

              <div className="mt-3 space-y-3">
                <button
                  onClick={() => setTab("tables")}
                  className="w-full bg-[#2a2a2a] py-3 rounded-lg hover:bg-[#333]"
                >
                  Редактировать столы
                </button>
                <button
                  onClick={() => setTab("categories")}
                  className="w-full bg-[#8b6af0] text-black py-3 rounded-lg font-semibold hover:bg-[#a591f5]"
                >
                  Редактировать категории
                </button>
              </div>
            </div>

            <div className="mt-4 bg-[#141414] rounded-2xl p-4">
              <div className="text-sm text-gray-400">Последние заказы</div>
              <div className="mt-3 space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-[#1f1f1f] rounded-lg"
                  >
                    <div>
                      <div className="text-sm">Стол {i} · Гость 1</div>
                      <div className="text-xs text-gray-400">16:3{i}</div>
                    </div>
                    <div className="font-semibold">
                      {(Math.random() * 5000 + 200).toFixed(0)} ₽
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
