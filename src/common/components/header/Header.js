import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../../theme/ThemeContext";
import "./Header.css";

const navItems = [
  { path: "/categories", label: "Po kategorijama" },
  { path: "/test-categories", label: "Pitanja sa Testova" },
  { path: "/tests", label: "Simulacija testova" },
  { path: "/marked", label: "Vežbaj obeležena pitanja" },
  { path: "/docs", label: "Dokumenti za učenje" },
];

const Header = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

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
      <li>
        <button
          type="button"
          className="header-theme-toggle"
          onClick={() => {
            toggleTheme();
            closeDrawer();
          }}
          title={theme === "light" ? "Uključi tamni režim" : "Uključi svetli režim"}
          aria-label={theme === "light" ? "Tamni režim" : "Svetli režim"}
        >
          {theme === "light" ? (
            <svg className="header-theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg className="header-theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </li>
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
