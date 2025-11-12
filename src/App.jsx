// src/App.jsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./pages/layout";
import AdminPanel from "./pages/admin/AdminPanel";
import WaiterHome from "./pages/waiter/WaiterHome";
import WaiterEdit from "./pages/waiter/WaiterEdit";
import Kitchen from "./pages/kitchen/Kitchen";
import TablesAdmin from "./pages/admin/TablesAdmin";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin";
import WaitersAdmin from "./pages/admin/WaitersAdmin";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public */}
        <Route path="login" element={<Login />} />

        {/* Admin */}
        <Route
          index
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/tables"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <TablesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/categories"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <CategoriesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/waiters"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <WaitersAdmin />
            </ProtectedRoute>
          }
        />

        {/* Waiter */}
        <Route
          path="WaiterHome"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Waiter"]}>
              <WaiterHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="WaiterEdit/:tableId"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Waiter"]}>
              <WaiterEdit />
            </ProtectedRoute>
          }
        />

        {/* Kitchen */}
        <Route
          path="Kitchen"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Kitchen"]}>
              <Kitchen />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
