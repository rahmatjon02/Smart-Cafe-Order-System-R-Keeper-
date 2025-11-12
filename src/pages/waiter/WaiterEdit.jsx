import {
  ChevronLeft,
  ChevronRight,
  Trash,
  Bell,
  Search,
  Check,
  X,
} from "lucide-react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  BottomNavigation,
  BottomNavigationAction,
  Typography,
  Box,
  Button,
  TextField,
} from "@mui/material";
import {
  ArrowBack,
  Category,
  RestaurantMenu,
  Payment,
  Save,
  Close,
} from "@mui/icons-material";
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
  useServeOrderItemMutation,
  useSearchMenuItemsQuery,
} from "../../store/orderApi";
import { useGetProfileQuery } from "../../store/waiterApi";

function WaiterEdit() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { data: profile, refetch: refetchProfile } = useGetProfileQuery();

  // Форматирование времени заказа / позиции
  const formatTime = (t) => {
    if (!t) return "";
    try {
      const d = new Date(t);
      return d.toLocaleString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return String(t);
    }
  };

  // orderCreatedAt будет вычисляться после загрузки orderData

  // --- Получаем заказ ---
  const {
    data: orderData,
    isLoading,
    refetch,
  } = useGetSingleOrderQuery({
    tableId: Number(tableId),
  });
  const orderId = orderData?.data?.id;

  const orderCreatedAt = orderData?.data?.createdAt || "-";

  const orderCompletedAt = orderData?.data?.completedAt || "-";

  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    if (orderData?.data?.orderItems) {
      setOrderItems(orderData.data.orderItems);
    }
  }, [orderData]);

  // --- Поиск ---
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: searchResults, isLoading: isSearchingLoading } =
    useSearchMenuItemsQuery(
      { name: searchTerm, pageNumber: 1, pageSize: 1000 },
      { skip: !searchTerm }
    );

  useEffect(() => {
    refetch();
    refetchProfile();
  }, []);

  // --- Меню и категории ---
  const { data: menuData } = useGetMenuItemsQuery({
    pageNumber: 1,
    pageSize: 1000,
  });

  const { data: categoriesData } = useGetCategoriesQuery({
    pageNumber: 1,
    pageSize: 1000,
  });

  const [selectedCategory, setSelectedCategory] = useState("1");

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
  const [serveOrderItem] = useServeOrderItemMutation();

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

  const handleRemoveItem = async (item) => {
    await removeOrderItem({ orderId: Number(orderId), orderItemId: item.id });
    setOrderItems((prev) => prev.filter((i) => i.id !== item.id));
  };

  const handleServedItem = async (item) => {
    await serveOrderItem({ orderItemId: item.id });
  };

  const handleCancelOrder = async () => {
    // const hasStartedItems = orderItems.some(
    //   (item) =>
    //     item.status === "Started" ||
    //     item.status === "Ready" ||
    //     item.status === "Served"
    // );

    // if (hasStartedItems) {
    //   toast.error("Нельзя отменять заказ — блюда уже готовятся!");
    //   return;
    // }

    try {
      await cancelOrder(Number(orderId)).unwrap();
      toast.success("Заказ отменён");
      navigate("/WaiterHome");
    } catch {
      toast.error("Ошибка при отмене заказа");
    }
  };

  const handleConfirmOrder = async () => {
    await confirmOrder({ orderId: Number(orderId) });
    navigate("/WaiterHome");
  };

  const handlePayOrder = async () => {
    const hasStartedItems = orderItems.some(
      (item) => item.status === "Started"
    );

    if (hasStartedItems) {
      toast.error("Нельзя оплачивать заказ — блюда пока не готовятся!");
      return;
    }

    await payOrder({ orderId: Number(orderId) });
    navigate("/WaiterHome");
  };

  // --- MUI Drawer для мобильной версии ---
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLevel, setDrawerLevel] = useState("categories"); // categories | items

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setDrawerLevel("items");
  };

  const handleBackInDrawer = () => {
    if (drawerLevel === "items") setDrawerLevel("categories");
    else setDrawerOpen(false);
  };

  if (isLoading) return <div className="p-4 text-white">Загрузка...</div>;

  return (
    <div className="bg-black text-white h-screen flex flex-col overflow-hidden">
      <Toaster />

      {/* --- Desktop header --- */}
      <div className="hidden lg:block p-2 pb-3 shrink-0 bg-black">
        <div className="flex gap-3 items-center justify-between">
          <div className="flex gap-3 items-center justify-between w-[61.5%]">
            <Link
              to={"/WaiterHome"}
              className="h-12 w-40 bg-white/20 flex items-center justify-center text-white rounded-xs text-sm font-medium"
            >
              Назад
            </Link>
            <div className="text-sm h-12 w-4/5 px-4 py-2 bg-white/20 text-white rounded-xs flex items-center justify-between">
              <div className="flex items-center justify-between w-full">
                <div className="font-medium text-white">
                  Заказ №{orderData?.data?.id || orderId}
                </div>
                <span>Стол: {orderData?.data?.tableId || tableId}</span>
                <div className="text-right mt-1 text-white/60">
                  {formatTime(orderCreatedAt) || "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-[38.5%] justify-between">
            {!isSearching ? (
              <>
                <button
                  onClick={handleCancelOrder}
                  className="px-3 py-2 w-50 h-12 bg-white/20 text-red-400 rounded-xs text-sm cursor-pointer"
                >
                  Отменить заказ
                </button>
                <button className="flex items-center justify-center gap-3 px-3 py-2 w-50 h-12 bg-white/20 text-white rounded-xs">
                  <Bell size={20} />
                  <span>2</span>
                </button>
                <button
                  onClick={() => setIsSearching(true)}
                  className="flex items-center justify-center px-3 py-2 w-50 h-12 bg-white/20 text-white rounded-xs"
                >
                  <Search size={20} />
                </button>
              </>
            ) : (
              <div className="flex items-center w-full gap-2">
                <input
                  type="text"
                  placeholder="Введите название блюда..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 h-12 bg-white/20 text-white px-3 rounded-xs focus:outline-none placeholder-white/60"
                />
                <button
                  onClick={() => {
                    setIsSearching(false);
                    setSearchTerm("");
                  }}
                  className="bg-red-500/80 hover:bg-red-600 text-white p-3 rounded-xs"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Desktop layout --- */}
      <div className="hidden lg:flex flex-1 p-2 gap-3 overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          <div className="flex gap-1">
            <button className="flex-1 py-2 bg-white/20 font-medium rounded-t-xl">
              Все гости
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
                      ? "bg-gray-600 text-black"
                      : item.status === "Cancelled"
                      ? "bg-red-500 text-white"
                      : "bg-white/20 text-white"
                  }`}
                >
                  <div className="flex-1 text-sm">
                    <div className="font-medium truncate">
                      #{item.id} {menuItem?.name || "Блюдо"}
                    </div>
                    <div className="text-xs text-white/60">
                      {formatTime(item.startedAt || "-")}
                      {" - "}
                      {formatTime(item.completedAt || "-")}
                    </div>
                  </div>
                  <div className="mx-2 text-xs font-medium">
                    {item.quantity} шт
                  </div>
                  <div className="text-right text-sm font-medium">
                    {item.priceAtOrderTime} TJS
                  </div>

                  <button
                    title="Удалить блюдо из заказа"
                    className={`${
                      item.status === "New" ? "block" : "hidden"
                    } ml-1 text-red-500 cursor-pointer rounded-xs p-3 hover:bg-white/10`}
                    onClick={() => handleRemoveItem(item)}
                  >
                    <Trash size={15} />
                  </button>

                  <button
                    className={`${
                      item.status === "Ready" ? "block" : "hidden"
                    } ml-1 text-black bg-green-300 cursor-pointer rounded-xs p-3 hover:bg-white/50`}
                    onClick={() => handleServedItem(item)}
                  >
                    <Check size={15} />
                  </button>

                  <div className="ml-2 text-xs font-semibold">
                    {item.status == "New"
                      ? "Создан"
                      : item.status == "Started"
                      ? "В процессе"
                      : item.status == "Ready"
                      ? "Готов"
                      : item.status == "Served"
                      ? "Подан"
                      : item.status == "Cancelled"
                      ? "Отменен"
                      : ""}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-1 flex gap-2">
            <button
              onClick={handlePayOrder}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-xs font-bold text-base flex justify-between items-center px-4"
            >
              <span>Оплата</span>
              <span>{totalPrice} TJS</span>
            </button>
            <button
              onClick={handleConfirmOrder}
              className="flex-1 py-3 bg-white/10 hover:bg-gray-600 rounded-xs font-bold text-base"
            >
              Сохранить заказ
            </button>
          </div>
        </div>

        {/* Middle & Right Panels */}
        <div className="w-64 flex flex-col gap-1 overflow-hidden">
          <div className="p-2 bg-white/20 rounded-t-xl text-center font-bold">
            Меню
          </div>
          <div className="flex-1 grid grid-cols-2 gap-1 overflow-y-auto scrollbar-hide content-start">
            {categoriesData?.data.map((category) => (
              <button
                key={category.id}
                className="bg-white/20 h-24 font-medium text-xs flex items-center justify-center hover:opacity-90 transition-opacity"
                onClick={() => setSelectedCategory(category)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          <div className="p-2 bg-white/20 rounded-t-xl">
            <h2 className=" font-bold text-center">
              {selectedCategory?.name || "Блюда"}
            </h2>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-1 overflow-y-auto scrollbar-hide content-start">
            {(searchTerm ? searchResults?.data : menuItemsData?.data)?.map(
              (item) => (
                <button
                  key={item.id}
                  className="bg-white/10 h-24 font-medium text-xs flex flex-col gap-2 items-center justify-center hover:opacity-90 transition-opacity"
                  onClick={() => handleMenuItemClick(item)}
                >
                  <p className="font-bold">{item.name}</p>
                  <p>{item.description}</p>
                  <p>{item.price} TJS</p>
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* --- Mobile layout --- */}
      <div className="lg:hidden flex flex-col min-h-[92vh] overflow-hidden">
        <AppBar position="static" sx={{ background: "rgba(255,255,255,0.1)" }}>
          {!isSearching ? (
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton
                color="inherit"
                onClick={() => navigate("/WaiterHome")}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="body1">
                Заказ #{orderData?.data?.id || orderId} | Стол -{" "}
                {orderData?.data?.tableId || tableId}
              </Typography>
              <Box>
                <IconButton
                  onClick={() => setIsSearching(true)}
                  color="inherit"
                >
                  <Search />
                </IconButton>
                <IconButton onClick={handleCancelOrder} color="inherit">
                  <Trash color="red" />
                </IconButton>
              </Box>
            </Toolbar>
          ) : (
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
              <IconButton color="inherit" onClick={() => setIsSearching(false)}>
                <ArrowBack />
              </IconButton>
              <TextField
                autoFocus
                variant="standard"
                placeholder="Поиск блюд"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  style: { color: "white" },
                }}
                sx={{ flex: 1 }}
              />
              <IconButton
                color="inherit"
                onClick={() => {
                  setIsSearching(false);
                  setSearchTerm("");
                }}
              >
                <Close />
              </IconButton>
            </Toolbar>
          )}
        </AppBar>

        <div className="flex flex-col justify-between h-full">
          {/* Список заказанных блюд */}
          <div className=" p-2 flex flex-col gap-2">
            {/* Красивое время заказа */}
            <div className="p-3 bg-white/6 rounded-xs text-center flex items-center justify-center gap-5">
              <div className="text-base text-white/60">Время заказа</div>
              <div className="font-bold text-lg">
                {formatTime(orderCreatedAt) || "—"}
              </div>
            </div>

            <div className="overflow-y-scroll max-h-[20vh] space-y-2">
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
                        ? "bg-gray-600 text-black"
                        : item.status === "Cancelled"
                        ? "bg-red-500 text-white"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    <div className="flex-1 text-sm">
                      <div className="font-medium truncate">
                        {menuItem?.name || "Блюдо"}
                      </div>
                      <div className="text-xs text-white/60">
                        {formatTime(item.startedAt || "-")}
                      </div>
                    </div>
                    <div className="mx-2 text-xs font-medium">
                      {item.quantity} шт
                    </div>
                    <div className="text-right text-sm font-medium">
                      {item.priceAtOrderTime} TJS
                    </div>

                    <button
                      title="Удалить блюдо из заказа"
                      className={`${
                        item.status === "New" ? "block" : "hidden"
                      } ml-1 text-red-500 cursor-pointer rounded-xs p-3 hover:bg-white/10`}
                      onClick={() => handleRemoveItem(item)}
                    >
                      <Trash size={15} />
                    </button>

                    <button
                      className={`${
                        item.status === "Ready" ? "block" : "hidden"
                      } ml-1 text-black bg-green-300 cursor-pointer rounded-xs p-3 hover:bg-white/50`}
                      onClick={() => handleServedItem(item)}
                    >
                      <Check size={15} />
                    </button>

                    <div className="ml-2 text-xs font-semibold">
                      {item.status == "New"
                        ? "Создан"
                        : item.status == "Started"
                        ? "В процессе"
                        : item.status == "Ready"
                        ? "Готов"
                        : item.status == "Served"
                        ? "Подан"
                        : item.status == "Cancelled"
                        ? "Отменен"
                        : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* --- Bottom menu --- */}
          <BottomNavigation
            showLabels
            sx={{
              background: "rgba(255,255,255,0.1)",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              "& .MuiBottomNavigationAction-root": {
                color: "white",
                "&.Mui-selected": {
                  color: "#00bfff", // Акцент при выборе (опционально)
                },
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
            }}
          >
            <BottomNavigationAction
              label="Меню"
              icon={<Category />}
              onClick={toggleDrawer(true)}
            />
            <BottomNavigationAction
              label="Оплата"
              icon={<Payment />}
              onClick={handlePayOrder}
            />
            <BottomNavigationAction
              label="Сохранить"
              icon={<Save />}
              onClick={handleConfirmOrder}
            />
          </BottomNavigation>
        </div>

        {/* --- Drawer снизу --- */}
        <Drawer
          anchor="bottom"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          PaperProps={{
            sx: {
              background: "#111",
              color: "white",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              height: "80%",
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <IconButton color="inherit" onClick={handleBackInDrawer}>
                {drawerLevel === "items" ? <ArrowBack /> : <Close />}
              </IconButton>
              <Typography variant="h6">
                {drawerLevel === "items" ? selectedCategory?.name : "Категории"}
              </Typography>
              <Box sx={{ width: 40 }} />
            </Box>

            {drawerLevel === "categories" && (
              <div className="grid grid-cols-2 gap-2">
                {categoriesData?.data.map((cat) => (
                  <Button
                    key={cat.id}
                    variant="contained"
                    onClick={() => handleSelectCategory(cat)}
                    sx={{
                      background: "rgba(255,255,255,0.1)",
                      color: "white",
                      height: "80px",
                      "&:hover": { background: "rgba(255,255,255,0.2)" },
                    }}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            )}

            {drawerLevel === "items" && (
              <div className="grid grid-cols-2 gap-2">
                {menuItemsData?.data?.map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item)}
                    variant="contained"
                    sx={{
                      background: "rgba(255,255,255,0.1)",
                      color: "white",
                      height: "100px",
                      flexDirection: "column",
                      "&:hover": { background: "rgba(255,255,255,0.2)" },
                    }}
                  >
                    <span className="font-bold">{item.name}</span>
                    <span className="text-sm">{item.price} TJS</span>
                  </Button>
                ))}
              </div>
            )}
          </Box>
        </Drawer>
      </div>
    </div>
  );
}

export default WaiterEdit;
