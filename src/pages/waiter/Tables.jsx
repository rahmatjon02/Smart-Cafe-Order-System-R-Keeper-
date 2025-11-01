export function Tables() {
  const tables = Array.from({ length: 12 }, (_, i) => i + 1);
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="text-xl font-semibold mb-4">Выбор стола</div>
        <div className="grid grid-cols-4 gap-4">
          {tables.map((t) => (
            <div
              key={t}
              className="bg-[#141414] rounded-lg p-4 flex flex-col items-center justify-center min-h-[120px]"
            >
              <div className="text-3xl font-bold">{t}</div>
              <div className="text-sm text-gray-300 mt-2">
                2 гостя · Веранда
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button className="flex-1 bg-[#2a2a2a] py-3 rounded-lg">Назад</button>
          <button className="flex-1 bg-[#8b6af0] text-black py-3 rounded-lg font-semibold">
            Создать заказ
          </button>
        </div>
      </div>
    </div>
  );
}
