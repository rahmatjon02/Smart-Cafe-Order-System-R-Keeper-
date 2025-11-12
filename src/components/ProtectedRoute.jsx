// src/components/ProtectedRoute.jsx
import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  if (!token) {
    // Если токена нет – редирект на логин
    return <Navigate to="/login" replace />;
  }

  try {
    // Декодируем JWT
    const decoded = jwtDecode(token);

    // Получаем роль
    const role =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    // Проверяем доступ
    if (!allowedRoles.includes(role)) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
          <h1 className="text-2xl font-bold mb-4">🚫 Нет доступа</h1>
          <p className="mb-6">У вас нет прав для просмотра этой страницы</p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-xs font-semibold text-black transition"
            >
              ← Вернуться назад
            </button>
            <Link
              to="/login"
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
            >
              На страницу входа
            </Link>
          </div>
        </div>
      );
    }

    // Роль разрешена – показываем компонент
    return children;
  } catch (err) {
    console.error(err);
    return <Navigate to="/login" replace />; // Ошибка токена – редирект
  }
}
