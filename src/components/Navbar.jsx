import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between shadow">
      
      {/* Logo */}
      <h1 className="text-2xl font-bold tracking-wide">CRM</h1>

      {/* Links */}
      <div className="space-x-6 text-lg">
        <Link to="/dashboard" className="hover:text-gray-200 transition">
          Dashboard
        </Link>
        <Link to="/leads" className="hover:text-gray-200 transition">
          Leads
        </Link>
        <Link to="/profile" className="hover:text-gray-200 transition">
          Profile
        </Link>
      </div>

      {/* Logout Button */}
      <button
        className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
