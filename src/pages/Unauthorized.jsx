import React from "react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">🚫 Нет доступа</h1>
      <p className="mb-6">У вас нет прав для просмотра этой страницы</p>
      <Link
        to="/login"
        className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
      >
        На страницу входа
      </Link>
    </div>
  );
}
