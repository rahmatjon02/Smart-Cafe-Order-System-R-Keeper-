import React, { useState } from "react";
import {
  Edit,
  Save,
  Plus,
  CheckCircle,
  XCircle,
  ArrowDown,
  ArrowUp,
  X,
  Trash2,
} from "lucide-react";
import {
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
  useActivateCategoryMutation,
  useDeleteCategoryMutation,
  useGetMenuItemsByCategoryQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useActivateMenuItemMutation,
  useCreateCategoryMutation,
} from "../../store/orderApi.js";
import { CircularProgress, Collapse, Modal } from "@mui/material";

export default function CategoriesAdmin() {
  const { data, isLoading, refetch } = useGetCategoriesQuery({
    onlyActive: false,
    pageNumber: 1,
    pageSize: 1000,
  });

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [activateCategory] = useActivateCategoryMutation();
  const [createMenuItem] = useCreateMenuItemMutation();

  const [newName, setNewName] = useState("");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    prepTime: "",
  });

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await createCategory({ name: newName }).unwrap();
      setNewName("");
      refetch();
    } catch (err) {
      console.error("Ошибка при добавлении категории:", err);
    }
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleUpdate = async (id) => {
    if (!editingName.trim()) return;
    try {
      await updateCategory({ id, name: editingName }).unwrap();
      setEditingId(null);
      setEditingName("");
      refetch();
    } catch (err) {
      console.error("Ошибка при обновлении категории:", err);
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateCategory({ categoryId: id }).unwrap();
      refetch();
    } catch (err) {
      console.error("Ошибка при активации категории:", err);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deleteCategory({ categoryId: id }).unwrap();
      refetch();
    } catch (err) {
      console.error("Ошибка при деактивации категории:", err);
    }
  };

  const handleOpenCategory = (id) => {
    setExpandedCategory(expandedCategory === id ? null : id);
  };

  const handleOpenModal = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setNewItem({ name: "", description: "", price: "", prepTime: "" });
    setModalOpen(true);
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !newItem.price) return;
    try {
      await createMenuItem({
        name: newItem.name,
        description: newItem.description,
        price: parseFloat(newItem.price),
        prepTime: `${newItem.prepTime}`,
        categoryId: selectedCategoryId,
      }).unwrap();
      setModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Ошибка при добавлении блюда:", err);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40 text-white">
        <CircularProgress color="inherit" />
      </div>
    );

  const categories = data?.data || [];

  return (
    <div className="p-4 sm:p-6 text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
          📂 Категории и блюда
        </h2>
        <button
          onClick={() => refetch()}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm sm:text-base"
        >
          Обновить
        </button>
      </div>

      {/* ADD CATEGORY */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          className="bg-[#141414] px-4 py-2 rounded-lg w-full sm:w-64 text-sm sm:text-base"
          placeholder="Название новой категории"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg text-sm sm:text-base"
        >
          Добавить
        </button>
      </div>

      {/* TABLE WRAPPER */}
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full border-collapse bg-white/5 rounded-xl overflow-hidden text-sm sm:text-base">
          <thead className="bg-white/10 text-left uppercase">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Название</th>
              <th className="p-3">Активна</th>
              <th className="p-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <React.Fragment key={cat.id}>
                <tr className="border-b border-white/10 hover:bg-white/10 transition">
                  {/* ID */}
                  <td className="p-3">{cat.id}</td>

                  {/* NAME */}
                  <td className="p-3">
                    {editingId === cat.id ? (
                      <input
                        className="bg-[#1f1f1f] px-2 py-1 rounded-lg w-full"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                      />
                    ) : (
                      cat.name
                    )}
                  </td>

                  {/* ACTIVE */}
                  <td className="p-3">
                    {cat.isActive ? "✅ Активна" : "❌ Неактивна"}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 flex flex-wrap justify-end gap-2">
                    {editingId === cat.id ? (
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg"
                        title="Сохранить"
                      >
                        <Save size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(cat.id, cat.name)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                        title="Редактировать"
                      >
                        <Edit size={18} />
                      </button>
                    )}

                    <button
                      onClick={() => handleOpenModal(cat.id)}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                      title="Добавить блюдо"
                    >
                      <Plus size={18} />
                    </button>

                    <button
                      onClick={() => handleOpenCategory(cat.id)}
                      className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg"
                      title={
                        expandedCategory === cat.id
                          ? "Скрыть блюда"
                          : "Показать блюда"
                      }
                    >
                      {expandedCategory === cat.id ? (
                        <ArrowUp size={18} />
                      ) : (
                        <ArrowDown size={18} />
                      )}
                    </button>

                    {cat.isActive ? (
                      <button
                        onClick={() => handleDeactivate(cat.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                        title="Деактивировать"
                      >
                        <XCircle size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(cat.id)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-lg"
                        title="Активировать"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                  </td>
                </tr>

                {/* COLLAPSE: MENU ITEMS */}
                <tr>
                  <td colSpan="4" className="p-0">
                    <Collapse in={expandedCategory === cat.id}>
                      <div className="p-3 bg-[#111] border-t border-white/10 rounded-b-lg">
                        <CategoryMenuItems categoryId={cat.id} />
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: ADD ITEM */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="absolute top-1/2 left-1/2 w-80 sm:w-96 -translate-x-1/2 -translate-y-1/2 bg-[#1c1c1c] p-6 rounded-xl text-white">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Добавить блюдо</h3>
          <div className="space-y-3">
            <input
              className="w-full bg-[#141414] px-3 py-2 rounded-lg"
              placeholder="Название"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              className="w-full bg-[#141414] px-3 py-2 rounded-lg"
              placeholder="Описание"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
            />
            <input
              type="number"
              className="w-full bg-[#141414] px-3 py-2 rounded-lg"
              placeholder="Цена TJS"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
            />
            <input
              type="time"
              className="w-full bg-[#141414] px-3 py-2 rounded-lg text-white"
              placeholder="Время готовки"
              value={newItem.prepTime}
              onChange={(e) =>
                setNewItem({ ...newItem, prepTime: e.target.value })
              }
            />
          </div>
          <div className="flex justify-between gap-3 mt-6">
            <button
              onClick={() => setModalOpen(false)}
              className="bg-gray-600 hover:bg-gray-700 p-2 rounded-lg"
              title="Отмена"
            >
              <X size={18} />
            </button>
            <button
              onClick={handleAddItem}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
              title="Сохранить"
            >
              <Save size={18} />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* === TABLE: MENU ITEMS === */
function CategoryMenuItems({ categoryId }) {
  const { data, isLoading, refetch } = useGetMenuItemsByCategoryQuery({
    categoryId,
    pageNumber: 1,
    pageSize: 1000,
  });

  const { data: allCategories } = useGetCategoriesQuery({
    onlyActive: true,
    pageNumber: 1,
    pageSize: 1000,
  });

  const [updateMenuItem] = useUpdateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();
  const [activateMenuItem] = useActivateMenuItemMutation();

  const [editingId, setEditingId] = useState(null);
  const [editing, setEditing] = useState({
    name: "",
    description: "",
    price: "",
    prepTime: "",
    categoryId: categoryId,
  });

  const handleEdit = (m) => {
    setEditingId(m.id);
    setEditing({
      name: m.name,
      description: m.description,
      price: m.price,
      prepTime: m.prepTime,
      categoryId: m.categoryId,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await updateMenuItem({
        id,
        name: editing.name,
        description: editing.description,
        price: parseFloat(editing.price),
        prepTime: `${editing.prepTime}`,
        categoryId: editing.categoryId,
      }).unwrap();
      setEditingId(null);
      refetch();
    } catch (err) {
      console.error("Ошибка при обновлении:", err);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deleteMenuItem({ menuItemId: id }).unwrap();
      refetch();
    } catch (err) {
      console.error("Ошибка при деактивации блюда:", err);
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateMenuItem({ menuItemId: id }).unwrap();
      refetch();
    } catch (err) {
      console.error("Ошибка при активации блюда:", err);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-6">
        <CircularProgress color="inherit" />
      </div>
    );

  const menu = data?.data || [];
  const categories = allCategories?.data || [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-[#181818] rounded-xl overflow-hidden">
        <thead className="bg-white/10 text-left text-sm uppercase">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Название</th>
            <th className="p-3">Описание</th>
            <th className="p-3">Цена</th>
            <th className="p-3">Готовка</th>
            <th className="p-3">Категория</th>
            <th className="p-3 text-right">Действия</th>
          </tr>
        </thead>
        <tbody>
          {menu.length === 0 && (
            <tr>
              <td colSpan={7} className="p-3 text-center">
                Нет данных
              </td>
            </tr>
          )}
          {menu.map((m) => (
            <tr
              key={m.id}
              className="border-b border-white/10 hover:bg-white/10 transition"
            >
              {/* ID */}
              <td className="p-3">
                <span className="md:hidden text-white/50 text-xs">ID: </span>
                {m.id}
              </td>

              {/* Название */}
              <td className="p-3">
                {editingId === m.id ? (
                  <input
                    className="bg-[#1f1f1f] px-2 py-1 rounded-xs w-full"
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                  />
                ) : (
                  m.name
                )}
              </td>

              {/* Описание */}
              <td className="p-3">
                {editingId === m.id ? (
                  <input
                    className="bg-[#1f1f1f] px-2 py-1 rounded-xs w-full"
                    value={editing.description}
                    onChange={(e) =>
                      setEditing({ ...editing, description: e.target.value })
                    }
                  />
                ) : (
                  m.description
                )}
              </td>

              {/* Цена */}
              <td className="p-3">
                {editingId === m.id ? (
                  <input
                    type="number"
                    className="bg-[#1f1f1f] px-2 py-1 rounded-xs w-24"
                    value={editing.price}
                    onChange={(e) =>
                      setEditing({ ...editing, price: e.target.value })
                    }
                  />
                ) : (
                  `${m.price} TJS`
                )}
              </td>

              {/* Готовка */}
              <td className="p-3">
                {editingId === m.id ? (
                  <input
                    type="time"
                    className="bg-[#1f1f1f] px-2 py-1 rounded-xs w-28"
                    value={editing.prepTime}
                    onChange={(e) =>
                      setEditing({ ...editing, prepTime: e.target.value })
                    }
                  />
                ) : (
                  m.prepTime
                )}
              </td>

              {/* Категория */}
              <td className="p-3">
                {editingId === m.id ? (
                  <select
                    className="bg-[#1f1f1f] px-2 py-1 rounded-xs w-full"
                    value={editing.categoryId}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        categoryId: Number(e.target.value),
                      })
                    }
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  categories.find((c) => c.id === m.categoryId)?.name || "—"
                )}
              </td>

              {/* Действия */}
              <td className="p-3 flex flex-wrap md:flex-nowrap justify-end gap-2">
                {editingId === m.id ? (
                  <button
                    onClick={() => handleUpdate(m.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-xs"
                    title="Сохранить"
                  >
                    <Save size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(m)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-xs"
                    title="Редактировать"
                  >
                    <Edit size={18} />
                  </button>
                )}

                {m.isActive ? (
                  <button
                    onClick={() => handleDeactivate(m.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-xs"
                    title="Удалить"
                  >
                    <Trash2 size={18} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivate(m.id)}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-xs"
                    title="Активировать"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
