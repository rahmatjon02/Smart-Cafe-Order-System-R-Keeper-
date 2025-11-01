export default function StatCard({ title, value, delta, small }) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        small ? "min-h-[72px]" : "min-h-24"
      } bg-[#141414]`}
    >
      <div className="text-sm text-gray-400">{title}</div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-2xl font-bold">{value}</div>
        {delta && (
          <div
            className={`text-sm font-semibold ${
              delta.startsWith("+") ? "text-green-400" : "text-red-400"
            }`}
          >
            {delta}
          </div>
        )}
      </div>
    </div>
  );
}
