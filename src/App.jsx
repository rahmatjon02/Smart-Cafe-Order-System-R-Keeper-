// src/App.jsx
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

const Layout = lazy(() => import("./pages/Layout"));
const AdminPanel = lazy(() => import("./pages/admin/AdminPanel"));
const WaiterHome = lazy(() => import("./pages/waiter/WaiterHome"));
const WaiterEdit = lazy(() => import("./pages/waiter/WaiterEdit"));
const Kitchen = lazy(() => import("./pages/kitchen/Kitchen"));
const TablesAdmin = lazy(() => import("./pages/admin/TablesAdmin"));
const CategoriesAdmin = lazy(() => import("./pages/admin/CategoriesAdmin"));
const WaitersAdmin = lazy(() => import("./pages/admin/WaitersAdmin"));
const Login = lazy(() => import("./pages/Login"));

const App = () => {
  return (
    <Suspense
      fallback={<div className="text-center text-lg py-20">Загрузка...</div>}
    >
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public */}
          <Route path="login" element={<Login />} />

          {/* Admin */}
          <Route index element={<ProtectedRoute allowedRoles={["Admin"]}> <AdminPanel /> </ProtectedRoute>}/>

          
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
    </Suspense>
  );
};

export default App;
