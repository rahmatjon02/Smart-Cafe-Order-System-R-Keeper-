// src/hooks/useAuth.js
import { jwtDecode } from "jwt-decode";

export default function useAuth() {
  const token = localStorage.getItem("token");
  if (!token) return { role: null, isAuthenticated: false };

  try {
    const decoded = jwtDecode(token);
    const role = decoded[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];

    return {
      role,
      isAuthenticated: !!token,
      isAdmin: role === "Admin",
      isWaiter: role === "Waiter",
      isKitchen: role === "Kitchen",
    };
  } catch (e) {
    console.error("Ошибка при декодировании токена:", e);
    return { role: null, isAuthenticated: false };
  }
}
