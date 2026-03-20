import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../features/auth/context/AuthContext";
import { useTheme } from "../../../theme/ThemeContext";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const desktopUserMenuRef = useRef(null);
  const mobileUserMenuRef = useRef(null);
  const navItems = [
    { path: "/categories", label: "Pitanja po kategorijama" },
    { path: "/test-categories", label: "Pitanja sa testova" },
    { path: "/tests", label: "Simulacija testova" },
    { path: "/marked", label: "Vežbaj obeležena pitanja" },
    { path: "/docs", label: "Materijali za učenje" },
  ];

  useEffect(() => {
    const handlePointerDown = (event) => {
      const clickedDesktopUserMenu = desktopUserMenuRef.current?.contains(event.target);
      const clickedMobileUserMenu = mobileUserMenuRef.current?.contains(event.target);

      if (!clickedDesktopUserMenu && !clickedMobileUserMenu) {
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

  const renderUserSection = (className, userMenuRef) => (
    <div className={className} ref={userMenuRef}>
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
            className="header-user-menu-secondary-action"
            role="menuitem"
            aria-label={theme === "light" ? "Uključi dark mode" : "Uključi light mode"}
            onClick={() => {
              toggleTheme();
              setUserMenuOpen(false);
            }}
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
  );

  return (
    <header className="app-header">
      <Link to="/" className="header-logo-link" onClick={closeDrawer}>
        <span className="header-logo-wrap">
          <img className="header-logo" src={theme === "dark" ? "/logo_500_dark.png" : "/logo_500.png"} alt="Catch the License" />
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
      {renderUserSection("header-user header-user--desktop", desktopUserMenuRef)}
      <div
        className={`header-drawer-backdrop ${drawerOpen ? "header-drawer-backdrop--open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <div className={`header-drawer ${drawerOpen ? "header-drawer--open" : ""}`} role="dialog" aria-label="Meni">
        {renderUserSection("header-user header-user--mobile", mobileUserMenuRef)}
        <ul className="header-drawer-list">{navContent}</ul>
      </div>
    </header>
  );
};

export default Header;
