import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const navItems = [
  { path: "/categories", label: "Po kategorijama" },
  { path: "/tests", label: "Simulacija testova" },
  { path: "/marked", label: "Vežbaj obeležena pitanja" },
];

const Header = () => {
  const location = useLocation();

  return (
    <header className="app-header">
      <Link to="/" className="header-logo-link">
        <img className="header-logo" src="/logo_300.png" alt="Catch the License" />
      </Link>
      <nav className="header-nav">
        <ul className="header-nav-list">
          {navItems.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`header-nav-link ${location.pathname === path ? "header-nav-link--active" : ""}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
