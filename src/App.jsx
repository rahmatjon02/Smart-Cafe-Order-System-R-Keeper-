import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./pages/layout";
import AdminPanel from "./pages/admin/AdminPanel";
import WaiterHome from "./pages/waiter/WaiterHome";
import WaiterAdd from "./pages/waiter/WaiterAdd";
import WaiterEdit from "./pages/waiter/WaiterEdit";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Админ */}
        <Route index element={<AdminPanel />} />
        <Route path="admin" element={<AdminPanel />} />

        {/* Официант */}
        <Route path="WaiterHome" element={<WaiterHome />} />
        <Route path="waiter/add" element={<WaiterAdd />} />
        <Route path="waiter/edit/:id" element={<WaiterEdit />} />
      </Route>
    </Routes>
  );
};

export default App;
