export default function HeaderBar({ tableNumber = 4, guests = 3 }) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-lg mb-4">
      <div className="text-sm text-gray-400">Стол: {tableNumber} · Гостей: {guests}</div>
      <div className="text-sm text-gray-400">{time}</div>
    </div>
  );
}
