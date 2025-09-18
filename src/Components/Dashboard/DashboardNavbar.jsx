import { useState, useEffect, useRef } from "react";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth"


const DashboardNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { user, logoutUser } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
      >
        {isSidebarOpen ? (
          <FaTimes className="w-5 h-5 text-gray-600" />
        ) : (
          <FaBars className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Greeting */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {getGreeting()}
          {user ? `, ${user.first_name}!` : "! 👋"}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          {formatDate(currentTime)} • {formatTime(currentTime)}
        </p>
      </div>

      {/* User Avatar + Dropdown */}
      {user && (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 focus:outline-none"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
              <FaUser className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-40">
              <button
                onClick={() => (window.location.href = "/profile")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={() => logoutUser()}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default DashboardNavbar;
