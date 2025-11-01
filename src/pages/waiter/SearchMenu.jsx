export function SearchMenu() {
  const keys = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "←"],
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button className="px-4 py-2 bg-[#1f1f1f] rounded-lg">←</button>
          <div className="flex-1 mx-3 bg-[#1f1f1f] rounded-lg px-4 py-3 text-center">
            Поиск блюда
          </div>
          <div className="w-12" />
        </div>

        <div className="bg-[#141414] rounded-lg p-4">
          <input
            placeholder="Найти блюдо"
            className="w-full bg-[#0b0b0b] px-4 py-3 rounded-lg text-lg placeholder-gray-400"
          />

          <div className="mt-4 grid grid-cols-3 gap-3">
            {["Пицца", "Салаты", "Напитки", "Десерты", "Супы", "Горячее"].map(
              (c) => (
                <div
                  key={c}
                  className="bg-[#2a2a2a] rounded-lg p-3 text-center"
                >
                  {c}
                </div>
              )
            )}
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-400 mb-2">Клавиатура</div>
            <div className="bg-[#0f0f0f] rounded-lg p-3">
              {keys.map((row, rIdx) => (
                <div key={rIdx} className="flex justify-center gap-2 mb-2">
                  {row.map((k) => (
                    <div
                      key={k}
                      className="min-w-9 h-10 rounded-md bg-[#1f1f1f] flex items-center justify-center text-sm"
                    >
                      {k}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {["В корзину", "Быстрый чек", "Оплата"].map((b) => (
              <div key={b} className="bg-[#2a2a2a] rounded-lg p-3 text-center">
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}