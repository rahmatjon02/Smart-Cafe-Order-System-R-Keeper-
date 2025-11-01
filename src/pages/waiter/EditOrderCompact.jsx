export default function EditOrderCompact() {
  const items = [
    { name: "Биг Тейсти", price: 210 },
    { name: "Салат оливье", price: 320 },
    { name: "Пицца «Гурман»", price: 240 },
    { name: "Помидоры", price: 30 },
    { name: "Лук", price: 0 },
  ];

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className="flex justify-between py-2 border-b border-gray-700">
          <span>{item.name}</span>
          <span>{item.price} ₽</span>
        </div>
      ))}
      <div className="text-right mt-4 font-bold text-lg">Итого: {total} ₽</div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button className="bg-[#2a2a2a] py-2 rounded-lg">Удалить со списанием</button>
        <button className="bg-[#2a2a2a] py-2 rounded-lg">Удалить без списания</button>
      </div>
    </div>
  );
}
