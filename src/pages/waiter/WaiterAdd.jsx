import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllTablesQuery,
  useGetCategoriesQuery,
  useGetMenuItemsByCategoryQuery,
  useCreateOrderMutation,
  useAddOrderItemMutation,
} from "../../store/orderApi";

export default function WaiterAdd() {
  const navigate = useNavigate();

  const { data: tablesData } = useGetAllTablesQuery({ pageNumber: 1, pageSize: 20 });
  const { data: categoriesData } = useGetCategoriesQuery({ pageNumber: 1, pageSize: 20 });
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { data: menuData } = useGetMenuItemsByCategoryQuery(
    { categoryId: selectedCategory?.id || 0, pageNumber: 1, pageSize: 20 },
    { skip: !selectedCategory }
  );

  const [createOrder] = useCreateOrderMutation();
  const [addOrderItem] = useAddOrderItemMutation();
  const [orderId, setOrderId] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  const handleTableSelect = async (table) => {
    setSelectedTable(table);
    if (!orderId) {
      const result = await createOrder({ tableId: table.id, waiterId: 1 });
      setOrderId(result.data.id);
    }
  };

  const handleMenuItemClick = async (item) => {
    if (!orderId) return;
    await addOrderItem({ orderId, menuItemId: item.id });
    setOrderItems((prev) => {
      const exist = prev.find((i) => i.id === item.id);
      if (exist) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const totalPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="flex gap-4 p-4 bg-black min-h-screen text-white">
      {/* Left: Order items */}
      <div className="flex-1 flex flex-col gap-2">
        <h2 className="text-xl font-bold">Текущий заказ</h2>
        {orderItems.map((item) => (
          <div key={item.id} className="flex justify-between p-2 bg-white/20 rounded">
            <span>{item.name}</span>
            <span>
              {item.quantity} × {item.price} ₽
            </span>
          </div>
        ))}
        <div className="mt-auto font-bold text-lg flex justify-between">
          <span>Итого:</span>
          <span>{totalPrice} ₽</span>
        </div>
      </div>

      {/* Middle: Categories */}
      <div className="w-64 flex flex-col gap-2">
        <h2 className="text-xl font-bold">Категории</h2>
        {categoriesData?.data.map((cat) => (
          <button
            key={cat.id}
            className={`p-2 rounded ${selectedCategory?.id === cat.id ? "bg-green-600" : "bg-white/20"}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Right: Menu items */}
      <div className="w-96 flex-1 flex flex-col gap-2">
        <h2 className="text-xl font-bold">{selectedCategory?.name || "Выберите категорию"}</h2>
        <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[500px]">
          {menuData?.data.map((item) => (
            <button
              key={item.id}
              className="p-2 bg-white/20 rounded"
              onClick={() => handleMenuItemClick(item)}
            >
              {item.name} <br /> {item.price} ₽
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
