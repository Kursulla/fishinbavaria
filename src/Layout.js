import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./common/components/header/Header";

const Layout = () => {
  return (
    <div className="App">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
