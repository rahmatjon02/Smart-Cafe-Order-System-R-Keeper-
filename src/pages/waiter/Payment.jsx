export function Payment() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-xl font-semibold mb-4">Оплата</div>

        <div className="bg-[#141414] rounded-lg p-4">
          <div className="flex justify-between items-center border-b border-[#2a2a2a] pb-3">
            <div>
              <div className="text-sm text-gray-400">Сумма заказа</div>
              <div className="text-2xl font-bold">1 230 ₽</div>
            </div>
            <div className="text-sm text-gray-400">Стол 4 · Гость 1</div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="py-3 rounded-lg bg-[#2a2a2a]">Наличными</button>
            <button className="py-3 rounded-lg bg-[#8b6af0] text-black">
              Картой
            </button>
            <button className="py-3 rounded-lg bg-[#2a2a2a] col-span-2">
              Списать с бонусов
            </button>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button className="px-4 py-3 bg-[#b02020] rounded-lg">
              Отмена
            </button>
            <button className="px-6 py-3 bg-[#0f9f47] text-black rounded-lg font-semibold">
              Оплатить 1 230 ₽
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}