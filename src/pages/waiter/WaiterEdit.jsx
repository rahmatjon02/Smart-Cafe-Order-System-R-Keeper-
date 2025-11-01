import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Bell,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  useGetSingleOrderQuery,
  useGetCategoriesQuery,
  useGetMenuItemsByCategoryQuery,
  useAddOrderItemMutation,
  useRemoveOrderItemMutation,
  useGetMenuItemsQuery,
} from "../../store/orderApi";

function WaiterEdit() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableId = searchParams.get("tableId");
  const waiterId = searchParams.get("waiterId");

  // --- Получаем заказ ---
  const { data: orderData, isLoading } = useGetSingleOrderQuery({
    orderId: id,
    tableId,
    waiterId,
  });
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    if (orderData?.data?.orderItems) {
      setOrderItems(orderData.data.orderItems);
    }
  }, [orderData]);

  // --- Меню ---
  const { data: menuData } = useGetMenuItemsQuery({
    pageNumber: 1,
    pageSize: 100,
  });

  // --- Категории ---
  const { data: categoriesData } = useGetCategoriesQuery({
    pageNumber: 1,
    pageSize: 20,
  });
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data: menuItemsData } = useGetMenuItemsByCategoryQuery(
    { categoryId: selectedCategory?.id || 0, pageNumber: 1, pageSize: 50 },
    { skip: !selectedCategory }
  );

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.priceAtOrderTime * item.quantity,
    0
  );

  // --- Мутации ---
  const [addOrderItem] = useAddOrderItemMutation();
  const [removeOrderItem] = useRemoveOrderItemMutation();

  // --- Хендлер добавления блюда ---
  const handleMenuItemClick = async (item) => {
    if (!orderData?.data?.id) return;
    await addOrderItem({ orderId: id, menuItemId: item.id });
    setOrderItems((prev) => {
      const exist = prev.find((i) => i.menuItemId === item.id);
      if (exist) {
        return prev.map((i) =>
          i.menuItemId === item.id
            ? { ...i, quantity: i.quantity + 1, priceAtOrderTime: item.price }
            : i
        );
      }
      return [
        ...prev,
        {
          id: Date.now(),
          orderId: id,
          menuItemId: item.id,
          quantity: 1,
          priceAtOrderTime: item.price,
        },
      ];
    });
  };

  // --- Хендлер удаления блюда ---
  const handleRemoveItem = async (item) => {
    await removeOrderItem({ orderId: id, orderItemId: item.id });
    setOrderItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  if (isLoading) return <div className="p-4 text-white">Загрузка...</div>;

  return (
    <div className="p-2 bg-black">
      {/* Header */}
      <div className="bg-black pb-3">
        <div className="flex gap-3 items-center justify-between">
          <div className="flex gap-3 items-center justify-between w-[61.5%]">
            <Link
              to={"/WaiterHome"}
              className="h-15 w-40 bg-white/20 flex items-center justify-center text-white rounded-lg text-sm font-medium"
            >
              Назад
            </Link>
            <div className="text-sm h-15 w-4/5 px-4 py-2 bg-white/20 text-white rounded-lg">
              <div className="flex items-center justify-between">
                <div className="font-medium text-white">
                  Редактировать заказ
                </div>
                <div className="text-right mt-1 text-white/60">12:40</div>
              </div>
              <div className="flex gap-2 text-white/60">
                <span>Стол: {orderData?.data?.tableId}</span>
                <span>Гостей: {orderItems.length}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-[38.5%] justify-between ">
            <button className="px-3 py-2 w-50 h-15 bg-white/20 text-white rounded-lg text-sm">
              По гостям
            </button>
            <button className="flex items-center justify-center gap-3 px-3 py-2 w-50 h-15 bg-white/20 text-white rounded-lg">
              <Bell size={20} />
              <span className="">2</span>
            </button>
            <button className="flex items-center justify-center px-3 py-2 w-50 h-15 bg-white/20 text-white rounded-lg">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-black text-white flex gap-3">
        {/* Left Panel - Orders */}
        <div className="flex-1 bg-black flex gap-1 flex-col">
          {/* Category Tabs */}
          <div className="flex gap-1 bg-black">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/20 rounded-tl-xl">
              <ChevronLeft size={20} />
            </button>
            <button className="flex-1 py-3 bg-white/20 font-medium">
              Все гости
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/20 rounded-tr-xl">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Order Items */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-1">
            {orderItems.map((item) => {
              const menuItem = menuData?.data.find(
                (m) => m.id === item.menuItemId
              );
              return (
                <div
                  key={item.id}
                  className="px-4 py-3 flex gap-1 justify-between items-center bg-white/20"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {menuItem?.name || "Блюдо"}
                    </div>
                  </div>
                  {item.quantity > 1 && (
                    <div className="mx-3 text-sm">{item.quantity}</div>
                  )}
                  <div className="text-right font-medium">
                    {item.priceAtOrderTime} ₽
                  </div>
                  <button
                    className="ml-2 text-red-500"
                    onClick={() => handleRemoveItem(item)}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="pt-2">
            <div className="flex gap-2 mb-3">
              <button className="flex-1 h-15 bg-white/10 rounded-lg flex items-center justify-center">
                <ChevronDown size={32} />
              </button>
              <button className="flex-1 h-15 bg-white/10 rounded-lg flex items-center justify-center">
                <ChevronUp size={32} />
              </button>
              <button className="flex-1 h-15 bg-white/20 rounded-lg flex items-center justify-center gap-2">
                <Plus size={32} />
                <span>Гость</span>
              </button>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-4 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-lg flex justify-between items-center px-5">
                <span>Оплата</span>
                <span>{totalPrice} ₽</span>
              </button>
            </div>
          </div>
        </div>

        {/* Middle Panel - Menu Categories */}
        <div className="w-72 flex flex-col gap-1">
          <div className="p-4 bg-white/20 rounded-t-xl">
            <h2 className="text-xl font-bold text-center">Меню</h2>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-1 overflow-y-auto">
            {categoriesData?.data.map((category) => (
              <button
                key={category.id}
                className="bg-white/20 h-32 font-medium text-sm flex items-center justify-center hover:opacity-90 transition-opacity"
                onClick={() => setSelectedCategory(category)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Menu Items */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="p-4 bg-white/10 rounded-t-xl">
            <h2 className="text-xl font-bold text-center">
              {selectedCategory?.name || "Блюда"}
            </h2>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-1 overflow-y-auto">
            {menuItemsData?.data?.map((item) => (
              <button
                key={item.id}
                className="bg-blue-700 h-32 font-medium text-sm flex items-center justify-center hover:opacity-90 transition-opacity whitespace-pre-line leading-tight"
                onClick={() => handleMenuItemClick(item)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="pt-2">
            <button
              onClick={() => navigate("/WaiterHome")}
              className="w-full h-15 bg-white/10 text-green-500 hover:bg-gray-600 rounded-lg text-lg font-medium"
            >
              Сохранить заказ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaiterEdit;
