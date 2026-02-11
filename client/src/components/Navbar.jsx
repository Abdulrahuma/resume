import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="text-xl font-bold text-blue-600">
          AI Resume Pro
        </div>

        {/* Links */}
        <div className="flex gap-6 text-sm font-medium">
          <NavLink
            to="/analyze"
            className={({ isActive }) =>
              isActive
                ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                : "text-gray-600 hover:text-blue-600"
            }
          >
            Analyze
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 border-b-2 border-purple-600 pb-1"
                : "text-gray-600 hover:text-purple-600"
            }
          >
            Chat
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
