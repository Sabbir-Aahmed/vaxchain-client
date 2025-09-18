// Sidebar.jsx
import {
  FaPlus,
  FaExternalLinkSquareAlt,
  FaCalendarCheck,
  FaStar,
  FaHome,
  FaChartBar,
  FaTimes,
} from "react-icons/fa";
import { Link, useLocation } from "react-router";

const Sidebar = ({ isOpen, onClose, user }) => {
  const location = useLocation();

  // default menu items for staff/doctor
  const allMenuItems = [
    {
      id: "overview",
      label: "Dashboard Overview",
      icon: FaHome,
      path: "/dashboard",
      description: "Main dashboard view",
    },
    {
      id: "campaigns",
      label: "Create Campaigns",
      icon: FaPlus,
      path: "/dashboard/create/campaigns",
      description: "Manage vaccination campaigns",
    },
    {
      id: "allCampaigns",
      label: "All Campaigns",
      icon: FaExternalLinkSquareAlt,
      path: "/dashboard/campaigns",
      description: "Manage vaccination campaigns",
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: FaCalendarCheck,
      path: "/dashboard/bookings",
      description: "Manage bookings",
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: FaStar,
      path: "/dashboard/reviews",
      description: "Customer reviews",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: FaChartBar,
      path: "/dashboard/analytics",
      description: "Performance insights",
    },
  ];


  let menuItems = allMenuItems;

  if (user && user.role === "PATIENT") {
    menuItems = [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: FaHome, // change to home icon
        path: "/dashboard/user", // bookings page
        description: "Your dashboard overview",
      },
    ];
  }

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white 
        h-screen fixed left-0 top-0 shadow-2xl z-50
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div>
            <Link to={'/'}>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400  bg-clip-text text-transparent">
                VaxChain Dashboard
              </h1>
            </Link>
            <p className="text-slate-400 text-sm mt-1">Healthcare Management</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-slate-700 transition-colors"
            aria-label="Close sidebar"
          >
            <FaTimes className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      group hover:bg-slate-700/50 relative
                      ${
                        isActive
                          ? "bg-gradient-to-r from-teal-600 to-cyan-600 shadow-lg shadow-teal-500/25"
                          : "hover:translate-x-1"
                      }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 w-1 h-full bg-teal-400 rounded-r-full"></div>
                    )}
                    <Icon
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-teal-400"
                      }`}
                    />
                    <div className="flex-1">
                      <span
                        className={`font-medium transition-colors duration-200 ${
                          isActive
                            ? "text-white"
                            : "text-slate-300 group-hover:text-white"
                        }`}
                      >
                        {item.label}
                      </span>
                      <p
                        className={`text-xs mt-0.5 transition-colors duration-200 ${
                          isActive
                            ? "text-slate-200"
                            : "text-slate-500 group-hover:text-slate-400"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
