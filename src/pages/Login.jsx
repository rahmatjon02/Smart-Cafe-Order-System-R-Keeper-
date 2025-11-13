// src/pages/Login.jsx
import React, { useState } from "react";
import { useLoginMutation } from "../store/authApi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const [login] = useLoginMutation();
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.error("Введите логин и пароль");
      return;
    }

    try {
      const res = await login(form).unwrap();
      const token = res?.data?.token;
      if (!token) throw new Error("Токен не получен");

      // сохраняем токен
      localStorage.setItem("token", token);

      // теперь просто используем твой готовый хук useAuth
      const { role } = useAuth();

      if (role === "Admin") navigate("/");
      else if (role === "Waiter") navigate("/WaiterHome");
      else if (role === "Kitchen") navigate("/Kitchen");
      else toast.error("Неизвестная роль");
    } catch (err) {
      console.error(err);
      toast.error("Ошибка авторизации или неверные данные");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-sm bg-[#0f0f0f] p-6 rounded-xl shadow"
      >
        <h2 className="text-xl font-semibold text-center mb-5">
          Вход в систему
        </h2>

        <label className="block text-sm mb-2">Логин</label>
        <input
          className="w-full mb-3 px-3 py-2 bg-[rgb(40,40,40)] rounded"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <label className="block text-sm mb-2">Пароль</label>
        <input
          type="password"
          className="w-full mb-4 px-3 py-2 bg-[rgb(40,40,40)] rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-black py-2 rounded font-semibold"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
