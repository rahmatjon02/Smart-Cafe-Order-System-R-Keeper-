export function ReportsAdmin() {
  const topDishes = [
    { name: "Пицца Маргарита", sold: 420 },
    { name: "Биг Тейсти", sold: 375 },
    { name: "Салат Оливье", sold: 312 },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Отчёты и аналитика</h2>
          <div className="text-sm text-gray-400">Период: Окт 2025</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-[#141414] rounded-2xl p-4">
            <div className="text-sm text-gray-400">KPI официантов</div>
            <div className="mt-3 space-y-3">
              {["Алексей", "Марина", "Иван"].map((w, i) => (
                <div
                  key={w}
                  className="flex items-center justify-between bg-[#1f1f1f] p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2a2a2a] rounded-full flex items-center justify-center">
                      {w[0]}
                    </div>
                    <div>
                      <div className="font-semibold">{w}</div>
                      <div className="text-xs text-gray-400">
                        Обслужено: {30 + i * 5}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    Баллы: {95 - i * 3}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141414] rounded-2xl p-4">
            <div className="text-sm text-gray-400">Топ блюд</div>
            <div className="mt-3 space-y-2">
              {topDishes.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center justify-between p-2 bg-[#1f1f1f] rounded-lg"
                >
                  <div className="text-sm">{d.name}</div>
                  <div className="font-semibold">{d.sold} шт</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 bg-[#141414] rounded-2xl p-4">
          <div className="text-sm text-gray-400">Сводка по акциям</div>
          <div className="mt-3 text-sm text-gray-300">
            Акция «Happy Hour» дала +18% к выручке в вечерние часы.
          </div>
        </div>
      </div>
    </div>
  );
}
