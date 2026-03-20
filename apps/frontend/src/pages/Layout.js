import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../common/components/header/Header";
import SessionStorageDevTool from "../devtools/session-storage-inspector/SessionStorageDevTool";

const Layout = () => {
  return (
    <div className="App">
      <Header />
      <main>
        <Outlet />
      </main>
      <SessionStorageDevTool />
    </div>
  );
};

export default Layout;
