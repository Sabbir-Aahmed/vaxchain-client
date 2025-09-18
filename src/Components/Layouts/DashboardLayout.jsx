import { Outlet, useLocation, useNavigate } from "react-router";
import Sidebar from "../Dashboard/Sidebar";
import { useState } from "react";
import DashboardNavbar from "../Dashboard/DashboardNavbar";
import useAuth from "../../Hooks/useAuth";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  // const navigate = useNavigate();
  // const location = useLocation();

  // useEffect(() => {
  //   if (
  //     user &&
  //     user.role === "PATIENT" &&
  //     location.pathname === "/dashboard"
  //   ) {
  //     navigate("/dashboard/bookings", { replace: true });
  //   }
  // }, [user, location.pathname, navigate]);

  return (
    <div className="min-h-screen flex">
      <Sidebar 
        isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} 
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 bg-gray-50 min-h-screen flex flex-col">
        {/* Navbar */}
        <DashboardNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Page Content with consistent padding */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <Outlet context={{ toggleSidebar, isSidebarOpen }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
