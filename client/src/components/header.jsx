import React from 'react';
import {Link} from "react-router-dom";
import "./header.css";
import logo from "../assets/logo.png";

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <img src={logo} alt="Logo" className="logo-img" />
      </Link>
      <p className="bio">הצטרפי למהפכת ה-K-Beauty</p>
    </header>
  );
}

export default Header;
