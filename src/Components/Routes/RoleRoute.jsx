
import { Navigate } from "react-router";
import useAuthContext from "../../Hooks/useAuthContext";


const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuthContext();

  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard/user" replace />;
  }

  return children;
};

export default RoleRoute;
