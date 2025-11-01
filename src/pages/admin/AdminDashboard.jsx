import StatCard from "../../components/adminUI/StatCard";

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Панель администратора</h1>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">Сегодня: 28.10.2025</div>
            <button className="px-4 py-2 bg-[#1f1f1f] rounded-lg">
              Профиль
            </button>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <div className="grid grid-cols-3 gap-4">
              <StatCard
                title="Выручка (сегодня)"
                value="154 320 ₽"
                delta="+12%"
              />
              <StatCard title="Средний чек" value="1 230 ₽" delta="-2%" />
              <StatCard title="Заказы (сегодня)" value="128" delta="+8%" />
            </div>
            

            <div className="mt-4 bg-[#141414] rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">
                    Выручка за 30 дней
                  </div>
                  <div className="text-2xl font-bold">3 480 000 ₽</div>
                </div>
                <div className="text-sm text-gray-400">Фильтр: Все точки</div>
              </div>

              <div className="mt-3 h-20 w-full bg-leaner-to-r from-[#1f1f1f] to-[#0f0f0f] rounded-lg flex items-center justify-center text-gray-500">
                График
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3">
                <div className="bg-[#1f1f1f] rounded-lg p-3">
                  <div className="text-xs text-gray-400">Новые клиенты</div>
                  <div className="font-bold mt-1">1 230</div>
                </div>
                <div className="bg-[#1f1f1f] rounded-lg p-3">
                  <div className="text-xs text-gray-400">Повторные</div>
                  <div className="font-bold mt-1">420</div>
                </div>
                <div className="bg-[#1f1f1f] rounded-lg p-3">
                  <div className="text-xs text-gray-400">Отмены</div>
                  <div className="font-bold mt-1">12</div>
                </div>
                <div className="bg-[#1f1f1f] rounded-lg p-3">
                  <div className="text-xs text-gray-400">
                    Среднее время заказа
                  </div>
                  <div className="font-bold mt-1">18m</div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
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

          <div className="col-span-4">
            <div className="bg-[#141414] rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">Операции</div>
                <div className="text-sm text-gray-400">Фильтр</div>
              </div>

              <div className="mt-3 space-y-3">
                <button className="w-full bg-[#2a2a2a] py-3 rounded-lg">
                  Создать акцию
                </button>
                <button className="w-full bg-[#2a2a2a] py-3 rounded-lg">
                  Экспорт отчёта
                </button>
                <button className="w-full bg-[#8b6af0] text-black py-3 rounded-lg font-semibold">
                  Просмотреть реестр
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
