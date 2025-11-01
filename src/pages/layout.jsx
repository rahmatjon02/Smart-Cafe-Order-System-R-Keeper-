import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <header className="flex items-center gap-5 px-5">
        <Link to={"/"}>Admin Panel</Link>
        <Link to={"WaiterEdit"}>Waiter Panel</Link>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
