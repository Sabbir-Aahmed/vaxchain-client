import React from "react";
import { Navigate, useLocation } from "react-router";
import { FaSpinner } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (user === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-teal-500 w-8 h-8 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }
 
  return user ? children : <Navigate to="/login"  />;
}
export default PrivateRoute;
