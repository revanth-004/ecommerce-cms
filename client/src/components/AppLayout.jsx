import React from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";
import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <div>
      <div className="flex ">
        <AppSidebar />
        <div className="w-full ml-64  min-h-screen">
          <AppHeader />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
