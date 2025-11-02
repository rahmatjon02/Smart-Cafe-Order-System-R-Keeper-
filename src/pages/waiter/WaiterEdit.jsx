import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Bell,
  Search,
  Trash,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
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
  useCancelOrderMutation,
  useConfirmOrderMutation,
  usePayOrderMutation,
} from "../../store/orderApi";

function WaiterEdit() {
  // 🔹 теперь из URL получаем оба параметра
  const { tableId, orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const waiterId = 1;

  // --- Получаем заказ ---
  const { data: orderData, isLoading } = useGetSingleOrderQuery({
    orderId: Number(orderId),
    tableId: Number(tableId),
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

  const [selectedCategory, setSelectedCategory] = useState({
    id: "1",
    name: "Все",
  });

  const { data: menuItemsData } = useGetMenuItemsByCategoryQuery(
    { categoryId: selectedCategory?.id || "1", pageNumber: 1, pageSize: 50 },
    { skip: !selectedCategory }
  );

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.priceAtOrderTime * item.quantity,
    0
  );

  // --- Мутации ---
  const [addOrderItem] = useAddOrderItemMutation();
  const [removeOrderItem] = useRemoveOrderItemMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [confirmOrder] = useConfirmOrderMutation();
  const [payOrder] = usePayOrderMutation();

  // --- Добавление блюда ---
  const handleMenuItemClick = async (item) => {
    if (!orderData?.data?.id) return;
    await addOrderItem({ orderId: Number(orderId), menuItemId: item.id });
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
          orderId: Number(orderId),
          menuItemId: item.id,
          quantity: 1,
          priceAtOrderTime: item.price,
        },
      ];
    });
  };

  // --- Удаление блюда ---
  const handleRemoveItem = async (item) => {
    await removeOrderItem({ orderId: Number(orderId), orderItemId: item.id });
    setOrderItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  // --- Отмена заказа ---
  const handleCancelOrder = async () => {
    // Проверяем, есть ли блюда со статусом Started или выше
    const hasStartedItems = orderItems.some(
      (item) =>
        item.status === "Started" ||
        item.status === "Ready" ||
        item.status === "Served"
    );

    if (hasStartedItems) {
      toast.error(
        "Нельзя отменять заказ, некоторые блюда уже начали готовить!"
      );
      return;
    }

    try {
      await cancelOrder(Number(orderId)).unwrap();
      toast.success("Заказ отменён");
      navigate("/WaiterHome");
    } catch (err) {
      toast.error("Ошибка при отмене заказа");
      console.error(err);
    }
  };

  //--Создание заказа--
  const handleConfirmOrder = async () => {
    await confirmOrder({ orderId: Number(orderId) });
    navigate("/WaiterHome");
  };

  //--Оплата заказа--
  const handlePayOrder = async () => {
    await payOrder({ orderId: Number(orderId) });
    navigate("/WaiterHome");
  };

  if (isLoading) return <div className="p-4 text-white">Загрузка...</div>;

  return (
    <div className="bg-black text-white h-screen flex flex-col overflow-hidden">
      <Toaster />
      {/* Header */}
      <div className="p-2 pb-3 shrink-0 bg-black">
        <div className="flex gap-3 items-center justify-between">
          <div className="flex gap-3 items-center justify-between w-[61.5%]">
            <Link
              to={"/WaiterHome"}
              className="h-12 w-40 bg-white/20 flex items-center justify-center text-white rounded-lg text-sm font-medium"
            >
              Назад
            </Link>
            <div className="text-sm h-12 w-4/5 px-4 py-2 bg-white/20 text-white rounded-lg flex items-center justify-between">
              <div className="flex items-center justify-between w-full">
                <div className="font-medium text-white">
                  Редактировать заказ №{orderData?.data?.id || orderId}
                </div>
                <span>Стол: {orderData?.data?.tableId || tableId}</span>
                <div className="text-right mt-1 text-white/60">12:40</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-[38.5%] justify-between">
            <button
              onClick={handleCancelOrder}
              className="px-3 py-2 w-50 h-12 bg-white/20 text-red-400 rounded-lg text-sm cursor-pointer"
            >
              Отменить заказ
            </button>
            <button className="flex items-center justify-center gap-3 px-3 py-2 w-50 h-12 bg-white/20 text-white rounded-lg">
              <Bell size={20} />
              <span>2</span>
            </button>
            <button className="flex items-center justify-center px-3 py-2 w-50 h-12 bg-white/20 text-white rounded-lg">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-2 flex gap-3 overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          <div className="flex gap-1">
            <button className="flex-1 flex items-center justify-center py-2 bg-white/20 rounded-tl-xl">
              <ChevronLeft size={20} />
            </button>
            <button className="flex-1 py-2 bg-white/20 font-medium">
              Все гости
            </button>
            <button className="flex-1 flex items-center justify-center py-2 bg-white/20 rounded-tr-xl">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-1">
            {orderItems.map((item) => {
              const menuItem = menuData?.data.find(
                (m) => m.id === item.menuItemId
              );
              return (
                <div
                  key={item.id}
                  className={`px-3 h-12 py-2 flex gap-1 justify-between items-center ${
                    item.status === "New"
                      ? "bg-white/20 text-white"
                      : item.status === "Started"
                      ? "bg-yellow-500 text-black"
                      : item.status === "Ready"
                      ? "bg-green-500 text-black"
                      : item.status === "Served"
                      ? "bg-gray-300 text-black"
                      : item.status === "Cancelled"
                      ? "bg-red-500 text-white"
                      : "bg-white/20 text-white"
                  }`}
                >
                  <div className="flex-1 text-sm">
                    <div className="font-medium truncate">
                      {menuItem?.name || "Блюдо"}
                    </div>
                  </div>
                  {item.quantity > 1 && (
                    <div className="mx-2 text-xs font-medium">
                      {item.quantity} шт
                    </div>
                  )}
                  <div className="text-right text-sm font-medium">
                    {item.priceAtOrderTime} ₽
                  </div>

                  <div className="ml-2 text-xs font-semibold">
                    {item.status}
                  </div>

                  <button
                    className={`${
                      item.status === "Started" ? "hidden" : ""
                    } ml-1 text-red-500 cursor-pointer rounded-lg p-3 hover:bg-white/10`}
                    onClick={() => handleRemoveItem(item)}
                  >
                    <Trash size={15} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-1">
            {/* <div className="flex gap-1 mb-2">
              <button className="flex-1 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <ChevronDown size={24} />
              </button>
              <button className="flex-1 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <ChevronUp size={24} />
              </button>
              <button className="flex-1 h-10 bg-white/20 rounded-lg flex items-center justify-center gap-2">
                <Plus size={24} />
                <span className="text-sm">Гость</span>
              </button>
            </div> */}
            <div className="flex gap-2">
              <button
                onClick={handlePayOrder}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-base flex justify-between items-center px-4"
              >
                <span>Оплата</span>
                <span>{totalPrice} ₽</span>
              </button>
            </div>
          </div>
        </div>

        {/* Middle Panel */}
        <div className="w-64 flex flex-col gap-1 overflow-hidden">
          <div className="p-2 bg-white/20 rounded-t-xl">
            <h2 className=" font-bold text-center">Меню</h2>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-1 overflow-y-auto scrollbar-hide  justify-items-stretch content-start">
            {categoriesData?.data.map((category) => (
              <button
                key={category.id}
                className="bg-white/20 h-24 font-medium text-xs flex items-center justify-center hover:opacity-90 transition-opacity "
                onClick={() => setSelectedCategory(category)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          <div className="p-2 bg-white/10 rounded-t-xl">
            <h2 className="font-bold text-center">
              {selectedCategory?.name || "Блюда"}
            </h2>
          </div>

          <div className="flex-1 grid grid-cols-3 gap-1 overflow-y-auto scrollbar-hide justify-items-stretch content-start">
            {menuItemsData?.data?.map((item) => (
              <button
                key={item.id}
                className="bg-white/10 h-24 font-medium text-xs flex flex-col gap-2 items-center justify-center hover:opacity-90 transition-opacity"
                onClick={() => handleMenuItemClick(item)}
              >
                <p className="font-bold">{item.name}</p>
                <p className="">{item.description}</p>
                <p className="">{item.price} ₽</p>
              </button>
            ))}
          </div>

          <div className="pt-1">
            <button
              onClick={handleConfirmOrder}
              className="w-full h-10 bg-white/10 text-green-500 hover:bg-gray-600 rounded-lg text-base font-medium"
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
