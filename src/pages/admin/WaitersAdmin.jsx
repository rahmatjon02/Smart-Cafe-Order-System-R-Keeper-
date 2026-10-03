import React, { useState } from "react";
import { useRegisterMutation } from "../../store/authApi";
import {
  useGetAllWaitersQuery,
  useUpdateWaiterMutation,
  useChangePasswordMutation,
  useDeactivateWaiterMutation,
  useActivateWaiterMutation,
  useDeleteWaiterMutation,
} from "../../store/waiterApi";
import toast, { Toaster } from "react-hot-toast";
import { CircularProgress, Modal } from "@mui/material";
import { Edit, Save, X, Trash2, CheckCircle, XCircle, Key } from "lucide-react";

function WaitersAdmin() {
  const { data: waitersData, isLoading, refetch } = useGetAllWaitersQuery({
    pageNumber: 1,
    pageSize: 200,
  });

  const [register] = useRegisterMutation();
  const [updateWaiter] = useUpdateWaiterMutation();
  const [changePassword] = useChangePasswordMutation();
  const [deactivateWaiter] = useDeactivateWaiterMutation();
  const [activateWaiter] = useActivateWaiterMutation();
  const [deleteWaiter] = useDeleteWaiterMutation();

  const [form, setForm] = useState({ username: "", password: "", name: "" });
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", username: "" });

  const [passwordModalId, setPasswordModalId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const extractError = (err) => {
    const msg = err?.data?.message;
    return Array.isArray(msg) ? msg[0] : typeof msg === "string" ? msg : "Неизвестная ошибка";
  };

  const handleAdd = async () => {
    if (!form.username || !form.password || !form.name) {
      toast.error("Заполните все поля");
      return;
    }
    setCreating(true);
    try {
      await register(form).unwrap();
      toast.success("Официант добавлен");
      setForm({ username: "", password: "", name: "" });
      refetch();
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (waiter) => {
    setEditingId(waiter.employeeId);
    setEditForm({ name: waiter.name, username: waiter.username });
  };

  const handleCancelEdit = () => setEditingId(null);

  const handleUpdate = async (id) => {
    if (!editForm.name.trim() || !editForm.username.trim()) {
      toast.error("Имя и логин не могут быть пустыми");
      return;
    }
    try {
      await updateWaiter({ id, ...editForm }).unwrap();
      setEditingId(null);
      toast.success("Данные обновлены");
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  const handlePasswordSave = async () => {
    if (newPassword.length < 4) {
      toast.error("Пароль должен содержать минимум 4 символа");
      return;
    }
    setPwdLoading(true);
    try {
      await changePassword({ id: passwordModalId, newPassword }).unwrap();
      toast.success("Пароль изменён");
      setPasswordModalId(null);
      setNewPassword("");
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setPwdLoading(false);
    }
  };

  const handleToggle = async (waiter) => {
    try {
      if (waiter.isActive) {
        await deactivateWaiter(waiter.employeeId).unwrap();
        toast.success("Официант заблокирован");
      } else {
        await activateWaiter(waiter.employeeId).unwrap();
        toast.success("Официант активирован");
      }
    } catch (err) {
      toast.error(extractError(err));
    }
  };

  const handleDelete = (waiter) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3 text-sm">
          <span>
            Удалить <strong>{waiter.name}</strong>? Это действие необратимо.
          </span>
          <div className="flex justify-end gap-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteWaiter(waiter.employeeId).unwrap();
                  toast.success("Официант удалён");
                } catch (err) {
                  toast.error(extractError(err));
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Удалить
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
            >
              Отмена
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40 text-white py-20">
        <CircularProgress color="inherit" />
      </div>
    );

  const waiters = waitersData?.data || [];

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-4 sm:p-6">
      <Toaster />

      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg lg:text-2xl font-bold mb-6">
          👨‍🍳 Управление официантами
        </h2>

        {/* CREATE FORM */}
        <div className="bg-[#141414] p-4 rounded-2xl mb-6">
          <div className="mb-3 text-sm text-gray-400">Добавить нового официанта</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              placeholder="Логин"
              className="bg-[#1a1a1a] px-3 py-2 rounded"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
              placeholder="Пароль (мин. 4 символа)"
              type="password"
              className="bg-[#1a1a1a] px-3 py-2 rounded"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <input
              placeholder="Имя"
              className="bg-[#1a1a1a] px-3 py-2 rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <button
              onClick={handleAdd}
              disabled={creating}
              className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-black px-4 py-2 rounded"
            >
              {creating ? "Добавление..." : "Добавить"}
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full bg-white/5 rounded-xl overflow-hidden text-sm">
            <thead className="bg-white/10 text-left uppercase text-xs">
              <tr>
                <th className="p-3">Имя</th>
                <th className="p-3">Логин</th>
                <th className="p-3">Статус</th>
                <th className="p-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {waiters.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Нет официантов
                  </td>
                </tr>
              )}
              {waiters.map((w) => (
                <tr
                  key={w.employeeId}
                  className="border-b border-white/10 hover:bg-white/5 transition"
                >
                  {/* NAME */}
                  <td className="p-3">
                    {editingId === w.employeeId ? (
                      <input
                        className="bg-[#1f1f1f] px-2 py-1 rounded w-full"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    ) : (
                      <span className={w.isActive ? "" : "text-gray-500 line-through"}>
                        {w.name}
                      </span>
                    )}
                  </td>

                  {/* USERNAME */}
                  <td className="p-3">
                    {editingId === w.employeeId ? (
                      <input
                        className="bg-[#1f1f1f] px-2 py-1 rounded w-full"
                        value={editForm.username}
                        onChange={(e) =>
                          setEditForm({ ...editForm, username: e.target.value })
                        }
                      />
                    ) : (
                      <span className="text-gray-300">{w.username}</span>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        w.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {w.isActive ? "Активен" : "Заблокирован"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3">
                    <div className="flex justify-end gap-2 flex-wrap">
                      {editingId === w.employeeId ? (
                        <>
                          <button
                            onClick={() => handleUpdate(w.employeeId)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded"
                            title="Сохранить"
                          >
                            <Save size={15} />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-600 hover:bg-gray-700 text-white p-1.5 rounded"
                            title="Отмена"
                          >
                            <X size={15} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(w)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded"
                            title="Редактировать"
                          >
                            <Edit size={15} />
                          </button>
                          <button
                            onClick={() => {
                              setPasswordModalId(w.employeeId);
                              setNewPassword("");
                            }}
                            className="bg-purple-500 hover:bg-purple-600 text-white p-1.5 rounded"
                            title="Изменить пароль"
                          >
                            <Key size={15} />
                          </button>
                          {w.isActive ? (
                            <button
                              onClick={() => handleToggle(w)}
                              className="bg-orange-500 hover:bg-orange-600 text-white p-1.5 rounded"
                              title="Заблокировать"
                            >
                              <XCircle size={15} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggle(w)}
                              className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded"
                              title="Активировать"
                            >
                              <CheckCircle size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(w)}
                            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded"
                            title="Удалить"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      <Modal open={passwordModalId !== null} onClose={() => setPasswordModalId(null)}>
        <div className="absolute top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 bg-[#1c1c1c] p-6 rounded-xl text-white">
          <h3 className="text-lg font-bold mb-4">Изменить пароль</h3>
          <input
            type="password"
            className="w-full bg-[#141414] px-3 py-2 rounded mb-4"
            placeholder="Новый пароль (мин. 4 символа)"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePasswordSave()}
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setPasswordModalId(null)}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
            >
              Отмена
            </button>
            <button
              onClick={handlePasswordSave}
              disabled={pwdLoading}
              className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 px-4 py-2 rounded"
            >
              {pwdLoading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default React.memo(WaitersAdmin);
