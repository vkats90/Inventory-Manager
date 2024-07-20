import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const links = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Parts", path: "/parts" },
    { name: "Orders", path: "/orders" },
  ];

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h1 className="text-xl font-bold mb-8">Inventory Manager</h1>
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.name} className="mb-4">
              <Link
                to={link.path}
                className={`block p-2 rounded hover:bg-gray-700 transition-colors ${
                  location.pathname === link.path ? "bg-gray-700" : ""
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
