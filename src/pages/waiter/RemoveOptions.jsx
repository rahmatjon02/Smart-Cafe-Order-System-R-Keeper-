export default function RemoveOptions() {
  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      <button className="bg-[#2a2a2a] py-2 rounded-lg">
        Удалить со списанием
      </button>
      <button className="bg-[#2a2a2a] py-2 rounded-lg">
        Удалить без списания
      </button>
    </div>
  );
}
