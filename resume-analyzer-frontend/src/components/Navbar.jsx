import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Logo */}
      <Link
        to="/profile"
        className="text-lg font-semibold text-blue-600"
      >
        AI Resume Analyzer
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-4 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              className="text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              to="/ask"
              className="text-gray-700 hover:text-blue-600"
            >
              Chat
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
