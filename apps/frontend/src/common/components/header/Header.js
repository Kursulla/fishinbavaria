import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../features/auth/context/AuthContext";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navItems = [
    { path: "/categories", label: "Pitanja po kategorijama" },
    { path: "/test-categories", label: "Pitanja sa testova" },
    { path: "/tests", label: "Simulacija testova" },
    { path: "/marked", label: "Vežbaj obeležena pitanja" },
    { path: "/docs", label: "Materijali za učenje" },
  ];

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setUserMenuOpen(false);
  };

  const navContent = (
    <>
      {navItems.map(({ path, label }) => (
        <li key={path}>
          <Link
            to={path}
            className={`header-nav-link ${location.pathname === path ? "header-nav-link--active" : ""}`}
            onClick={closeDrawer}
          >
            {label}
          </Link>
        </li>
      ))}
      {currentUser?.role === "ADMIN" && (
        <li>
          <Link
            to="/admin/users"
            className={`header-nav-link ${location.pathname === "/admin/users" ? "header-nav-link--active" : ""}`}
            onClick={closeDrawer}
          >
            Admin
          </Link>
        </li>
      )}
    </>
  );

  return (
    <header className="app-header">
      <Link to="/" className="header-logo-link" onClick={closeDrawer}>
        <span className="header-logo-wrap">
          <img className="header-logo" src="/logo_300.png" alt="Catch the License" />
        </span>
      </Link>
      <button
        type="button"
        className="header-menu-btn"
        onClick={() => setDrawerOpen((o) => !o)}
        aria-label={drawerOpen ? "Zatvori meni" : "Otvori meni"}
        aria-expanded={drawerOpen}
      >
        <span className="header-menu-btn-bar" />
        <span className="header-menu-btn-bar" />
        <span className="header-menu-btn-bar" />
      </button>
      <nav className="header-nav" aria-hidden={drawerOpen}>
        <ul className="header-nav-list">{navContent}</ul>
      </nav>
      <div className="header-user" ref={userMenuRef}>
        <button
          type="button"
          className="header-user-trigger"
          onClick={() => setUserMenuOpen((value) => !value)}
          aria-haspopup="menu"
          aria-expanded={userMenuOpen}
        >
          Dobro dosao, {currentUser?.firstName} {currentUser?.lastName}
        </button>
        {userMenuOpen && (
          <div className="header-user-menu" role="menu">
            <button
              type="button"
              className="header-user-menu-action"
              role="menuitem"
              onClick={async () => {
                await logout();
                closeDrawer();
              }}
            >
              Izloguj se
            </button>
          </div>
        )}
      </div>
      <div
        className={`header-drawer-backdrop ${drawerOpen ? "header-drawer-backdrop--open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <div className={`header-drawer ${drawerOpen ? "header-drawer--open" : ""}`} role="dialog" aria-label="Meni">
        <ul className="header-drawer-list">{navContent}</ul>
      </div>
    </header>
  );
};

export default Header;
