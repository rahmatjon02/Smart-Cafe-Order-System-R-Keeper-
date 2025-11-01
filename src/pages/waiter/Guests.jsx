export function Guests() {
  const guests = ["Гость 1", "Гость 2", "Гость 3", "Гость 4"];
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-4 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="text-xl font-semibold mb-4">Гости</div>
        <div className="bg-[#141414] rounded-lg p-3">
          {guests.map((g, idx) => (
            <div
              key={g}
              className="flex items-center justify-between p-3 border-b border-[#2a2a2a]"
            >
              <div>
                <div className="font-semibold">{g}</div>
                <div className="text-sm text-gray-400">0 позиций · 0 ₽</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-[#2a2a2a] rounded-lg">
                  Перенести
                </button>
                <button className="px-3 py-1 bg-[#8b6af0] text-black rounded-lg">
                  Выбрать
                </button>
              </div>
            </div>
          ))}

          <div className="p-3">
            <button className="w-full bg-[#2a2a2a] py-3 rounded-lg">
              + Добавить гостя
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="flex-1 bg-[#2a2a2a] py-3 rounded-lg">
            Отмена
          </button>
          <button className="flex-1 bg-[#0f9f47] text-black py-3 rounded-lg font-semibold">
            Продолжить
          </button>
        </div>
      </div>
    </div>
  );
}
