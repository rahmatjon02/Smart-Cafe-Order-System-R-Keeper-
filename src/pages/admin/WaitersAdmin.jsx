// src/pages/WaitersAdmin.jsx
import React, { useState } from "react";
import { useRegisterMutation } from "../../store/authApi";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useGetAllWaitersQuery } from "../../store/waiterApi";

export default function WaitersAdmin() {
  const [register] = useRegisterMutation();
  const [form, setForm] = useState({ username: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const { data: waitersData, isLoading: waitersLoading } =
    useGetAllWaitersQuery({ pageNumber: 1, pageSize: 200 });

  const handleAdd = async () => {
    if (!form.username || !form.password || !form.name) {
      toast.error("Заполните все поля");
      return;
    }
    setLoading(true);
    try {
      await register(form).unwrap();
      toast.success("Официант добавлен");
      setForm({ username: "", password: "", name: "" });
    } catch (err) {
      console.error(err);
      toast.error("Ошибка добавления официанта");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white p-6">
      <Toaster />
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold">
            👨‍🍳 Управление официантами
          </h2>
        </div>

        <div className="bg-[#141414] p-4 rounded-2xl">
          <div className="mb-4 text-sm text-gray-400">
            Добавить нового официанта (создаётся пользователь с ролью по
            умолчанию)
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <input
              placeholder="username"
              className="bg-[#1a1a1a] px-3 py-2 rounded"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
              placeholder="password"
              className="bg-[#1a1a1a] px-3 py-2 rounded"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <input
              placeholder="name"
              className="bg-[#1a1a1a] px-3 py-2 rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <button
              onClick={handleAdd}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-xs"
            >
              {loading ? "Добавление..." : "Добавить"}
            </button>
          </div>
        </div>

        <table className="bg-[#141414] p-4 rounded-2xl w-full mt-8 table-auto border-collapse ">
          <thead className="border-b">
            <tr>
              <th className="rounded-2xl px-4 py-2 text-left">Name</th>
              <th className="rounded-2xl px-4 py-2 text-left">Username</th>
            </tr>
          </thead>

          <tbody>
            {waitersData?.data?.map((waiter) => (
              <tr key={waiter.id}>
                <td className="px-4 py-2 text-left">{waiter.name}</td>
                <td className="px-4 py-2 text-left">{waiter.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
